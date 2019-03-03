const model = require("./model");

const User = model.model;
const connection = model.connection;

const actions = {
  async register(user, hash) {
    return await connection
      .sync()
      .then(() =>
        User.findOrCreate({
          where: { username: user },
          defaults: { password: hash, settings: '{"compensation": 0.19}' }
        })
      )
      .catch(err => {
        return Promise.reject(String(err.message));
      })
      .spread((user, unique) => {
        if (unique) {
          return Promise.resolve(user.dataValues);
        } else {
          return Promise.reject("User already exists");
        }
      });
  },
  async login(user) {
    return await User.findAll({
      where: {
        username: user
      }
    });
  },
  async getUserSettings(username) {
    const user = await User.findOne({ where: { username: username } });
    return Promise.resolve(user.dataValues.settings);
  },
  async editUserSettings(username, settings) {
    try {
      const user = await User.findOne({ where: { username: username } });
      const val = await user.update({ settings: JSON.stringify(settings) });
      return Promise.resolve(val.dataValues);
    } catch (err) {
      return Promise.reject(err.errors);
    }
  },
  async createUserTable({ force, alter }) {
    try {
      await connection.sync({ force, alter });
    } catch (err) {
      return Promise.reject(err.errors);
    }
  }
};

module.exports = actions;
