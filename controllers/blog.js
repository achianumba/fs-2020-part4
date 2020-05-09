const blogRouter = require("express").Router();
const { verify } = require("jsonwebtoken");
const {
  closeDb,
  getAllBlogs,
  newBlog,
  updateBlog,
  deleteBlog,
} = require("../models/blog");
const { updateUserById } = require("../models/user");

blogRouter.get("/", (request, response) => {
  getAllBlogs()
    .then((blogs) => response.json(blogs))
    .finally(closeDb);
});

blogRouter.post("/", async (request, response) => {
  const blog = request.body;
  if (!blog.title || !blog.url) {
    response.status(400).json({
      error:
        "Please ensure that the title and url of the blog post are defined",
    });
  } else {
    //request.token is defined by the middleware defined in ../utils/middleware
    //verify token using jsonwebtoken.verify()
    const decodedToken = verify(request.token, process.env.SECRET);

    //prevent users without a token (not logged in) from creating blogs
    if (!request.token || !decodedToken) {
      return response.status(401).json({ error: "Only logged in users can create blogs" });
    }

    const savedBlog = await newBlog(blog).save();

    //add blog id to corresponding user's blog array in users db
    //notice the user's id is taken from the decoded token
    await updateUserById(decodedToken.id, {
      $push: { blogs: savedBlog._id },
    });

    closeDb();
    response.status(201).json(savedBlog);
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