const express = require("express");

const {
  formPostResolver,
  formGetResolver,
  formsGetResolver,
} = require("../resolvers/form");
const {
  responsePostResolver,
  responseGetResolver,
} = require("../resolvers/response");
const { authentication_middleware } = require("../middlewares");

const router = express.Router();

router.post("/", authentication_middleware, formPostResolver);
router.get("/", authentication_middleware, formsGetResolver);
router.get("/:formID", formGetResolver);
router.get("/:formID/response", authentication_middleware, responseGetResolver);
router.post("/:formID/response", responsePostResolver);

module.exports = router;
