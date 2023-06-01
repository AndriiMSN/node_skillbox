const axios = require("axios");

const baseUrl = "https://swapi.dev/api/people/?search=";

const countArray = [];
const heights = new Map();

const getSwapiInfo = async (name) => {
  const response = await axios(baseUrl + name).catch((e) => console.log(e.status));
  const data = await response.data;
  const count = data.count;

  countArray.push(count);
  if (count > 0) {
    data.results.forEach((el) => {
      heights.set(el.name, parseInt(el.height));
    });
  } else if (count === 0) {
    console.log("No results found for " + name);
  }
};

const promises = [];

for (let i = 2; i < process.argv.length; i++) {
  promises.push(getSwapiInfo(process.argv[i]));
}

Promise.all(promises)
  .then(() => {
    if (heights.size > 0) {
      console.log(countArray);
      console.log(
        "Total results: ",
        countArray.reduce((x, y) => x + y, 0)
      );
      console.log("All: ", [...heights.keys()].sort().join(", "));
      console.log("Min height: ", [...heights].reduce((x, y) => (x[1] < y[1] ? x : y)).join(", "));
      console.log("Min height: ", [...heights].reduce((x, y) => (x[1] > y[1] ? x : y)).join(", "));
    } else if (heights.size === 0) {
      console.log("No results found");
    }
  })
  .catch((e) => {
    console.log(e);
  });
