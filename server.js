const { WebSocketServer, createWebSocketStream } = require("ws");

const { build, fetch, release } = require("./commands");

const wss = new WebSocketServer({ port: 8081 });

wss.on("listening", () => {
  console.log(`Start websocket server on the ws://localhost:${8081}`);
});

wss.on("connection", (wss) => {
  const wsStream = createWebSocketStream(wss, {
    encoding: "utf-8",
    defaultEncoding: "utf-8",
    decodeStrings: false,
  });

  wss.on("close", () => {
    wsStream.end();
  });

  wsStream.on("error", (data) => {
    console.log(data);
  });

  console.log("Connection has been established");

  const command = [build, fetch].reduce(
    (result, next) => next(result),
    release()
  );
  command(wsStream);
});

wss.on("error", (err) => {
  console.error("WebSocketServer error:", err);
});
