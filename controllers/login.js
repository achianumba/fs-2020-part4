const loginRouter = require("express").Router();
const { compare } = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getUserByUsername } = require("../models/user");

loginRouter.post("/", async (request, response) => {
  const user = await getUserByUsername(request.body.username);
  //user not found
  if (user === null) {
    return response.status(404).json({ error: "That username does not exist" });
  }
  //wrong credentials
  const correctPassword = await compare(
    request.body.password,
    user.passwordHash
  );
  if (!(user && correctPassword)) {
    return response.status(401).json({ error: "Invalid username or password" });
  }
  //if user exists and signs in with the correct password
  // 0. create object to pass to token
  const tokenUser = {
    username: user.username,
    id: user._id,
  };

  // 1. sign token
  const token = jwt.sign(tokenUser, process.env.SECRET);
  // 2. send token and user details back to browser
  response
    .status(200)
    .json({ token, username: user.username, name: user.name });
});

module.exports = loginRouter;
