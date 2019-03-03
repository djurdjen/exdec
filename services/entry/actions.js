const model = require("./model");

const Entry = model.model;
const connection = model.connection;
const actions = {
  async createEntryTable({ force, alter }) {
    try {
      await connection.sync({ force, alter });
    } catch (err) {
      return Promise.reject(err);
    }
  },
  async postEntry(req) {
    try {
      const resp = await Entry.create({
        ...req.body,
        userId: req.decoded.id
      });
      return resp.dataValues;
    } catch (err) {
      return Promise.reject(err.errors);
    }
  },
  async getEntries(req) {
    try {
      const entries = await Entry.findAll({
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
      const entry = await Entry.findOne({
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
      Entry.destroy({
        where: {},
        truncate: true
      });
    } catch (err) {
      return Promise.reject(err);
    }
  }
};

module.exports = actions;
