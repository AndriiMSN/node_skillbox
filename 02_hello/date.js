const { format } = require("date-fns");

const currentTime = () => {
  return {
    date: format(new Date(), "dd-MM-yyyy"),
    time: format(new Date(), "kk:mm:ss"),
  };
};

module.exports = currentTime;
