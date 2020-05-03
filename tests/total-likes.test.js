const { totalLikes } = require("../utils/list_helper");
const { blogs } = require("../utils/vars");

describe("Total likes", () => {
  //test empty bloglist
  test("of empty list is zero", () => {
    expect(totalLikes([])).toBe(0);
  });

  //one blog
  test("of list containing one blog is equals the likes of that blog", () => {
    expect(totalLikes([blogs[0]])).toBe(1000);
  });

  //test multiple blogs
  test("of larger list is correct", () => {
    expect(totalLikes(blogs)).toBe(6000);
  });
});
