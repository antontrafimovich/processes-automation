const WebSocket = require("ws");
const readline = require("node:readline");
const { stdin, stdout, exit } = require("process");

const rl = readline.createInterface({ input: stdin, output: stdout });

const ws = new WebSocket("ws://localhost:8081");

ws.on("open", () => {
  console.log("WS connection is open");
});

ws.on("message", (chunk) => {
  console.log(chunk.toString());

  if (chunk.includes("Hello")) {
    rl.on("line", (line) => {
      ws.send(line);
    });
  }
});

ws.on("error", (err) => {
  if (err.code === "ECONNREFUSED") {
    console.error("Deployment server is down");
    return;
  }

  console.error(err);
});

ws.on("close", (code, reason) => {
  console.log("WS connection is closed, reason:", reason.toString());
  exit(1);
});
