const axios = require("axios");

const baseUrl = "https://swapi.dev/api/people/?search=";

const count = [];
const heights = new Map();

const getSwapiInfo = async (name) => {
  const response = await axios(baseUrl + name).catch((e) => console.log(e));
  const data = await response.data;
  count.push(data.count);

  if (data.count > 0) {
    data.results.forEach((el) => {
      heights.set(el.name, parseInt(el.height));
    });
  }
};

const promises = [];

for (let i = 2; i < process.argv.length; i++) {
  promises.push(getSwapiInfo(process.argv[i]));
}

Promise.all(promises)
  .then(() => {
    console.log(
      "Total results: ",
      count.reduce((x, y) => x + y, 0)
    );
    console.log("All: ", [...heights.keys()].sort().join(", "));
    console.log("Min height: ", [...heights].reduce((x, y) => (x[1] < y[1] ? x : y)).join(", "));
    console.log("Min height: ", [...heights].reduce((x, y) => (x[1] > y[1] ? x : y)).join(", "));
  })
  .catch((e) => {
    console.log(e);
  });
