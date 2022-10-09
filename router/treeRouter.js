const Router = require("express").Router
const router = new Router()
const TreeController = require("../controllers/TreeController.js")
const fileMiddleware = require("../middlewares/FileMiddleware.js")
const adminMiddleware = require("../middlewares/AuthAdminMiddleware.js")
const userMiddleware = require("../middlewares/AuthMiddleware.js")

router.post("/trees-delete", adminMiddleware, TreeController.deleteTree)
router.post("/trees-add-empty", adminMiddleware, TreeController.addEmptyTree)
router.post("/trees-save", adminMiddleware, fileMiddleware.any(), TreeController.saveTree)
router.get("/trees-all", adminMiddleware, TreeController.getAllTrees)
router.post("/trees-add", adminMiddleware, fileMiddleware.any(), TreeController.addTreeInStore)

router.post("/trees-buy", userMiddleware, TreeController.buyTrees)
router.get("/trees-my", userMiddleware, TreeController.getMyTrees)

router.get("/trees-all-in-store", TreeController.getAllTreesInStore)

module.exports = router
