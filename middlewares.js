const jwt = require("jsonwebtoken");

const Forms = require("./models/forms");
const config = require("./config");

const authentication_middleware = (req, res, next) => {
  var errors = {};
  if (!req.headers.authorization) {
    errors.authorization = "Authorization header must be provided";
  } else {
    const token = req.headers.authorization.split("Bearer ")[1];
    if (!token) {
      errors.authorization = "Authorization token must be 'Bearer [token]";
    } else {
      const verifiedJwt = jwt.verify(
        token,
        config.tokenKey,
        (err, verifiedJwt) => {
          if (verifiedJwt) {
            return verifiedJwt;
          }
          errors.authorization = "Invalid/Expired Authorization token";
        }
      );
      if (verifiedJwt) {
        req.user = verifiedJwt;
        return next();
      }
    }
  }
  return res.status(401).json({
    success: false,
    errors,
  });
};

const check_form_enabled = async (req, res, next) => {
  if (!req.params.formID)
    return res.status(400).json({ success: false, error: "ID not provided" });
  try {
    result = await Forms.findById(req.params.formID).populate("created_by");
  } catch {
    return res.status(404).json({ success: false, error: "Form not found" });
  }
  if (!result.enabled) {
    return res.status(401).json({ success: false, error: "Form disabled" });
  }
  req.form = result;
  return next();
};

const check_form_created_by_user = async (req, res, next) => {
  if (!req.params.formID)
    return res.status(400).json({ success: false, error: "ID not provided" });
  try {
    result = await Forms.findById(req.params.formID).populate("created_by");
  } catch {
    return res.status(404).json({ success: false, error: "Form not found" });
  }
  if (result.created_by.username !== req.user.username) {
    return res
      .status(401)
      .json({ success: false, error: "Form is not created by you" });
  }
  req.form = result;
  return next();
};

module.exports = {
  authentication_middleware,
  check_form_enabled,
  check_form_created_by_user,
};
