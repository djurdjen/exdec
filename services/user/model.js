const Sequelize = require("sequelize");
const connection = require("../connect");

const User = connection.define(
  "user",
  {
    username: {
      type: Sequelize.TEXT,
      validate: {
        notEmpty: false,
        isEmail: {
          msg: "Username must be an email adress"
        }
      }
    },
    password: Sequelize.TEXT,
    settings: {
      type: Sequelize.TEXT,
      validate: {
        validateSettings(val) {
          const settings = JSON.parse(val);
          if (!("compensation" in settings)) {
            return Promise.reject("Een of meerdere velden mist");
          }
          return true;
        }
      }
    }
  },
  { underscored: true }
);

module.exports = {
  model: User,
  connection: connection
};
