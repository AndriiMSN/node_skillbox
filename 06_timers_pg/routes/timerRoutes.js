const express = require("express");
const router = express.Router();
const { getTimers, createTimer, stopTimer } = require("../utils/db");
const { isAuth } = require("../middleware/auth");

router.get("/", isAuth(), async (req, res) => {
  if (!req.user) return res.sendStatus(401);
  // console.log("user req-->", req.user);
  let { isActive } = req.query;
  isActive = isActive === "true";
  let timers = await getTimers(req.user.id, isActive);
  // console.log("timers-->", timers);
  if (timers && timers.length > 0) {
    return res.status(200).json(timers);
  }
  return res.status(204).end();
});

router.post("/", isAuth(), async (req, res) => {
  if (!req.user) return res.sendStatus(401);

  const { description } = req.body;
  const id = await createTimer(req.user.id, description);
  return res.status(201).json({ id });
});

router.post("/:id/stop", isAuth(), (req, res) => {
  if (!req.user) return res.sendStatus(401);

  const id = req.params.id;
  const isDelete = stopTimer(req.user.id, id);
  if (isDelete) {
    return res.status(200).json({ id });
  }
  return res.status(400).json({ id, error: "Timer not found" });
});

module.exports = router;
