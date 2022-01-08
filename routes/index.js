const express = require("express");

const { homeResolver } = require("../resolvers/");

const router = express.Router();

router.get("/", homeResolver);

module.exports = router;
