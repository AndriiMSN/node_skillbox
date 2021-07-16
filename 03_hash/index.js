// Modules
const fs = require("fs");
const chalk = require("chalk");
const crypto = require("crypto");
const path = require("path");
const request = require("request");

// Constants

const download = (url, pathLocal, callback, isSha) => {
  request(url, (err, res) => {
    if (res.statusCode === 200) {
      if (!fs.existsSync("./test-files2")) {
        fs.mkdir(path.join(__dirname, "./test-files2"), (err) => {
          if (err) {
            return console.error(err);
          }
          console.log(chalk.yellowBright("Directory created successfully!"));
          if (!isSha) {
            console.log(chalk.blueBright("Starting downloading..."));
          }
          request(url).pipe(fs.createWriteStream(pathLocal)).on("close", callback);
        });
      } else {
        if (!isSha) {
          console.log(chalk.blueBright("Starting downloading..."));
        }
        request(url).pipe(fs.createWriteStream(pathLocal)).on("close", callback);
      }
    } else {
      console.log(chalk.redBright("Status : ", res.statusCode), chalk.blue(isSha ? "...sha256" : "...file"));
    }
  });
};
const checkHashes = (filePath) => {
  if (fs.existsSync(filePath)) {
    console.log(chalk.blueBright("Start Reading files..."));

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
            const hash = crypto.createHash("sha256").update(dataFile).digest("hex").trim();
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
};

// Check if file exists

if (/^http([s]|):\/\//.test(process.argv[2])) {
  const filePath = process.argv[2];

  const splitURL = filePath.split("/");
  const filename = splitURL[splitURL.length - 1];

  download(
    filePath,
    "./test-files2/" + filename,
    () => {
      console.log(chalk.greenBright("Downloading file finished..."));
      console.log(chalk.blueBright("Starting downloading sha256..."));

      download(
        filePath + ".sha256",
        "./test-files2/" + filename + ".sha256",
        () => {
          console.log(chalk.greenBright("Downloading .256 finished..."));
          checkHashes("./test-files2/" + filename);
        },
        true
      );
    },
    false
  );
} else {
  checkHashes(process.argv[2]);
}
