const { connect, Schema, model, connection, set } = require("mongoose");
const { info, error } = require("../utils/logger");

const blogSchema = new Schema({
  title: String,
  author: String,
  url: String,
  likes: { type: Number, default: 0 },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
});

//handle deprecation warnings
set(`useFindAndModify`, false);

blogSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
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
  return Blog.find().populate("user", { username: 1, name: 1, id: 1});
};

const newBlog = (blog) => {
  callDb();
  return new Blog(blog);
};

const updateBlog = (id, blog) => {
  callDb();
  return Blog.findByIdAndUpdate(id, blog, { new: true });
};

const deleteBlog = (id) => {
  callDb();
  return Blog.findByIdAndDelete(id);
};

const deleteAll = async () => {
  callDb();
  await Blog.deleteMany({});
  return closeDb();
};

module.exports = {
  getAllBlogs,
  newBlog,
  updateBlog,
  deleteBlog,
  deleteAll,
  closeDb,
};