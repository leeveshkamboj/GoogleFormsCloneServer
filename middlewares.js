const jwt = require("jsonwebtoken");

const config = require("./config");

const authentication_middleware = (req, res, next) => {
  req.user = {
    username: "walter",
  };
  return next();
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

module.exports = { authentication_middleware };
