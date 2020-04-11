const { ResetPasswords } = require("../../models/index");

const jwt = require("jsonwebtoken");
const secret = require("../secrets");

const actions = {
  async postResetPasswordToken(user) {
    try {
      const oldToken = await ResetPasswords.findOne({
        where: {
          userId: user.id
        }
      });
      if (oldToken) {
        await oldToken.destroy(); // if an e-mail reset request already exists, remove it
      }
      const resp = await ResetPasswords.create({
        resetPasswordToken: jwt.sign(
          { user: user.username, id: user.id },
          process.env.PREMIUM_KEY_SECRET,
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
      const exists = await ResetPasswords.findOne({
        where: {
          resetPasswordToken: token
        }
      });
      const data = await jwt.verify(token, process.env.PREMIUM_KEY_SECRET);
      if (!exists) {
        // if token is valid but doesn't exist in the db as an active token
        return Promise.reject({
          success: false,
          message: "Token is not valid"
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
    const entry = await ResetPasswords.findOne({
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
