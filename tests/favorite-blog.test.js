const { favoriteBlog } = require("../utils/list_helper");
const { blogs } = require("../utils/vars");

describe("Favorite blog", () => {
  test("returns zero for an empty blog list", () => {
    expect(favoriteBlog([])).toEqual(0);
  });

  test("returns the only blog in a blog list contatining only one blog", () => {
    expect(favoriteBlog([blogs[0]])).toEqual(blogs[0]);
  });

  test("returns the favourite blog from a list", () => {
    expect(favoriteBlog(blogs)).toEqual(blogs[2]);
  });
});