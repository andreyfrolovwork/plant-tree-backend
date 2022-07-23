const models = require("./../models");

async function clear(req, res, next) {
  try {
    const delUsers = await models.users.deleteMany({});
    const detTokens = await models.tokens.deleteMany({});
    res.json("deleted all rows");
  } catch (e) {
    next(e);
  }
}

module.exports = clear;
