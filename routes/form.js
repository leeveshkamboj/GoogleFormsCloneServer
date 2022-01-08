const express = require("express");

const {
  formPostResolver,
  formGetResolver,
  responsePostResolver,
} = require("../resolvers/form");
const { authentication_middleware } = require("../middlewares");

const router = express.Router();

router.post("/", authentication_middleware, formPostResolver);
router.get("/:formID", formGetResolver);
router.post("/:formID/response", responsePostResolver);

module.exports = router;
