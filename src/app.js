const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");

const app = express();

const publicDirectoryPath = path.join(__dirname, "../public");

app.use(express.json(), express.static(publicDirectoryPath));

const server = http.createServer(app);

const io = socketio(server);

io.on("connection", () => {
  console.log("New WebSocket connection");
});

module.exports = server;
