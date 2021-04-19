const { Users } = require("../../models/index");

const bcrypt = require("bcrypt");
const secret = require("../secrets");

const actions = {
  async register(user, password) {
    const hash = await bcrypt.hash(password, secret.saltRounds);
    return Users.findOrCreate({
      where: { username: user },
      defaults: { password: hash, settings: '{"compensation": 0.19}' },
    })
      .catch((err) => {
        return Promise.reject(String(err.message));
      })
      .spread((user, unique) => {
        if (unique) {
          return Promise.resolve(user.dataValues);
        } else {
          return Promise.reject("Gebruiker bestaat al");
        }
      });
  },
  async login(user) {
    return await Users.findAll({
      where: {
        username: user,
      },
    });
  },
  async verifyUserExisting(username) {
    const user = await Users.findOne({ where: { username: username } });
    if (user) {
      return Promise.resolve(user);
    } else {
      return Promise.reject("Deze gebruiker is niet bekend bij ons");
    }
  },
  async getUserSettings(username) {
    const user = await Users.findOne({ where: { username: username } });
    return Promise.resolve(user.dataValues.settings);
  },
  async editUserSettings(username, settings) {
    try {
      const user = await Users.findOne({ where: { username: username } });
      const val = await user.update({ settings: JSON.stringify(settings) });
      return Promise.resolve(val.dataValues);
    } catch (err) {
      return Promise.reject(err.errors);
    }
  },
  async changePassword(data) {
    const user = await Users.findOne({ where: { username: data.user } });
    await bcrypt.hash(data.password, secret.saltRounds, function (err, hash) {
      user.update({ password: hash });
    });
    return Promise.resolve("password changed!");
  },
  async createUserTable({ force, alter }) {
    try {
      await connection.sync({ force, alter });
    } catch (err) {
      return Promise.reject(err.errors);
    }
  },
};

module.exports = actions;
