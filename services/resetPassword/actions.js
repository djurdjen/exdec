const model = require("./model");
const jwt = require("jsonwebtoken");
const secret = require("../secrets");

const ResetPassword = model.model;
const connection = model.connection;
const actions = {
  async createResetPasswordTable({ force, alter }) {
    try {
      await connection.sync({ force, alter });
    } catch (err) {
      return Promise.reject(err);
    }
  },
  async postResetPasswordToken(user) {
    try {
      const oldToken = await ResetPassword.findOne({
        where: {
          userId: user.id
        }
      });
      if (oldToken) {
        await oldToken.destroy(); // if an e-mail reset request already exists, remove it
      }
      const resp = await ResetPassword.create({
        resetPasswordToken: jwt.sign(
          { user: user.username, id: user.id },
          secret.jwt,
          {
            expiresIn: "1d"
          }
        ),
        userId: user.id
      });
      return Promise.resolve(resp.dataValues);
    } catch (err) {
      console.log(err);
      return Promise.reject(err.errors);
    }
  },
  async validateToken(token) {
    try {
      const data = await jwt.verify(token, secret.jwt);
      if (data.exp < data.iat) {
        return Promise.reject({
          success: false,
          message: "Token has expired."
        });
      }
      return Promise.resolve(data);
    } catch (err) {
      return Promise.reject({
        success: false,
        message: err.message
      });
    }
  },
  async deleteToken(userId) {
    const entry = await ResetPassword.findOne({
      where: {
        userId
      }
    });
    if (entry) {
      entry.destroy();
    }
  }
};

module.exports = actions;
