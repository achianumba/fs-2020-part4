const blogRouter = require("express").Router();
const { getAllBlogs, newBlog } = require("../models/blog");

blogRouter.get("/", (request, response) => {
  getAllBlogs()
  .then(blogs => response.json(blogs))
});

blogRouter.post("/", (request, response) => {
  newBlog(request.body)
    .save()
    .then(result => response.status(201).json(result));
});

module.exports = blogRouter;