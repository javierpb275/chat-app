const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");

const app = express();

const publicDirectoryPath = path.join(__dirname, "../public");

app.use(express.json(), express.static(publicDirectoryPath));

const server = http.createServer(app);

const io = socketio(server);

io.on("connection", (socket) => {//run code when a given client connected
  socket.emit("message", "WELCOME!");//emit to that particular connection

  socket.broadcast.emit('message', 'A new user has joined!')//emit to everybody but that particular connection

  socket.on("sendMessage", (message) => {
    io.emit("message", message);//send to everyone
  });

  socket.on('disconnect', () => {
    io.emit('message', 'A user has left');//when user disconnect, send message to  other users connected
  })
});

module.exports = server;
