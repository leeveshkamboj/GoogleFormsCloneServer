require("dotenv").config();

const config = {
  port: process.env.PORT || 4000,
  dbUrl: process.env.DB_URL || null,
  tokenKey: process.env.TOKEN_KEY || "test",
};

module.exports = config;
