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
});

//actual tests
describe("when there are blogs in the database", () => {
  test("the correct number of blogs are returned in json format", async () => {
    const res = await api.get("/api/blogs");
    expect(res.type).toMatch(/application\/json/);
    expect(res.body).toHaveLength(3);
  });

  test("id property of blogs are defined", async () => {
    let res = await api.get("/api/blogs");
    res.body.forEach(({ id }) => expect(id).toBeDefined());
  });

  test("creating a new blog is successful and increases blog count", async () => {
    let res = await api.post("/api/blogs").send(oneBlog);
    expect(res.body.title).toBe(oneBlog.title);
    let allBlogs = await api.get("/api/blogs");
    expect(allBlogs.body).toHaveLength(blogs.length + 1);
  });

  test("missing 'likes' property return 0", async () => {
    let missingLike = {
      title: oneBlog.title,
      author: oneBlog.author,
      url: oneBlog.url,
    };

    let res = await api.post("/api/blogs").send(missingLike);
    expect(res.body.likes).toBe(0);
  });

  test("creating a blog without the title and url properties returns status code 400", async () => {
    let badRequest = {
      url: oneBlog.url,
    };

    let res = await api.post("/api/blogs").send(badRequest);
    expect(res.statusCode).toBe(400);
  });

  test("one can update a single blog", async () => {
    const getBlogs = await api.get("/api/blogs"); //for efficiency, refactor this request only one blog post later.
    await api
      .put(`/api/blogs/${getBlogs.body[0].id}`)
      .send({ likes: 21 })
      .expect(200);
  });

  test("one can delete a single blog", async () => {
    const getBlogs = await api.get("/api/blogs"); //for efficiency, refactor this request only one blog post later.
    await api.del(`/api/blogs/${getBlogs.body[0].id}`).expect(204);
  });
});

//jest's function run after all async operations end. mongoose.connection.close() executed here.
afterAll(() => {
  closeDb();
});
