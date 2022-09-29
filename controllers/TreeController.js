const TreeService = require("../service/TreeService.js")

class TreeController {
  static async getTreesInStore(req, res, next) {
    try {
      const Trees = await TreeService.getTreesInStore()
    } catch (e) {
      next(e)
    }
  }

  static async addTreeInStore(req, res, next) {
    try {
      const { name, specie, price, absorptionCo2, lifeSpan, height } = req.body
      await TreeService.addTreeInStore({
        name,
        specie,
        price,
        absorptionCo2,
        lifeSpan,
        height,
      }).then((r) => {
        res.status(201).json({
          message: "ok",
        })
      })
    } catch (e) {
      next(e)
    }
  }
}

module.exports = TreeController
