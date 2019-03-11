const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const passport = require("passport");
const secret = require("../services/secrets");
const auth = require("../services/auth");
const entry = require("../services/entry/actions");
const userActions = require("../services/user/actions");
const ensureAuthorized = require("../services/ensureAuthorized");
const jwt = require("jsonwebtoken");

router.post("/register", (req, res, next) => {
  bcrypt.hash(req.body.password, secret.saltRounds, function(err, hash) {
    userActions
      .register(req.body.username, hash)
      .then(resp => {
        res.json({ message: resp });
      })
      .catch(err => {
        res.json({ message: err });
      });
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
      const token = jwt.sign(payload, secret.jwt, { expiresIn: "30d" }); // create token
      res.json({ message: "succes", token: token, name: req.body.username });
    })(req, res, next);
  });
});

router.get("/settings", ensureAuthorized, (req, res, next) => {
  userActions.getUserSettings(req.decoded.username).then(settings => {
    res.json({ settings });
  });
});

router.put("/settings", ensureAuthorized, (req, res, next) => {
  userActions.editUserSettings(req.decoded.username, req.body).then(resp => {
    res.json({ settings: resp.settings });
  });
});

router.get("/verify", ensureAuthorized, (req, res, next) => {
  res.json({ message: "token valid", ...req.decoded });
});

// ensureAuthorized middleware hijacks response status if token is invalid
router.get("/entries", ensureAuthorized, (req, res, next) => {
  entry
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
  entry
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
  entry
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
  entry
    .deleteEntry(req.params.id)
    .then(data => {
      res.json({ message: "success!", data: data });
    })
    .catch(err => {
      res.status(400);
      res.send({ error: err.map(msg => msg.message) });
    });
});
module.exports = router;
