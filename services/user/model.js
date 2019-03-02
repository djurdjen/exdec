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
      validateSettings(val) {
        return val;
      }
    }
  },
  { underscored: true }
);

module.exports = {
  model: User,
  connection: connection
};
