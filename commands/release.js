const { spawn } = require("child_process");
const path = require("node:path");
const { pipeline } = require("stream");
const { EOL } = require("os");

module.exports = (next) => (wsStream) => {
  const lr = spawn("node", ["linereader.js"], {
    cwd: path.resolve(__dirname, "../", "public"),
    stdio: "pipe",
  });

  lr.stdout
    .setEncoding("utf8")
    .on("data", (chunk) => {
      wsStream.write(chunk);
    })
    .on("error", (err) => {
      if (err) {
        console.error(err);
        wsStream.end(err);
      }
    });

  wsStream.on("data", (chunk) => {
    lr.stdin.write(chunk + EOL);
  });

  lr.on("close", () => {
    wsStream.end("Processing is done");
  });
};
