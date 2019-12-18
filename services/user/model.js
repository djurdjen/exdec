const Sequelize = require("sequelize");
const connection = require("../connect");

const User = connection.define("user", {
  username: {
    type: Sequelize.TEXT,
    validate: {
      notEmpty: true,
      isEmail: {
        msg: "Username must be an email adress"
      }
    }
  },
  password: Sequelize.TEXT,
  settings: {
    type: Sequelize.TEXT,
    validate: {
      checkRules(val) {
        const settings = JSON.parse(val);
        if (!settings.compensation) {
          return Promise.reject("Het kilometervergoeding-veld is verplicht!");
        }
        return true;
      }
    }
  }
});

module.exports = {
  model: User,
  connection: connection
};
