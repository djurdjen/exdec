"use strict";
module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define(
    "Users",
    {
      username: {
        type: DataTypes.TEXT,
        validate: {
          notEmpty: true,
          isEmail: {
            msg: "Username must be an email adress"
          }
        }
      },
      password: DataTypes.TEXT,
      settings: {
        type: DataTypes.TEXT,
        validate: {
          checkRules(val) {
            const settings = JSON.parse(val);
            if (!settings.compensation) {
              return Promise.reject(
                "Het kilometervergoeding-veld is verplicht!"
              );
            }
            return true;
          }
        }
      }
    },
    {}
  );
  Users.associate = function(models) {
    // associations can be defined here
  };
  return Users;
};
