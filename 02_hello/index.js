const currentTime = require("./date");

const dateObject = currentTime();

console.log(`Today is ${dateObject.date}, the current time is ${dateObject.time}`);
