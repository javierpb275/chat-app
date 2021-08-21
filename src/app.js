const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");

const app = express();

const publicDirectoryPath = path.join(__dirname, "../public");

app.use(express.json(), express.static(publicDirectoryPath));

const server = http.createServer(app);

const io = socketio(server);

let count = 0;

//server (emit) -> cliente (receive) - countUpdated
//client (emit) -> server (receive) - increment

io.on("connection", (socket) => {
  console.log("New WebSocket connection");

  socket.emit("countUpdated", count);

  socket.on("increment", () => {
    count++;
    io.emit("countUpdated", count);
  });
});

module.exports = server;
