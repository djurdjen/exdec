const Sequelize = require("sequelize");
const connection = require("../connect");
const User = require("../user/model");

const Entry = connection.define(
  "entry",
  {
    kilometres: {
      type: Sequelize.STRING,
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
      type: Sequelize.STRING,
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
      type: Sequelize.TEXT,
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
      type: Sequelize.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: "De beschrijving mag niet leeg zijn" }
      }
    },
    date: {
      type: Sequelize.DATE,
      allowNull: false,
      validate: {
        notEmpty: { msg: "The content cannot be empty" }
      }
    }
  },
  { tableName: "entries" }
);
// TODO: we set the relation but we set the right id later on in the process
Entry.belongsTo(User.model);

module.exports = {
  model: Entry,
  connection: connection
};
