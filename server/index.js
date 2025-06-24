const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use(cors({ origin: "http://localhost:5173" }));

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("join", (username) => {
    socket.username = username;
    socket.broadcast.emit("message", `${username} joined the chat`);
  });

  socket.on("chatMessage", (msg) => {
    io.emit("message", `${socket.username}: ${msg}`);
  });

  socket.on("disconnect", () => {
    if (socket.username) {
      io.emit("message", `${socket.username} left the chat`);
    }
  });
});

server.listen(PORT, () => {
  console.log("Server running on http://localhost:5000");
});
