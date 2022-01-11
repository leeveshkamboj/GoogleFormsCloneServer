const express = require("express");

const {
  formPostResolver,
  formGetResolver,
  formsGetResolver,
  formEnableResolver,
} = require("../resolvers/form");
const {
  responsePostResolver,
  responseGetResolver,
} = require("../resolvers/response");
const {
  authentication_middleware,
  check_form_enabled,
  check_form_created_by_user,
} = require("../middlewares");

const router = express.Router();

router.post("/", authentication_middleware, formPostResolver);
router.get("/", authentication_middleware, formsGetResolver);
router.get("/:formID", check_form_enabled, formGetResolver);
router.get("/:formID/response", authentication_middleware, check_form_created_by_user, responseGetResolver);
router.post("/:formID/response", check_form_enabled, responsePostResolver);
router.post("/:formID/enable", authentication_middleware, check_form_created_by_user, formEnableResolver);

module.exports = router;
