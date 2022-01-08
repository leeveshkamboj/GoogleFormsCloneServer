const express = require("express");

const { formPostResolver, formGetResolver } = require("../resolvers/form");
const { authentication_middleware } = require("../middlewares");

const router = express.Router();

router.post("/", authentication_middleware, formPostResolver);
router.get("/", formGetResolver);

module.exports = router;
