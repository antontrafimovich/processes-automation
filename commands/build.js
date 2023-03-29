const { spawn } = require("child_process");
const path = require("node:path");
const { pipeline } = require("stream");
const { EOL } = require("os");

module.exports = (next) => (wsStream) => {
  wsStream.write("Start building...");

  const build = spawn("node", ["config.js"], {
    cwd: path.resolve(__dirname, "../../", "esbuild-test", "apps", "parent"),
    stdio: "pipe",
  });

  build.stdout
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

  build.on("close", () => {
    wsStream.write("Finished building \n");

    next(wsStream);
  });
};
