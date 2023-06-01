// Modules
const fs = require("fs");
const chalk = require("chalk");
const crypto = require("crypto");
const axios = require("axios");

// Constants
const equalHashes = (hash, existedHash) => {
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
};
// const download = (url, pathLocal, callback, isSha) => {
//   request(url, (err, res) => {
//     if (res.statusCode === 200) {
//       if (!fs.existsSync("./test-files2")) {
//         fs.mkdir(path.join(__dirname, "./test-files2"), (err) => {
//           if (err) {
//             return console.error(err);
//           }
//           console.log(chalk.yellowBright("Directory created successfully!"));
//           if (!isSha) {
//             console.log(chalk.blueBright("Starting downloading..."));
//           }
//           request(url).pipe(fs.createWriteStream(pathLocal)).on("close", callback);
//         });
//       } else {
//         if (!isSha) {
//           console.log(chalk.blueBright("Starting downloading..."));
//         }
//         request(url).pipe(fs.createWriteStream(pathLocal)).on("close", callback);
//       }
//     } else {
//       console.log(chalk.redBright("Status : ", res.statusCode), chalk.blue(isSha ? "...sha256" : "...file"));
//     }
//   });
// };
const checkHashesLocal = (filePath) => {
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
            process.exit(101);
          } else {
            // Create hash
            const hash = crypto.createHash("sha256").update(dataFile).digest("hex").trim();
            // SHA256 Current hash
            const existedHash = data.toString().trim();

            equalHashes(hash, existedHash);
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

  (async () => {
    console.log(chalk.blueBright("Starting reading files from URL..."));

    const buffer = await axios
      .get(filePath, { responseType: "arraybuffer" })
      .then((response) => {
        console.log(chalk.greenBright("File has read..."));
        return response.data;
      })
      .catch(() => {
        console.log(chalk.redBright("Error can't read file"));
        process.exit(100);
      });

    const sha256 = await axios
      .get(filePath + ".sha256", { responseType: "arraybuffer" })
      .then((response) => {
        console.log(chalk.greenBright("SHA256 has read..."));
        return response.data;
      })
      .catch(() => {
        console.log(chalk.redBright("Error can't read sha256"));
        process.exit(101);
      });

    try {
      const hash = crypto.createHash("sha256").update(Buffer.from(buffer, "hex")).digest("hex").trim();
      // SHA256 Current hash
      const existedHash = Buffer.from(sha256).toString().trim();

      equalHashes(hash, existedHash);
    } catch (e) {
      console.log(chalk.redBright(e));
    }
  })();
} else {
  checkHashesLocal(process.argv[2]);
}
