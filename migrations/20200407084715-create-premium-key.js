"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.createTable("PremiumKeys", {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
          },
          keyCode: {
            allowNull: false,
            type: Sequelize.TEXT
          },
          keyOwner: {
            type: Sequelize.INTEGER,
            references: {
              model: "Users",
              key: "id"
            }
          },
          createdAt: {
            allowNull: false,
            type: Sequelize.DATE
          },
          updatedAt: {
            allowNull: false,
            type: Sequelize.DATE
          }
        })
      ]);
    });
  },
  down: queryInterface => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([queryInterface.dropTable("PremiumKeys")]);
    });
  }
};
