"use strict";
module.exports = (Sequelize, DataTypes) => {
  const PremiumKeys = Sequelize.define(
    "PremiumKeys",
    {
      keyCode: {
        allowNull: false,
        type: DataTypes.TEXT,
        validate: {
          notEmpty: { msg: "Key entry must contain a key value" }
        }
      }
    },
    {}
  );
  PremiumKeys.associate = function(models) {
    // associations can be defined here
  };
  return PremiumKeys;
};
