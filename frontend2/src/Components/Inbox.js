import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import dayjs from "dayjs";
import "./Inbox.css";
import { useAuth } from "../AuthContext";
import { useLocation } from "react-router-dom";
// Utility functions
const Inbox = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const ws = useRef(null); // Use ref for WebSocket to maintain the same instance
  const { token, user } = useAuth();
  const location = useLocation(); // Hook to access state passed during navigation
  const [isConnected, setIsConnected] = useState(false); // Connection status state
  // Format the date
  const formatDate = (timestamp) => {
    const date = dayjs(timestamp);
    const today = dayjs().startOf("day");
    const yesterday = dayjs().subtract(1, "day").startOf("day");

    if (date.isSame(today, "day")) {
      return "Today";
    }
    if (date.isSame(yesterday, "day")) {
      return "Yesterday";
    }
    return date.format("MMMM D, YYYY"); // e.g., August 28, 2024
  };

  // Format the time
  const formatTime = (timestamp) => {
    return dayjs(timestamp).format("h:mm A"); // e.g., 3:39 PM
  };

  // Group messages by date
  const groupMessagesByDate = (messages) => {
    const groupedMessages = [];
    let currentDate = "";

    messages.forEach((message) => {
      const messageDate = formatDate(message.timestamp);

      if (messageDate !== currentDate) {
        currentDate = messageDate;
        groupedMessages.push({ date: currentDate, type: "date" });
      }
      groupedMessages.push({ ...message, type: "message" });
    });

    return groupedMessages;
  };

  // WebSocket connection setup with connection state management
  useEffect(() => {
    const createSocket = () => {
      if (!token) return;

      ws.current = new WebSocket(
        `${process.env.REACT_APP_API_URL}?token=${token}`
      );

      ws.current.onopen = () => {
        console.log("WebSocket connection opened.");
         setIsConnected(true);
        if (user && user.username) {
          ws.current.send(
            JSON.stringify({
              type: "fetchUsers",
              username: user.username,
            })
          );
          console.log("request send");
        }
      };

      ws.current.onmessage = (event) => {
        try {
          const receivedMessage = JSON.parse(event.data);
          console.log("received message", receivedMessage);
          if (receivedMessage.type === "usersList") {
            setUsers(receivedMessage.users);
          } else if (receivedMessage.type === "previousMessages") {
            setMessages(groupMessagesByDate(receivedMessage.messages));
          } else if (receivedMessage.type === "newMessage") {
            setMessages((prevMessages) =>
              groupMessagesByDate([...prevMessages, receivedMessage])
            );
            console.log("Received message from server:", receivedMessage);
          }
        } catch (error) {
          console.error("Error processing message:", error);
        }
      };

      ws.current.onclose = () => {
        console.log("WebSocket connection closed, reconnecting...");
        setIsConnected(false);
        setTimeout(createSocket, 5000); // Reconnect after 5 seconds
      };
      ws.current.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    };

    createSocket();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [token]);

  
 

  useEffect(() => {
    if (location.state && location.state.selectedUser) {
      // Delay user selection until WebSocket is connected
      if (isConnected) {
        handleUserSelect(location.state.selectedUser); // Automatically select user on load
      }
    }
  }, [location.state, isConnected]); // Dependencies include location.state and isConnected

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    // Filter users based on the search term
    const filteredUsers = users.filter((user) =>
      `${user.firstname} ${user.lastname}`.toLowerCase().includes(term)
    );
    setUsers(filteredUsers);
  };

  const handleUserSelect = async (user2) => {
    if (!user || !user2) {
      console.log("user not found")
      return;
    }
  console.log("user found")
    setSelectedUser(user2);
    try {
      // Safely send the request to fetch messages
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(
          JSON.stringify({
            type: "fetchMessages",
            receiver: user2.username,
            sender: user.username,
          })
        );
      } else {
        console.error(
          "WebSocket is not open. Current state:",
          ws.current?.readyState
        );
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedUser) return;
    console.log(newMessage);
    const message = {
      type: "newMessage",
      sender: user.username,
      receiver: selectedUser.username,
      content: newMessage,
      timestamp: new Date().toISOString(),
    };

    // Send the message via WebSocket with error handling
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      try {
        ws.current.send(JSON.stringify(message));
        console.log("msg send");
      } catch (error) {
        console.error("Error sending message via WebSocket:", error);
      }
    } else {
      console.error(
        "WebSocket is not open. Current state:",
        ws.current?.readyState
      );
    }

    // Update the UI with the new message
    setMessages((prevMessages) =>
      groupMessagesByDate([...prevMessages, message])
    );
    setNewMessage("");
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <input
                type="text"
                className="form-control"
                placeholder="Search users..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <ul className="list-group list-group-flush">
              {users.length > 0 ? (
                users.map((userItem) => (
                  <li
                    key={userItem.id} // Ensure unique key
                    className={`list-group-item ${
                      selectedUser?.id === userItem.id ? "active" : ""
                    }`}
                    onClick={() => handleUserSelect(userItem)}
                    style={{
                      cursor: "pointer",
                      backgroundColor:
                        selectedUser?.id === userItem.id ? "#007bff" : "",
                      color: selectedUser?.id === userItem.id ? "#fff" : "",
                    }}
                  >
                    {userItem.firstname} {userItem.lastname}
                  </li>
                ))
              ) : (
                <li className="list-group-item">No users found</li>
              )}
            </ul>
          </div>
        </div>

        <div className="col-md-8">
          {selectedUser ? (
            <div className="card chat-window">
              <div className="card-header">
                Chat with {selectedUser.firstname} {selectedUser.lastname}
              </div>
              <div className="card-body chat-messages">
                {messages.map((item, index) =>
                  item.type === "date" ? (
                    <div
                      key={`date-${item.date}-${index}`}
                      className="message-date"
                    >
                      {item.date}
                    </div>
                  ) : (
                    <div
                      key={`message-${item.timestamp}-${index}`} // Ensure unique key
                      className={`chat-message ${
                        item.sender === user.username ? "sent" : "received"
                      } row`}
                    >
                      <div className="message-text"> {item.content}</div>
                      <div className="timestamp">
                        {formatTime(item.timestamp)}
                      </div>
                    </div>
                  )
                )}
              </div>
              <div className="card-footer">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control mx-2"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  />
                  <button
                    className="btn btn-icon rounded-pill"
                    onClick={handleSendMessage}
                    aria-label="Send message"
                  >
                    <i className="bi bi-send"></i>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center mt-5">
              <h4>Select a user to start chatting</h4>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Inbox;
