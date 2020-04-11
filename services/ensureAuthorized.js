const jwt = require("jsonwebtoken");
var userActions = require("../services/user/actions");

const auth = function(req, res, next) {
  const token = req.body.token || req.headers["x-auth-token"];
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, process.env.PREMIUM_KEY_SECRET, function(err, decoded) {
      if (err) {
        return res.status(401).send({
          success: false,
          message: "Token is not valid.",
          type: "badtoken"
        });
      } else {
        //Check if user exists
        userActions.login(decoded.username).then(resp => {
          if (!resp.length) {
            return res.status(401).send({
              success: false,
              message: "The user this token belongs to does not exist"
            });
          }
          decoded.token = token;
          // expand request with the decoded value. Decoded is now available in the following request object
          req.decoded = decoded;
          next();
        });
      }
    });
  } else {
    return res.status(403).send({
      success: false,
      message: "No token provided."
    });
  }
};

module.exports = auth;
