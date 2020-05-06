const app = require("../app");
const { deleteAll, closeDb } = require("../models/blog");
const supertest = require("supertest");
const { blogs, oneBlog } = require("../utils/vars");

//create a super agent by wrapping express app in superset
const api = supertest(app);

//runs before each test
beforeEach(async () => {
  //clear database to ensure quality assurance
  await deleteAll();
  await closeDb();
  await api.post("/api/blogs").send(blogs[0]);
  await api.post("/api/blogs").send(blogs[1]);
  await api.post("/api/blogs").send(blogs[2]);
});

test("The correct number of blogs are returned in json format", async () => {
  const res = await api.get("/api/blogs");
  expect(res.type).toMatch(/application\/json/);
  expect(res.body).toHaveLength(3);
});

test("Each blog's id property is defined", async () => {
  let res = await api.get("/api/blogs");
  res.body.forEach(({ id }) => expect(id).toBeDefined());
});

test("Missing 'likes' property return 0", async () => {
  const missingLike = {
    title: oneBlog.title,
    author: oneBlog.author,
    url: oneBlog.url,
  };

  const res = await api.post("/api/blogs").send(missingLike);
  expect(res.body.likes).toBe(0);
});

describe("Authors can", () => {
  test("Create a new blog which increments the blog count", async () => {
    let res = await api.post("/api/blogs").send(oneBlog);
    expect(res.body.title).toBe(oneBlog.title);
    let allBlogs = await api.get("/api/blogs");
    expect(allBlogs.body).toHaveLength(blogs.length + 1);
  });

  test("Update a blog", async () => {
    const getBlogs = await api.get("/api/blogs"); //for efficiency, refactor this request only one blog post later.
    const update = await api
      .put(`/api/blogs/${getBlogs.body[0].id}`)
      .send({ likes: 21 });
    expect(update.status).toBe(200);
  });

  test("delete a blog", async () => {
    const getBlogs = await api.get("/api/blogs"); //for efficiency, refactor this request only one blog post later.
    await api.del(`/api/blogs/${getBlogs.body[0].id}`).expect(204);
  });
});

//jest's function run after all async operations end. mongoose.connection.close() executed here.
afterAll(() => {
  closeDb();
});
