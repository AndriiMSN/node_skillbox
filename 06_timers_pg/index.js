require("dotenv").config();
const express = require("express");
// const pg = require("pg");
const nunjucks = require("nunjucks");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth");
const timersRoutes = require("./routes/timerRoutes");
const { isAuth } = require("./middleware/auth");
// const knex = require("knex");

const app = express();

// const pg = require("knex")({
//   client: "pg",
//   connection: process.env.DB_CONNECTION
// });

// (async () => {
//   const [id] = await pg("users").insert({ user_name: "yhhyhy", password: pg.raw("crypt('123', gen_salt('md5'))") })
//     .returning("id").then(data => {
//       return data;
//     }).catch((e) => {
//       console.log(e);
//     });
//   console.log(id);
// })();

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
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(cookieParser("timers"));

app.get("/", isAuth(), (req, res) => {
  res.render("index", {
    user: req.user,
    authError: req.query.authError === "true" ? "Wrong username or password" : req.query.authError,
  });
});

app.use("/auth", authRoutes);
app.use("/api/timers", timersRoutes);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`  Listening on http://localhost:${port}`);
});
