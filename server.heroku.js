const WSServer = require("ws").Server;
const server = require("http").createServer();
const express = require("express");

const app = express();
const port = process.env.PORT || 5000;

const wss = new WSServer({
  server: server,
});

app.use("/api/*", express.json({ limit: "99mb" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add middleware
app.use(express.static("build"));

// Also mount the app here
server.on("request", app);

let sockets = [];
var typerings = {};

const add = ({ id, createdAt, x, y, color, text }) => {
  typerings[id] = { createdAt, x, y, color, text: text ? text : "" };
};
const update = ({ id, x, y, color, text }) => {
  if (x) typerings[id].x = x;
  if (y) typerings[id].y = y;
  if (color) typerings[id].color = color;
  if (text) typerings[id].text = text;
};

wss.on("connection", function connection(socket) {
  socket.id = `${sockets.length}${new Date().getTime()}`;
  sockets.push(socket);

  // Send typerings
  socket.send(JSON.stringify({ action: "load", typerings }));

  socket.on("message", function (message) {
    var lastJsonMessage = JSON.parse(message);
    if (lastJsonMessage.action === "add") {
      add(lastJsonMessage);
    }
    if (lastJsonMessage.action === "update") {
      update(lastJsonMessage);
    }
    sockets.forEach((_socket) => {
      if (_socket.id !== socket.id) {
        _socket.send(message);
      }
    });
  });

  socket.on("close", function () {
    sockets = sockets.filter((s) => s !== socket);
  });
});

setInterval(() => {
  const now = new Date().getTime();

  Object.keys(typerings).forEach((id) => {
    if (typerings[id].createdAt < now - 1 * 60 * 1000) {
      sockets.forEach((_socket) => {
        _socket.send(JSON.stringify({ action: "remove", id }));
      });
      delete typerings[id];
    }
  });
}, 1000);

server.listen(port, function () {
  console.info(`http/ws server listening on ${port}`);
});

process.once("SIGUSR2", function () {
  process.kill(process.pid, "SIGUSR2");
});

process.on("SIGINT", function () {
  // this is only called on ctrl+c, not restart
  process.kill(process.pid, "SIGINT");
});
