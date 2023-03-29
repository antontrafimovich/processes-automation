const { spawn } = require("child_process");
const path = require("node:path");

module.exports = (next) => (wsStream) => {
  wsStream.write("Start fetching...");

  const git = spawn(
    "git",
    ["fetch", "origin", "master", "&&", "git", "rebase", "origin/master"],
    {
      cwd: path.resolve(__dirname, "../../", "esbuild-test"),
      stdio: "pipe",
    }
  );

  git.stdout
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

  git.stdout.setEncoding("utf8").on("error", (err) => {});

  git.on("close", () => {
    console.log("fetch is done");
    wsStream.write("Fetching is done \n");

    next(wsStream);
  });
};
