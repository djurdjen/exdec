const Sequelize = require("sequelize");

const connection = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    ...(process.env.DB_SOCKET && {
      dialectOptions: {
        socketPath: process.env.DB_SOCKET
      }
    }),
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    operatorsAliases: false,
    logging: false
  }
);

module.exports = connection;
