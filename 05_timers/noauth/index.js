const express = require("express");
const nunjucks = require("nunjucks");
const {nanoid} = require("nanoid");

const app = express();

nunjucks.configure("views", {
  autoescape: true,
  express: app,
  tags: {
    blockStart: "[%",
    blockEnd: "%]",
    variableStart: "[[",
    variableEnd: "]]",
    commentStart: "[#",
    commentEnd: "#]",
  },
});

app.set("view engine", "njk");

app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index");
});

let TIMERS = [];

app.get("/api/timers", async (req, res) => {
  const {isActive} = await req.query;

  let timers = TIMERS.filter((el) => el.isActive.toString() === isActive).map((el) => {
    if (el.isActive) {
      el.progress = Date.now() - el.start;
    }
    return el;
  });
  if (timers.length > 0) {
    return res.status(200).json(timers);
  }
  return res.status(204).end();
});

app.post("/api/timers", (req, res) => {
  const {description} = req.body;
  const id = nanoid();
  const timer = {
    start: Date.now(),
    description,
    isActive: true,
    id,
  };
  TIMERS.push(timer);
  return res.status(201).json({id});
});

app.post("/api/timers/:id/stop", (req, res) => {
  const id = req.params.id;
  TIMERS = TIMERS.map((el) => {
    if (el.id === id) {
      delete el.progress;
      el.end = Date.now();
      el.duration = el.end - el.start;
      el.isActive = false;
    }
    return el;
  });
  return res.status(200).json({id});
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`  Listening on http://localhost:${port}`);
});
