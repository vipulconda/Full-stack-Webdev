const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const Message = require('./models/chats'); // Adjust the path accordingly
const ConnectedUsers = require('./models/ConnectedUsers');
const wss = new WebSocket.Server({ noServer: true });
const secret_key = '123456'; // Replace with your actual secret key

// Store active WebSocket connections
const activeConnections = new Map();

wss.on('connection', (ws, request) => {
  console.log('WebSocket connection established');

  // Set user based on the authenticated user
  const user = request.user;
  ws.user = user;

  // Add the connected user to active connections
  activeConnections.set(user.username, ws);

  ws.on('message', async (message) => {
    try {
      const parsedMessage = JSON.parse(message);
      const { receiver, content, sender, type } = parsedMessage;

      if (type === 'fetchUsers') {
        // Fetch connected users (you may need to adjust this based on your model structure)
        const users = await ConnectedUsers(user.username) // Assumed method
        ws.send(JSON.stringify({ type: 'usersList', users }));
        console.log('User list was sent');
      } else if (type === 'fetchMessages') {
        // Fetch previous messages between the sender and receiver
        const messages = await Message.find({
          $or: [
            { sender, receiver },
            { sender: receiver, receiver: sender },
          ],
        }).sort({ timestamp: 1 });

        // Send the messages to the client
        ws.send(JSON.stringify({ type: 'previousMessages', messages }));
      } else if (type === 'newMessage') {
        // Save the message in the database
        const newMessage = await Message.create({
          sender,
          receiver,
          content,
          timestamp: Date.now(),
        });

        // Check if the receiver is online
        const receiverClient = activeConnections.get(receiver);
        if (receiverClient) {
          // Send message to the receiver if they're online
          receiverClient.send(JSON.stringify({
            type: 'newMessage',
            sender,
            receiver,
            content,
          }));
          console.log('Message sent to receiver');
        } else {
          // Log that receiver is offline, message is stored in DB
          console.log(`Receiver ${receiver} is offline. Message stored.`);
        }

        // Send an acknowledgment to the sender
        ws.send(JSON.stringify({ type: 'messageSent', newMessage }));
      } else {
        console.error('Unknown message type:', type);
      }
    } catch (error) {
      console.error('Error handling message:', error);
    }
  });

  ws.on('close', () => {
    console.log(`WebSocket connection closed for user ${user.username}`);
    activeConnections.delete(user.username); // Remove from active connections
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// Attach the WebSocket server to the existing HTTP server
module.exports = {
  attach: (server) => {
    server.on('upgrade', (request, socket, head) => {
      try {
        const url = new URL(request.url, `http://${request.headers.host}`);
        const token = url.searchParams.get('token');

        if (!token) {
          socket.destroy(); // Reject connection if no token is provided
          return;
        }

        // Verify the JWT token
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
