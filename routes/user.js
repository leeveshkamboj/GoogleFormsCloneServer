const express = require("express");

const { loginResolver, registerResolver } = require("../resolvers/user");

const router = express.Router();

router.post("/login", loginResolver);
router.post("/register", registerResolver);

module.exports = router;
