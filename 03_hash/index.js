// Modules
const fs = require("fs");
const chalk = require("chalk");
const crypto = require("crypto");
// const path = require("path")

// Constants
const filePath = process.argv[2];

// Check if file exists
if (fs.existsSync(filePath)) {
  console.log(chalk.greenBright("Start Reading file"));

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
          //
          const hash = crypto.createHash("sha256", dataFile).digest("hex");
          const existedHash = data.toString().trim();
          console.log(hash.toString());
          console.log(existedHash);
        }
      });
    }
  });
} else {
  console.log(chalk.redBright("NOT EXISTS"));
  process.exit(100);
}
