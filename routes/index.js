// Services
const express = require("express");
const router = express.Router();
const { mail, requestPassword } = require("../services/mail");

// Authorisation and Security services
const passport = require("passport");
const secret = require("../services/secrets");
const auth = require("../services/auth");
const jwt = require("jsonwebtoken");

// Controllers
const entryController = require("../services/entry/actions");
const userController = require("../services/user/actions");
const forgotPasswordController = require("../services/resetPassword/actions");

// Middleware
const ensureAuthorized = require("../services/ensureAuthorized");

router.post("/register", (req, res) => {
  userController
    .register(req.body.username, req.body.password)
    .then(resp => {
      res.json({ message: resp });
    })
    .catch(err => {
      res.status(400);
      res.send({ hasError: true, error: err });
    });
});

router.post("/login", (req, res, next) => {
  // register login strategy
  auth.login().then(() => {
    // apply login strategy on incomming request
    passport.authenticate("local-login", (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        res.status(401);
        res.end(info.message);
        return;
      }
      const payload = {
        username: req.body.username,
        id: user[0].dataValues.id
      }; // define payload for token (the username object in this case)
      const token = jwt.sign(payload, secret.jwt); // create token
      res.json({ message: "succes", token: token, name: req.body.username });
    })(req, res, next);
  });
});

router.get("/settings", ensureAuthorized, (req, res, next) => {
  userController.getUserSettings(req.decoded.username).then(settings => {
    res.json({ settings });
  });
});

router.put("/settings", ensureAuthorized, (req, res, next) => {
  userController
    .editUserSettings(req.decoded.username, req.body)
    .then(resp => {
      res.json({ settings: resp.settings });
    })
    .catch(err => {
      res.status(400);
      res.send({ hasError: true, error: err });
      return;
    });
});

router.get("/verify", ensureAuthorized, (req, res, next) => {
  res.json({ message: "token valid", ...req.decoded });
});

// ensureAuthorized middleware hijacks response status if token is invalid
router.get("/entries", ensureAuthorized, (req, res, next) => {
  entryController
    .getEntries(req)
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.status(400);
      res.send({ hasError: true, error: err });
    });
});

router.post("/entries", ensureAuthorized, (req, res, next) => {
  entryController
    .postEntry(req)
    .then(data => {
      res.json({ message: "success!", data: data });
    })
    .catch(err => {
      res.status(400);
      res.send({ error: err.map(msg => msg.message) });
    });
});

router.put("/entries/:id", ensureAuthorized, (req, res) => {
  entryController
    .editEntry(req)
    .then(data => {
      res.json({ message: "success!", data: data });
    })
    .catch(err => {
      res.status(400);
      res.send({ error: err.map(msg => msg.message) });
    });
});

router.delete("/entries/:id", ensureAuthorized, (req, res, next) => {
  entryController
    .deleteEntry(req.params.id)
    .then(data => {
      res.json({ message: "success!", data: data });
    })
    .catch(err => {
      res.status(400);
      res.send({ error: err.map(msg => msg.message) });
    });
});

router.post("/mail", ensureAuthorized, async (req, res) => {
  try {
    const settings = await userController.getUserSettings(req.decoded.username);
    await mail({
      ...req.body,
      ...{ email: JSON.parse(settings).altEmail || req.body.email }
    });
    res.json("succes");
  } catch (err) {
    res.status(400);
    res.json(err.message);
  }
});
router.post("/request-password", async (req, res) => {
  try {
    const user = await userController.verifyUserExisting(req.body.email);
    const token = await forgotPasswordController.postResetPasswordToken(user);
    await requestPassword({
      email: req.body.email,
      url:
        req.protocol +
        "://" +
        req.get("host") +
        `/reset-password?token=${token.resetPasswordToken}`
    }).catch(err => {
      forgotPasswordController.deleteToken(user.id);
      return Promise.reject(err);
    });
    res.json({ succes: true });
  } catch (err) {
    res.status(err.status || 400);
    res.json(err.message || err);
  }
});

router.get("/validate-reset-token/:token", async (req, res) => {
  try {
    await forgotPasswordController.validateToken(req.params.token);
    res.json("success");
  } catch (err) {
    res.status(401);
    res.json(err);
  }
});
router.post("/reset-password", async (req, res) => {
  try {
    const data = await forgotPasswordController.validateToken(req.body.token);
    await userController.changePassword({
      ...data,
      password: req.body.password
    });
    await forgotPasswordController.deleteToken(data.id);
    res.json("success");
  } catch (err) {
    res.status(401);
    res.json(err);
  }
});
module.exports = router;
