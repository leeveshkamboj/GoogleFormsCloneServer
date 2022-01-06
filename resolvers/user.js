const bcrypt = require("bcrypt");

const users = require("../models/users");
const { generateToken, validateEmail } = require("../utils");

const loginResolver = async (req, res) => {
  var errors = {};
  if (!req.body.username) {
    errors.username = "Username not provided.";
  } else if (req.body.password) {
    user = await users.findOne({
      username: req.body.username,
    });
    if (!user) {
      errors.username = "Username not found.";
    } else {
      const match = await bcrypt.compare(req.body.password, user.password);
      if (!match) {
        errors.password = "Password doesn't match.";
      }
    }
  }
  if (!req.body.password) {
    errors.password = "Password not provided.";
  }

  if (Object.keys(errors).length) {
    return res.status(400).json({
      success: false,
      errors,
    });
  }
  const token = generateToken(user);
  return res.status(200).json({
    success: true,
    email: user.email,
    token,
  });
};

const registerResolver = async (req, res) => {
  var errors = {};
  if (!req.body.first_name) {
    errors.first_name = "First name not provided.";
  }
  if (!req.body.last_name) {
    errors.last_name = "Last name not provided.";
  }
  if (!req.body.username) {
    errors.username = "Username not provided.";
  } else if (
    await users.findOne({
      username: req.body.username,
    })
  ) {
    errors.username = "Username already exists.";
  }
  if (!req.body.email) {
    errors.email = "Email not provided.";
  } else if (!validateEmail(req.body.email)) {
    errors.email = "Invalid Email.";
  } else if (
    await users.findOne({
      email: req.body.email,
    })
  ) {
    errors.email = "Email already registered.";
  }
  if (!req.body.password) {
    errors.password = "Password not provided.";
  } else if (req.body.password != req.body.confirm_password) {
    errors.confirm_password = "Confirm password doesn't match.";
  }
  if (Object.keys(errors).length) {
    return res.status(400).json({
      success: false,
      errors,
    });
  }
  password = await bcrypt.hash(req.body.password, 12);
  new_user = new users({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    username: req.body.username,
    email: req.body.email,
    password,
    created_at: new Date().toISOString(),
  });
  const token = generateToken(new_user);
  new_user
    .save()
    .then(() => {
      return res.status(200).json({
        success: true,
        email: req.body.email,
        token,
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({
        success: false,
        errors: { server: "Internal server error." },
      });
    });
};

module.exports = { loginResolver, registerResolver };
