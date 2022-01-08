const express = require("express");

const { formPostResolver, formGetResolver } = require("../resolvers/");
const { authentication_middleware } = require("../middlewares");

const router = express.Router();

router.post("/form", authentication_middleware, formPostResolver);
router.get("/form", formGetResolver);

module.exports = router;
