const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { transports: ["websocket"] });

app.use(cors());

// {
//     origin: "http://localhost:3000",
//     methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//     credentials: true,
//     allowedHeaders: "Content-Type",
//   }

const connectedUsers = {}; // To store connected users and their corresponding sockets
// console.log("connectedUsers", connectedUsers);
io.on("connection", (socket) => {
  console.log("User connected");
  let currentUserId;
  // Set up user information when a user connects
  socket.on("setUser", (user) => {
    connectedUsers[user.id] = socket;
    currentUserId = user.id;
    console.log("userSet", connectedUsers);
  });

  // Listen for incoming private messages
  socket.on("privateMessage", (data, check) => {
    const { receiverId, message } = data;
    console.log("sending on server file", receiverId, message, data);
    // Check if the receiver is connected, then send the message privately
    if (connectedUsers[receiverId]) {
      connectedUsers[receiverId].emit("privateMessage", {
        senderId: socket.id,
        message,
        userId: currentUserId,
      });
    } else {
      console.log("user", receiverId, "not connected");
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
    // Remove the user from the connected users list upon disconnection
    delete connectedUsers[socket.id];
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
