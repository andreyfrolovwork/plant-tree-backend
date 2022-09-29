const TreeModel = require("../models/TreeModel.js")

class TreeService {
  static async addTreeInStore(tree) {
    return TreeModel.create(tree)
  }
  static async getTreesInStore() {
    const trees = await TreeModel.find({})
    return trees
  }
}

module.exports = TreeService
