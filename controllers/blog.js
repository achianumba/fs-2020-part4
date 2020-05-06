const blogRouter = require("express").Router();
const {
  closeDb,
  getAllBlogs,
  newBlog,
  updateBlog,
  deleteBlog,
} = require("../models/blog");

blogRouter.get("/", (request, response) => {
  getAllBlogs()
    .then((blogs) => response.json(blogs))
    .finally(() => closeDb());
});

blogRouter.post("/", (request, response) => {
  const body = request.body;
  if (!body.title || !body.url) {
    response.status(400).json({
      error:
        "Please ensure that the title and url of the blog post are defined",
    });
  } else {
    newBlog(request.body)
      .save()
      .then((result) => response.status(201).json(result))
      .finally(() => closeDb());
  }
});

blogRouter.put("/:id", async (request, response) => {
  let updatedBlog = await updateBlog(request.params.id, request.body);
  response.json(updatedBlog);
});

blogRouter.delete("/:id", async (request, response) => {
  await deleteBlog(request.params.id);
  response.status(204).end();
});

module.exports = blogRouter;