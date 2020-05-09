const userRouter = require("express").Router();
const { hash } = require("bcrypt");
const { sign } = require("jsonwebtoken");
const { newUser, getAllUsers, closeDb } = require("../models/user");

userRouter.post('/login', (request, response) => {
  
});

userRouter.get('/', async (request, response) => {
  const users = await getAllUsers();
  await closeDb();
  response.json(users)
});

userRouter.post("/", async (request, response) => {
  const body = request.body;

  if (
    !body.username ||
    !body.name ||
    !body.password ||
    body.username.length < 3 ||
    body.password.length < 3
  ) {
    response.status(400).json({ error: "Please fill out all fields" });
  } else {
    const passwordHash = await hash(body.password, 10);

    const user = {
      username: body.username,
      name: body.name,
      passwordHash: passwordHash
    };

    const savedUser = await newUser(user).save();
    closeDb()
    response.json(savedUser);
  }
});

module.exports = userRouter;