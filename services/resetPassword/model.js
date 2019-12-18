const Sequelize = require("sequelize");
const connection = require("../connect");
const User = require("../user/model");

const ResetPassword = connection.define(
  "reset_password",
  {
    resetPasswordToken: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "The content cannot be empty" }
      }
    }
  },
  { tableName: "reset_password" }
);

ResetPassword.belongsTo(User.model);

module.exports = {
  model: ResetPassword,
  connection: connection
};
