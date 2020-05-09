//Get jsonwebtoken from create blog request

const getToken = (req, res, next) => {
  const authorization = req.get("authorization");

  if (authorization && authorization.toLowerCase().startsWith("bearer")) {
    req.token = authorization.slice(7);
  } else {
    req.token = null;
  }
  
  next();
};

module.exports = {
  getToken
};