// Modules
const fs = require("fs");
const chalk = require("chalk");
const crypto = require("crypto");
// const path = require("path")

// Constants
const filePath = process.argv[2];

// Check if file exists
if (fs.existsSync(filePath)) {
  console.log(chalk.greenBright("Start Reading file..."));

  // Read sha256
  fs.readFile(filePath + ".sha256", (err, data) => {
    if (err) {
      console.log(chalk.redBright(err));
      process.exit(101);
    } else {
      // If sha 256 exists
      fs.readFile(filePath, (err, dataFile) => {
        if (err) {
          console.log(chalk.redBright(err));
          process.exit(100);
        } else {
          // Create hash
          const hash = crypto.createHash("sha256", dataFile).update("").digest("hex").trim();
          // SHA256 Current hash
          const existedHash = data.toString().trim();

          console.table([
            ["Crypto", hash],
            ["SHA256", existedHash],
          ]);
          if (hash === existedHash) {
            console.log(chalk.greenBright("HASH ARE EQUALS"));
            process.exit(0);
          } else {
            console.log(chalk.redBright("HASH ARE NOT EQUALS"));
            process.exit(102);
          }
        }
      });
    }
  });
} else {
  console.log(chalk.redBright("NOT EXISTS"));
  process.exit(100);
}
