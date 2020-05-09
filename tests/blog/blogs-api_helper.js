const blogs = [
  {
    title: "Test blog Title_1",
    author: "Test blog author_1",
    url: "https://www.site.com/blog/testblog_1",
    likes: 1000,
  },
  {
    title: "Test blog Title_2",
    author: "Test blog author_2",
    url: "https://www.site.com/blog/testblog_2",
    likes: 2000,
  },
  {
    title: "Test blog Title_3",
    author: "Test blog author_3",
    url: "https://www.site.com/blog/testblog_3",
    likes: 3000,
  },
];

const oneBlog = {
  title: "Test blog Title_4",
  author: "Test blog author_4",
  url: "https://www.site.com/blog/testblog_4",
  likes: 4000,
};

const user = {
  username: "tester",
  name: "Mr. Tester",
  password: "tester123",
};

const userLogin = {
  username: "tester",
  password: "tester123",
};

const invalidUserLogin = {
  username: "John Doe",
  password: "unknown",
};

module.exports = {
  blogs,
  oneBlog,
  user,
  userLogin,
  invalidUserLogin,
};
