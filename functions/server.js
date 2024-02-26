// functions/server.js

const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const corsHandler = cors();

const server = createServer((req, res) => {
  corsHandler(req, res, () => {
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Access-Control-Allow-Headers"
    );

    // Your socket.io logic remains unchanged here...

    // For simplicity, you can handle different routes (e.g., /privateMessage) here.
    // You may want to use Express if your app grows.

    res.statusCode = 404;
    res.end("Not Found");
  });
});

const io = new Server(server, { transports: ["websocket"] });

const connectedUsers = {};

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("setUser", (user) => {
    connectedUsers[user.id] = socket;
    console.log("userSet", connectedUsers);
  });

  socket.on("privateMessage", (data) => {
    const { receiverId, message } = data;
    console.log("sending on server file", receiverId, message);

    if (connectedUsers[receiverId]) {
      connectedUsers[receiverId].emit("privateMessage", {
        senderId: socket.id,
        message,
      });
      console.log("message emitted");
    } else {
      console.log("user", receiverId, "not connected");
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
    delete connectedUsers[socket.id];
  });
});

// The function handler
exports.handler = (event, context) => {
  // 'server' is already created above. Here, we just pass the event and context to the server.
  // This is a simple setup; you may want to handle different routes, headers, etc., as your app requires.

  // Make sure to export the server in your Netlify function.
  server(event, context);
};
