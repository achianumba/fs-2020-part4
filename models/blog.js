const { connect, Schema, model } = require("mongoose");
const { info, error } = require("../utils/logger");

connect(require("../utils/config").MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => info("Connected to database successfully"))
  .catch((err) => error(`UNABLE TO CONNECT TO DATABASE\n`));

const blogSchema = new Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
});

const Blog = model("Blog", blogSchema);

const getAllBlogs = () => Blog.find();
const newBlog = (blog) => new Blog(blog);

module.exports = {
  getAllBlogs,
  newBlog,
};