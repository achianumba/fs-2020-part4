const { connect, Schema, model, connection, set } = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const { info, error } = require("../utils/logger");

let userSchema = new Schema({
  username: { type: String, unique: true, required: true, minlength: 3 },
  name: { type: String, required: true },
  passwordHash: { type: String, required: true },
  blogs: [
    {
      type: Schema.Types.ObjectId,
      ref: "Blog",
    },
  ],
});

userSchema.plugin(uniqueValidator);

set("useFindAndModify", false);
set("useCreateIndex", true);

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  },
});

const User = model("User", userSchema);

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

const newUser = (user) => {
  callDb();
  return new User(user);
};

const getAllUsers = () => {
  callDb();
  return User.find().populate("blogs", { id: 1, title: 1, url: 1, author: 1 });
};

const getUserById = (id) => {
  callDb();
  return User.findById(id);
};

const getUserByUsername = username => {
  callDb();
  return User.findOne({ username: username })
}

const updateUserById = (id, upate) => {
  callDb();
  return User.findByIdAndUpdate(id, upate, { new: true });
};
//===============FOR TEST==================================
const saveMany = async (arr) => {
  await callDb();
  return User.insertMany(arr);
};

const deleteAllUsers = () => {
  callDb();
  return User.deleteMany({});
};
//============EXPORTS================================
module.exports = {
  callDb,
  newUser,
  saveMany,
  deleteAllUsers,
  getAllUsers,
  getUserById,
  updateUserById,
  getUserByUsername,
  closeDb,
};