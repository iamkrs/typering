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
wss.on("connection", function connection(socket) {
  socket.id = `${sockets.length}${new Date().getTime()}`;
  sockets.push(socket);

  socket.on("message", function (message) {
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

server.listen(port, function () {
  console.info(`http/ws server listening on ${port}`);
});
