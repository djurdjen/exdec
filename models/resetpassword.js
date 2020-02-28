"use strict";
module.exports = (sequelize, DataTypes) => {
  const ResetPasswords = sequelize.define(
    "ResetPasswords",
    {
      resetPasswordToken: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "The content cannot be empty" }
        }
      },
      userId: DataTypes.INTEGER
    },
    {}
  );
  ResetPasswords.associate = function(models) {
    // associations can be defined here
  };
  return ResetPasswords;
};
