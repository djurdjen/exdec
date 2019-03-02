const bcrypt = require("bcrypt");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const userActions = require("./user/actions");

const strategies = {
  async login() {
    await passport.use(
      "local-login",
      new LocalStrategy((user, password, done) => {
        // callback with user and password from our form
        userActions.login(user).then(resp => {
          if (resp.length) {
            const rawJson = JSON.stringify(resp);
            bcrypt.compare(password, JSON.parse(rawJson)[0].password, function(
              err,
              authenticated
            ) {
              if (authenticated) {
                return done(null, resp);
              } else {
                return done(null, false, {
                  message: "Deze combinatie wordt niet door ons herkent."
                });
              }
            });
          } else {
            return done(null, false, {
              message: "Deze combinatie wordt niet door ons herkent"
            });
          }
        });
      })
    );
  }
};

module.exports = strategies;
