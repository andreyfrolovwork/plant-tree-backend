const TreeService = require("../service/TreeService.js")
const valid = require("../shared/valid.js")
const isNumber = require("../shared/isNumber.js")
const isString = require("../shared/isString.js")
const { isNumeric, isBoolean } = require("validator")
const { unlink } = require("node:fs/promises")

function delUndef(obj) {
  const newObj = {}
  for (const prop in obj) {
    if (obj[prop] !== undefined) {
      newObj[prop] = obj[prop]
    }
  }
  return newObj
}

class TreeController {
  static async getMyTrees(req, res, next) {
    try {
      const hist = await TreeService.getMyTrees({
        user: req.user,
      })
      res.json(hist)
    } catch (e) {
      next(e)
    }
  }
  static async buyTrees(req, res, next) {
    try {
      const trees = req.body.items

      await TreeService.addPaidTrees({
        user: req.user,
        trees,
      })
      res.json({ message: "ok" })
    } catch (e) {
      next(e)
    }
  }

  static async getAllTreesInStore(req, res, next) {
    try {
      const trees = await TreeService.getTreesInStore()
      res.json(trees)
    } catch (e) {
      next(e)
    }
  }

  static async deleteTree(req, res, next) {
    try {
      const { _id } = req.body
      if (!_id) {
        throw new Error("Отсутствует id")
      }
      await TreeService.deleteTree(_id).then((r) => {
        res.json({ message: "ok" })
      })
    } catch (e) {
      next(e)
    }
  }

  static async saveTree(req, res, next) {
    try {
      const { _id, name, specie, price, absorptionCo2, lifeSpan, height, inStore, description } = req.body
      const picturePath = req.savedFiles
        ? req.savedFiles.picturePath
          ? req.savedFiles.picturePath
          : undefined
        : undefined

      const tree = {
        _id,
        name,
        specie,
        price,
        absorptionCo2,
        lifeSpan,
        height,
        inStore,
        description,
        picturePath,
      }
      const newTree = delUndef(tree)

      await TreeService.saveTree(newTree)
      res.json({
        message: "ok",
      })
    } catch (e) {
      if (Object.keys(req.savedFiles).length !== 0) {
        for (const prop in req.savedFiles) {
          await unlink(`storage/store/${req.savedFiles[prop]}`)
        }
      }
      next(e)
    }
  }

  static async addEmptyTree(req, res, next) {
    try {
      await TreeService.addTree()
      res.status(201).json({ message: "ok" })
    } catch (e) {
      next(e)
    }
  }

  static async getAllTrees(req, res, next) {
    try {
      const Trees = await TreeService.allTrees()
      res.json(Trees)
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
          await unlink(`storage/store/${req.savedFiles[prop]}`)
        }
      }
      next(e)
    }
  }
}

module.exports = TreeController
