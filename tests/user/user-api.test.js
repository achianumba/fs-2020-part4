const supertest = require("supertest");
const api = supertest(require("../../app"));
const { deleteAllUsers } = require("../../models/user");
const {
  invalidUsername,
  invalidName,
  invalidPassword,
  users,
} = require("./user_helper");

beforeAll(async () => {
  await deleteAllUsers();
});

test("Creating a user with an invalid username fails", async () => {
  const invalidUsernameRequest = await api
    .post("/api/users")
    .send(invalidUsername);
  expect(invalidUsernameRequest.status).toBe(400);
});

test("Creating a user with no name fails", async () => {
  const invalidNameRequest = await api.post("/api/users").send(invalidName);
  expect(invalidNameRequest.status).toBe(400);
});

test("Creating a user with an invalid password fails", async () => {
  const invalidPasswordRequest = await api
    .post("/api/users")
    .send(invalidPassword);
  expect(invalidPasswordRequest.status).toBe(400);
});

test("Creating a user with valid credentials is successful", async () => {
  const validUserRequest = await api.post("/api/users").send(users[0]);
  expect(validUserRequest.status).toBe(200);
});

test("Duplicate usernames are not allowed", async () => {
  const duplicateValidUserRequest = await api.post("/api/users").send(users[0]);
  expect(duplicateValidUserRequest.status).toBe(400);
});
