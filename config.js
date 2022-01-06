require("dotenv").config();

const config = {
  port: process.env.PORT || 4000,
  dbUrl: process.env.DB_URL || null,
  tokenKey: process.env.TOKEN_KEY || "test",
  quetionTypes: [0, 1, 2],
  quetionTypesWithOptions: [2],
};

module.exports = config;
