"use strict";
module.exports = (sequelize, DataTypes) => {
  const Entries = sequelize.define(
    "Entries",
    {
      kilometres: {
        type: DataTypes.STRING,
        validate: {
          checkRules: function(val) {
            if (val && !isNaN(val)) {
              return Promise.resolve();
            } else {
              return Promise.reject(
                "Je moet een geldige kilometerstand invoeren"
              );
            }
          }
        }
      },
      ticketPrice: {
        type: DataTypes.STRING,
        validate: {
          checkRules: function(val) {
            if (val && !isNaN(val)) {
              return Promise.resolve();
            } else {
              return Promise.reject("Je moet een geldige prijs invoeren");
            }
          }
        }
      },
      transport: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: { msg: "The content cannot be empty" },
          len: {
            args: [1, 300],
            msg: "The content field must be between 1 and 300 characters"
          }
        }
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: { msg: "De beschrijving mag niet leeg zijn" }
        }
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notEmpty: { msg: "The content cannot be empty" }
        }
      },
      userId: DataTypes.INTEGER
    },
    {}
  );
  Entries.associate = function(models) {
    // associations can be defined here
  };
  return Entries;
};
