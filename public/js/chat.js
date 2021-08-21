const socket = io();

socket.on("message", (message) => {
  console.log(message);
});

/*
socket.on("countUpdated", (count) => {
  console.log("count updated!", count);
});

document.querySelector("#increment").addEventListener("click", () => {
  socket.emit("increment");
}); */
