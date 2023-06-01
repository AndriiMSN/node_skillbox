const { findBySession } = require("../utils/db");

const isAuth = () => async (req, res, next) => {
  if (!req.cookies["sessionId"]) return next();

  const user = await findBySession(req.cookies["sessionId"]);
  // console.log("userbysession--->", user);
  if (user) {
    req.user = user;
    req.sessionId = req.cookies["sessionId"];
  }
  next();
};

module.exports = {
  isAuth,
};
