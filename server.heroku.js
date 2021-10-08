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
  if (typerings[id]) {
    typerings[id] = { createdAt, x, y, color, text: text ? text : "" };
  }
};

const update = ({ id, x, y, color, text }) => {
  if (typerings[id]) {
    if (x) typerings[id].x = x;
    if (y) typerings[id].y = y;
    if (color) typerings[id].color = color;
    if (text) typerings[id].text = text;
  }
};

const flush = () => {
  typerings = {};
};

const updateCounter = () => {
  sockets.forEach((_socket) => {
    if (_socket.readyState === 1) _socket.send(JSON.stringify({ action: "counter", value: sockets.length }));
  });
};

wss.on("connection", function connection(socket) {
  socket.id = `${sockets.length}${new Date().getTime()}`;
  sockets.push(socket);

  // Send typerings
  if (socket.readyState === 1) socket.send(JSON.stringify({ action: "load", typerings }));

  // Update counter
  updateCounter();

  socket.on("message", function (message) {
    var lastJsonMessage = JSON.parse(message);
    if (lastJsonMessage.action === "add") {
      add(lastJsonMessage);
    }
    if (lastJsonMessage.action === "update") {
      update(lastJsonMessage);
    }
    if (lastJsonMessage.action === "update") {
      update(lastJsonMessage);
    }
    if (lastJsonMessage.action === "flush") {
      flush();
    }
    sockets.forEach((_socket) => {
      if (_socket.id !== socket.id) {
        if (_socket.readyState === 1) _socket.send(message);
      }
    });
  });

  socket.on("close", function () {
    sockets = sockets.filter((s) => s !== socket);
    // Update counter
    updateCounter();
  });
});

// const removeTyperingsByDuration = () => {
//   const now = new Date().getTime();

//   Object.keys(typerings).forEach((id) => {
//     if (typerings[id].createdAt < now - 1 * 60 * 1000) {
//       sockets.forEach((_socket) => {
//         _socket.send(JSON.stringify({ action: "remove", id }));
//       });
//       delete typerings[id];
//     }
//   });
// };

const sortByCreatedAt = (a, b) => {
  const dateA = new Date(parseInt(a.split(":::")[0]));
  const dateB = new Date(parseInt(b.split(":::")[0]));
  return dateB - dateA;
};

const removeTyperingsByCount = () => {
  const limit = 50;
  const ids = Object.keys(typerings).slice().sort(sortByCreatedAt);

  if (ids.length > limit) {
    const diff = limit - ids.length;
    const idsToRemove = ids.splice(diff);
    idsToRemove.forEach((id) => {
      sockets.forEach((_socket) => {
        if (_socket.readyState === 1) _socket.send(JSON.stringify({ action: "remove", id }));
      });
      delete typerings[id];
    });
  }
};

setInterval(() => {
  removeTyperingsByCount();
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
