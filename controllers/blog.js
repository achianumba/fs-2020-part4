const blogRouter = require("express").Router();
const { closeDb, getAllBlogs, newBlog } = require("../models/blog");

blogRouter.get("/", (request, response) => {
  getAllBlogs()
    .then((blogs) => response.json(blogs))
    .finally(() => closeDb());
});

blogRouter.post("/", (request, response) => {
  newBlog(request.body)
    .save()
    .then((result) => response.status(201).json(result))
    .finally(() => closeDb());
});

module.exports = blogRouter;