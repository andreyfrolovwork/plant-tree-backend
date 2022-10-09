const TreeModel = require("../models/TreeModel.js")
const UserModel = require("../models/UserModel.js")
const TestModel = require("../models/TestModel.js")
const { unlink } = require("node:fs/promises")

class TreeService {
  static async getMyTrees({ user }) {
    try {
      const userDb = await UserModel.findOne({
        _id: user.id,
      })

      const history = userDb.history.map((histEl) => {
        const items = histEl.items.map((buyedTree) => {
          const trees = []
          for (let i = 0; i < buyedTree.count; i++) {
            trees.push({ ...buyedTree.tree._doc })
          }
          return {
            count: buyedTree.count,
            trees,
          }
        })
        return {
          buyDate: histEl.buyDate,
          totalPrice: histEl.totalPrice,
          items,
        }
      })
      /*return history*/
      const trees = []
      history.forEach((histEl) => {
        histEl.items.forEach((item) => {
          item.trees.forEach((tree) => {
            trees.push({
              ...tree,
              buyData: histEl.buyDate,
            })
          })
        })
      })
      return trees
    } catch (e) {
      throw e
    }
  }

  static async addPaidTrees({ trees, user }) {
    const items = []
    for (const tree of trees) {
      const treeFromDb = await TreeModel.findOne({
        _id: tree._id,
      })
      items.push({
        count: tree.count,
        tree: treeFromDb,
      })
    }

    const totalPrice = items.reduce((accum, el) => {
      return accum + el.tree.price * el.count
    }, 0)

    const newPurchare = {
      buyDate: new Date(),
      items,
      totalPrice: totalPrice,
    }
    try {
      const u = await UserModel.updateOne(
        {
          _id: user.id,
        },
        {
          $push: {
            history: newPurchare,
          },
        }
      )

      const u2 = await UserModel.findOne({
        _id: user.id,
      })

      console.log("e")
    } catch (e) {
      throw e
    }
  }

  static async getTreesInStore() {
    return TreeModel.find({
      inStore: true,
    })
  }

  static async deleteTree(id) {
    try {
      const tree = await TreeModel.findOne({
        _id: id,
      })
      await unlink(`storage/store/${tree.picturePath}`)
      return TreeModel.deleteOne({
        _id: id,
      })
    } catch (e) {
      throw e
    }
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
