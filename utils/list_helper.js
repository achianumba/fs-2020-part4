const dummy = (blogs) => 1;

const totalLikes = (blogs) => {
  if (blogs.length === 0) return 0;
  if (blogs.length === 1) return blogs[0].likes;

  return blogs.map(({ likes }) => likes).reduce((sum, item) => sum + item);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return 0;
  if (blogs.length === 1) return blogs[0];

  let likesArray = blogs.map(({ likes }) => likes);
  return blogs.find(({ likes }) => likes === Math.max(...likesArray));
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};
