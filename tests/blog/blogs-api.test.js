const app = require("../../app");
const { deleteAllBlogs } = require("../../models/blog");
const { deleteAllUsers } = require("../../models/user");
const supertest = require("supertest");
const {
  blogs,
  oneBlog,
  user,
  userLogin,
  invalidUserLogin,
} = require("./blogs-api_helper");

//create a super agent by wrapping express app in superset
const api = supertest(app);

//runs before all tests in this file
beforeAll(async () => {
  await deleteAllUsers();
  await api.post("/api/users").send(user);
  await deleteAllBlogs();
});

test("Users can't create blogs without being logged in", async () => {
  const createBlog = await api.post("/api/blogs").send(oneBlog);
  expect(createBlog.status).toBe(401);
});

test("A logged in user can create blogs and the correct number of blogs are returned in json format", async () => {
  const loginResponse = await api.post("/api/login").send(userLogin);
  const { id, token } = loginResponse.body;

  const blog1 = await api
    .post("/api/blogs")
    .send({ ...blogs[0], user: id })
    .set("Authorization", `Bearer ${token}`);

  const blog2 = await api
    .post("/api/blogs")
    .send({ ...blogs[1], user: id })
    .set("Authorization", `Bearer ${token}`);

  const blog3 = await api
    .post("/api/blogs")
    .send({ ...blogs[2], user: id })
    .set("Authorization", `Bearer ${token}`);

  const res = await api.get("/api/blogs");

  expect(blog1.status).toBe(201);
  expect(blog2.status).toBe(201);
  expect(blog3.status).toBe(201);
  expect(res.type).toMatch(/application\/json/);
  expect(res.body).toHaveLength(3);
});

test("Creating one blog increments the total number of blogs by 1", async () => {
  const loginResponse = await api.post("/api/login").send(userLogin);

  const { id, token } = loginResponse.body;
  const blog = { ...oneBlog, user: id };

  const blogResponse = await api
    .post("/api/blogs")
    .send(blog)
    .set("Authorization", `Bearer ${token}`);

  const allBlogs = await api.get("/api/blogs");

  expect(loginResponse.status).toBe(200);
  expect(loginResponse.type).toMatch(/application\/json/);
  expect(blogResponse.status).toBe(201);
  expect(allBlogs.body).toHaveLength(blogs.length + 1);
});

test("Blog id property is defined", async () => {
  let res = await api.get("/api/blogs");
  res.body.map(({ id }) => expect(id).toBeDefined());
});

test("Undefined 'likes' properties return 0", async () => {
  const loginResponse = await api.post("/api/login").send(userLogin);

  const { id, token } = loginResponse.body;

  const missingLike = {
    title: oneBlog.title,
    author: oneBlog.author,
    url: oneBlog.url,
    user: id,
  };

  const res = await api
    .post("/api/blogs")
    .send(missingLike)
    .set("Authorization", `Bearer ${token}`);
  expect(res.body.likes).toEqual(0);
});

test("Only the creator can delete a blog", async () => {
  const user1Login = await api.post("/api/login").send(userLogin);
  //create user to allow login

  const user2 = await api.post("/api/users").send({
    username: "tester2",
    name: "Mr. Tester2",
    password: "tester321",
  });

  const user2Login = await api.post("/api/login").send({
    username: "tester2",
    password: "tester321",
  });

  const user1Body = user1Login.body;
  const user2Body = user2Login.body;

  const savedBlog = await api
    .post("/api/blogs")
    .send({
      ...oneBlog,
      user: user2.body.id,
    })
    .set("Authorization", `Bearer ${user2Body.token}`);

  const disallowedUpdate = await api
    .put(`/api/blogs/${savedBlog.body.id}`)
    .send({ likes: 28 })
    .set("Authorization", `Bearer ${user1Body.token}`);

  const allowedUpate = await api
    .put(`/api/blogs/${savedBlog.body.id}`)
    .send({ likes: 21 })
    .set("Authorization", `Bearer ${user2Body.token}`);

  expect(disallowedUpdate.status).toBe(401);
  expect(allowedUpate.status).toBe(200);
});

test("Only the creator of a blog can delete it", async () => {
  const user1Login = await api.post("/api/login").send(userLogin);
  //create user to allow login
  const user2 = await api.post("/api/users").send({
    username: "tester2",
    name: "Mr. Tester2",
    password: "tester321",
  });

  const user2Login = await api.post("/api/login").send({
    username: "tester2",
    password: "tester321",
  });

  const user1Token = user1Login.body.token;
  const user2Token = user2Login.body.token;

  const savedBlog = await api
    .post("/api/blogs")
    .send({
      ...oneBlog,
      user: user2.body.id,
    })
    .set("Authorization", `Bearer ${user1Token}`);

  const disallowedDelete = await api
    .del(`/api/blogs/${savedBlog.body.id}`)
    .set("Authorization", `Bearer ${user1Token}`);

  const allowedDelete = await api
    .del(`/api/blogs/${savedBlog.body.id}`)
    .set("Authorization", `Bearer ${user2Token}`);
  expect(disallowedDelete.status).toBe(401);
  expect(allowedDelete.status).toBe(204);
});
