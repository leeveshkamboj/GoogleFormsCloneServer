const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  first_name : String,
  last_name : String,
  username: String,
  email: String,
  password: String,
  created_at : String
});

const users = mongoose.model("users", userSchema);

module.exports = users;
