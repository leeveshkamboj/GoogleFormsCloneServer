const jwt = require("jsonwebtoken");

const config = require("./config");

const generateToken = (user) => {
  return jwt.sign(
    {
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username,
      email: user.email,
    },
    config.tokenKey,
    {
      expiresIn: "2d",
    }
  );
};

const validateEmail = (email) => {
  return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    email
  );
};

module.exports = { generateToken, validateEmail };
