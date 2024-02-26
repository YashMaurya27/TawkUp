const { io } = require("./server");

const handler = async (event, context) => {
  // Handle your Netlify function logic here

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

    // Set up user information when a user connects
    socket.on("setUser", (user) => {
      connectedUsers[user.id] = socket;
      console.log("userSet", connectedUsers);
    });

    // Listen for incoming private messages
    socket.on("privateMessage", (data) => {
      const { receiverId, message } = data;
      console.log("sending on server file", receiverId, message);
      // Check if the receiver is connected, then send the message privately
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
      // Remove the user from the connected users list upon disconnection
      delete connectedUsers[socket.id];
    });
  });

  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Function executed successfully" }),
  };
};

module.exports = { handler };
