const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const Filter = require("bad-words");
const {
  generateMessage,
  generateLocationMessage,
} = require("./utils/messages");
const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
} = require("./utils/users");

const app = express();

const publicDirectoryPath = path.join(__dirname, "../public");

app.use(express.json(), express.static(publicDirectoryPath));

const server = http.createServer(app);

const io = socketio(server);

io.on("connection", (socket) => {
  socket.on("join", (otherUserProperties, callback) => {
    const { error, user } = addUser({ id: socket.id, ...otherUserProperties });
    if (error) {
      return callback(error);
    }
    socket.join(user.room);
    socket.emit("message", generateMessage("WELCOME!"));
    socket.broadcast
      .to(user.room)
      .emit("message", generateMessage(`${user.username} has joined!`));
    callback();
  });

  socket.on("sendMessage", (message, callback) => {
    const filter = new Filter();
    if (filter.isProfane(message)) {
      return callback("Profanity is not allowed!");
    }
    io.to("room").emit("message", generateMessage(message));
    callback();
  });

  socket.on("sendLocation", (coords, callback) => {
    io.to("room").emit(
      "locationMessage",
      generateLocationMessage(
        `https://google.com/maps?q=${coords.latitude},${coords.longitude}`
      )
    );
    callback();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        generateMessage(`${user.username} has left!`)
      );
    }
  });
});

module.exports = server;
