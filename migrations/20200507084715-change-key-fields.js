"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn("Users", "premiumKey", {
          type: Sequelize.INTEGER,
          references: {
            model: "PremiumKeys",
            key: "id"
          }
        }),
        queryInterface.removeColumn("PremiumKeys", "keyOwner")
      ]);
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn("PremiumKeys", "keyOwner", {
          type: Sequelize.INTEGER,
          references: {
            model: "Users",
            key: "id"
          }
        }),
        queryInterface.removeColumn("Users", "premiumKey")
      ]);
    });
  }
};
