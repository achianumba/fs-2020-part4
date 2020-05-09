const express = require("express");
require("express-async-errors");
const app = express();
const cors = require("cors");
const { getToken } = require("./utils/middleware");

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//User routes
app.use("/api/users", require("./controllers/users"));
//login
app.use("/api/login", require("./controllers/login"));

//custom middleware for creating request.token
//for checking if a user is logged in while
//creating posts
app.use(getToken);
//Blog routes
app.use("/api/blogs", require("./controllers/blog"));

//error handler
app.use((err, req, res, next) => {
  require("./utils/logger").error(err.message);
  res.status(400).end();
});

module.exports = app;