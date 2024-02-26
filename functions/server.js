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

// Export the Netlify function handler
exports.handler = async (event) => {
  // Wrap the server logic in a Promise to handle async behavior
  return new Promise((resolve, reject) => {
    // Pass the event to the server
    server.emit("request", event);

    // Resolve the Promise to signal completion
    resolve({
      statusCode: 200,
      body: "Function executed successfully",
    });
  });
};
