const TreeService = require("../service/TreeService.js")
const valid = require("../shared/valid.js")
const isNumber = require("../shared/isNumber.js")
const isString = require("../shared/isString.js")
const { isNumeric, isBoolean } = require("validator")
const { unlink } = require("node:fs/promises")

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
      const { name, specie, price, absorptionCo2, lifeSpan, height, inStore, description } = req.body
      const picturePath = req.savedFiles.treePicture
      valid([
        [isString, name, {}, "name"],
        [isString, specie, {}, "specie is not String "],
        [isNumeric, price, {}, "price is not Numeric "],
        [isNumeric, absorptionCo2, {}, "absorptionCo2 is not Numeric "],
        [isNumeric, lifeSpan, {}, "lifeSpan is not Numeric "],
        [isNumeric, height, {}, "height is not Numeric "],
        [isBoolean, inStore, {}, "inStore is not Boolean "],
        [isString, description, {}, "description is not String "],
        [isString, picturePath, {}, "picturePath is not String "],
      ])

      await TreeService.addTreeInStore({
        name,
        specie,
        price,
        absorptionCo2,
        lifeSpan,
        height,
        inStore,
        description,
        picturePath,
      }).then((r) => {
        res.status(201).json({
          message: "ok",
        })
      })
    } catch (e) {
      if (Object.keys(req.savedFiles).length !== 0) {
        for (const prop in req.savedFiles) {
          await unlink("storage/store/" + req.savedFiles[prop])
        }
      }
      next(e)
    }
  }
}

module.exports = TreeController
