const { Entries } = require("../../models/index");

const actions = {
  async postEntry(req) {
    try {
      const resp = await Entries.create({
        ...req.body,
        userId: req.decoded.id
      });
      return resp.dataValues;
    } catch (err) {
      console.log(err);
      return Promise.reject(err.errors);
    }
  },
  async editEntry(req) {
    try {
      const entry = await Entries.findOne({
        where: {
          id: req.body.id
        },
        limit: 1
      });
      await entry.update({ ...req.body });
    } catch (err) {
      return Promise.reject(err.errors);
    }
  },
  async getEntries(req) {
    try {
      const entries = await Entries.findAll({
        where: {
          userId: req.decoded.id
        }
      });
      return entries;
    } catch (err) {
      return Promise.reject(err.errors[0].message);
    }
  },
  async deleteEntry(id) {
    try {
      const entry = await Entries.findOne({
        where: {
          id: id
        },
        limit: 1
      });
      await entry.destroy();
    } catch (err) {
      return Promise.reject(err.errors);
    }
  },
  async deleteAllEntries() {
    try {
      Entries.destroy({
        where: {},
        truncate: true
      });
    } catch (err) {
      return Promise.reject(err);
    }
  }
};

module.exports = actions;
