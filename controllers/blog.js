const blogRouter = require("express").Router();
const { verify } = require("jsonwebtoken");
const {
  closeDb,
  getAllBlogs,
  newBlog,
  updateBlog,
  getBlogById,
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
    const token = request.token;
    //reject non-logged in users' create requests
    if (!token) {
      return response
        .status(401)
        .json({ error: "Only logged in users can create blogs" });
    }

    //verify user login status with jsonwebtoken.verify()
    verify(token, process.env.SECRET, async (err, decodedToken) => {
      if (err) {
        return response.status(401).json({ error: "Unauthorized user" });
      }

      //give logged in users access
      const savedBlog = await newBlog(blog).save();

      //add blog id to corresponding user's blog array in users db
      //notice the user's id is taken from the decoded token
      await updateUserById(decodedToken.id, {
        $push: { blogs: savedBlog._id },
      });

      closeDb();
      response.status(201).json(savedBlog);
    });
  }
});

blogRouter.put("/:id", async (request, response) => {
  const blogId = request.params.id;
  //allow only blog creator to update it
  //verify token using jsonwebtoken.verify()
  const token = request.token;
  //reject non-logged in users' delete requests
  if (!token) {
    return response
      .status(401)
      .json({ error: "Only logged in users can update blogs" });
  }

  //verify user login status with jsonwebtoken.verify()
  verify(token, process.env.SECRET, async (err, decodedToken) => {
    if (err) {
      return response
        .status(401)
        .json({ error: "Only the creator can update a blog blog" });
    }

    //check if the current user created the blog
    const blog = await getBlogById(blogId);

    if (blog === null)
      return response.status(404).json({ error: "Blog not found" });
    //if false
    if (!(blog.user.toString() === decodedToken.id)) {
      return response
        .status(401)
        .json({ error: "You are not allowed to update this blog" });
    }
    //else upade
    let updatedBlog = await updateBlog(blogId, request.body);
    response.json(updatedBlog);
  });
});
/* 
=============================
DELETE USER
=============================
 */
blogRouter.delete("/:id", async (request, response) => {
  const blogId = request.params.id;
  const token = request.token;

  if (!token) {
    return response
      .status(401)
      .json({ error: "Only logged in users can delete a blog" });
  }

  verify(token, process.env.SECRET, async (err, decodedToken) => {
    const unauthorized = { error: "You are not allowed to delete this blog" };

    if (err) return response.status(401).json(unauthorized);

    const blog = await getBlogById(blogId);

    if (!blog) return response.status(404).json({ error: "Blog not found" });

    const isCreator = blog.user.toString() === decodedToken.id;
    //if not creator
    if (!isCreator) return response.status(401).json(unauthorized);
    // if true, delete blog
    await deleteBlog(blogId);
    return response.status(204).end();
  });
});

module.exports = blogRouter;
