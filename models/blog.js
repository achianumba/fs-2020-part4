const { connect, Schema, model, connection } = require("mongoose");
const { info, error } = require("../utils/logger");

const blogSchema = new Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
});

const Blog = model("Blog", blogSchema);

const callDb = () => {
  return connect(require("../utils/config").MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => info("Connected to database successfully"))
    .catch((err) => error(`UNABLE TO CONNECT TO DATABASE\n`, err.message));
};

const closeDb = () => {
  return connection
    .close()
    .then(() => info("Database closed successfully"))
    .catch((err) => error("ERROR CLOSING DATABASE: ", err.message));
};

const getAllBlogs = () => {
  callDb();
  return Blog.find();
};
const newBlog = (blog) => {
  callDb();
  return new Blog(blog);
};

module.exports = {
  getAllBlogs,
  newBlog,
  closeDb,
};
