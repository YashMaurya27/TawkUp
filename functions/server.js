// functions/server.js

const { Server } = require("socket.io");
const cors = require("cors");

const corsHandler = cors();

// Initialize socket.io without an HTTP server
const io = new Server({ transports: ["websocket"] });

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
    // Enable CORS
    corsHandler(event, null, () => {});

    // Parse the body if it exists
    const body = event.body ? JSON.parse(event.body) : {};

    // Check the HTTP method and act accordingly
    if (event.httpMethod === "POST") {
      // Handle POST request, e.g., setUser
      if (body.action === "setUser") {
        io.emit("setUser", body.user);
        resolve({
          statusCode: 200,
          body: "setUser executed successfully",
        });
      } else {
        reject({
          statusCode: 400,
          body: "Invalid action",
        });
      }
    } else {
      reject({
        statusCode: 400,
        body: "Invalid HTTP method",
      });
    }
  });
};
