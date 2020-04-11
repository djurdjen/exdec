const { PremiumKeys } = require("../../models/index");

const secret = require("../secrets");
const bcrypt = require("bcrypt");

const actions = {
  async createKey() {
    try {
      const hash = await bcrypt.hash(
        process.env.PREMIUM_KEY_SECRET,
        secret.saltRounds
      );
      await PremiumKeys.create({
        keyCode: hash
      });
      return Promise.resolve(hash);
    } catch (err) {
      console.log(err);
      return Promise.reject("Something went wrong...", err);
    }
  },
  assignPremiumKey() {}
};

module.exports = actions;
