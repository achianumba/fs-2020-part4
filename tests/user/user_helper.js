const invalidUsername = {
  username: "jo",
  name: "John Doe",
  password: "123456",
};

const invalidName = {
  username: "john.doe",
  name: "",
  password: "123456",
};

const invalidPassword = {
  username: "john.doe",
  name: "John Doe",
  password: "12",
};

const users = [
  {
    username: "janedoe",
    name: "Jane Doe",
    password: "123456",
  },
  {
    username: "james.doe",
    name: "James Doe",
    password: "123456",
  },
];

module.exports = {
  invalidUsername,
  invalidName,
  invalidPassword,
  users,
};
