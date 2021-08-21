const socket = io();

socket.on("countUpdated", (count) => {
  console.log("count updated!", count);
});

document.querySelector("#increment").addEventListener("click", () => {
  socket.emit("increment");
});
