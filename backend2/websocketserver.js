const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const Message = require('./models/chats'); // Adjust the path according to your project structure
const wss = new WebSocket.Server({ noServer: true });
const secret_key = '123456'; // Replace with your actual secret key
const ConnectedUsers=require('./models/ConnectedUsers')
wss.on('connection', (ws, request) => {
  console.log('WebSocket connection established');
  
  // Set user based on the authenticated user
  ws.user = request.user; 

  ws.on('message',async (message) => {
    try {
      const parsedMessage = JSON.parse(message);
      const { receiver, content, sender, type } = parsedMessage;
      const data=parsedMessage
       console.log(parsedMessage)
       if (data.type === 'fetchUsers') {
        const users = await ConnectedUsers(data.username);
        console.log("users",users)
        ws.send(JSON.stringify({ type: 'usersList', users : users }));
        console.log("user list was sent")
       }
     else if (type === 'fetchMessages') {
        // Fetch previous messages from the database
        const messages = await Message.find({
          $or: [
            { sender, receiver },
            { sender: receiver, receiver: sender }
          ]
        }).sort({ timestamp: 1 });

        // Send the messages to the client
        ws.send(JSON.stringify({ type: 'previousMessages', messages }));
      } else if (type === 'newMessage') {
        // Handle sending message
        const receiverClient = Array.from(wss.clients).find(client => client.user.username === receiver);
        if (!receiverClient) {
          // Store message in the database if the receiver is offline
          await Message.create({ sender, receiver, content, timestamp: Date.now() });
        } else {
          // Send message if the receiver is online
          receiverClient.send(JSON.stringify({ type: 'newMessage', sender, receiver, content }));
          console.log("message send to receiver")
        }
      } else {
        console.error('Unknown message type:', type);
      }
    } catch (error) {
      console.error('Error handling message:', error);
    }
  });

  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

module.exports = {
  attach: (server) => {
    server.on('upgrade', (request, socket, head) => {
      try {
        // Parse the token from the query parameters
        const url = new URL(request.url, `http://${request.headers.host}`);
        const token = url.searchParams.get('token');

        if (!token) {
          socket.destroy(); // Reject connection if no token is provided
          return;
        }

        // Verify the token
        jwt.verify(token, secret_key, (err, decoded) => {
          if (err) {
            socket.destroy(); // Reject connection if token is invalid
            return;
          }

          // Attach the user info to the request
          request.user = decoded;

          // Complete the WebSocket handshake
          wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit('connection', ws, request);
          });
        });
      } catch (error) {
        console.error('WebSocket upgrade error:', error);
        socket.destroy(); // Ensure socket is destroyed on error
      }
    });
  },
};
