const readline = require("node:readline");
const process = require("node:process");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Hello", (answer) => {
  console.log("Answer:", answer);
  process.exit(1);
});
