const express = require("express");

const { homeResolver, formPostResolver, formGetResolver } = require("../resolvers/");
const { authentication_middleware } = require("../middlewares");

const router = express.Router();

router.get("/", homeResolver);
router.post("/form", formPostResolver);
router.get("/form", formGetResolver);

module.exports = router;
