const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");

const app = express();

const publicDirectoryPath = path.join(__dirname, "../public");

app.use(express.json(), express.static(publicDirectoryPath));

const server = http.createServer(app);

const io = socketio(server);

io.on("connection", (socket) => {
  socket.emit("message", "WELCOME!");

  socket.on("sendMessage", (message) => {
    io.emit("message", message);
  });
});

module.exports = server;
