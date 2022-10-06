const Router = require("express").Router
const router = new Router()
const TreeController = require("../controllers/TreeController.js")
const fileMiddleware = require("../middlewares/FileMiddleware.js")

router.post("/trees-delete", TreeController.deleteTree)
router.post("/trees-add-empty", TreeController.addEmptyTree)
router.post("/trees-save", fileMiddleware.any(), TreeController.saveTree)
router.get("/trees-all", TreeController.getAllTrees)
router.post("/trees-add", fileMiddleware.any(), TreeController.addTreeInStore)

router.get("/trees-all-in-store", TreeController.getAllTreesInStore)

module.exports = router
