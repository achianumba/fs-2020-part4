const express = require("express");
require("express-async-errors");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
//Blog routes
app.use("/api/blogs", require("./controllers/blog"));
//User routes
app.use("/api/users", require("./controllers/users"));
//login
app.use("/api/login", require("./controllers/login"))

//error handler
app.use((err, req, res, next) => {
  require("./utils/logger").error(err.message);
  res.status(400).end();
});

module.exports = app;