const info = (...args) => {
  if (process.env.NODE_ENV !== "test") {
    console.log(...args, "\n");
  }
};

const error = (...args) => {
  if (process.env.NODE_ENV !== "test") {
    console.error(...args, "\n");
  }
};

module.exports = { info, error };