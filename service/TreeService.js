const TreeModel = require("../models/TreeModel.js")

class TreeService {
  static async getTreesInStore() {
    return TreeModel.find({
      inStore: true,
    })
  }
  static async deleteTree(id) {
    return TreeModel.deleteOne({
      _id: id,
    })
  }
  static async saveTree(tree) {
    return TreeModel.updateOne(
      {
        _id: tree._id,
      },
      tree
    )
  }

  static async addTree() {
    return TreeModel.create({
      name: "пусто",
      specie: "Хвойное",
      price: 0,
      absorptionCo2: 0,
      lifeSpan: 0,
      height: 0,
      description: "пусто",
      inStore: false,
      picturePath: "пусто",
    })
  }

  static async addTreeInStore(tree) {
    return TreeModel.create(tree)
  }

  static async allTrees() {
    const trees = await TreeModel.find({})
    return trees
  }
}

module.exports = TreeService
