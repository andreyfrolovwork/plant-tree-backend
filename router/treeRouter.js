const Router = require("express").Router
const router = new Router()
const TreeController = require("../controllers/TreeController.js")
const fileMiddleware = require("../middlewares/FileMiddleware.js")

router.get("/trees-all", TreeController.getTreesInStore)
router.post("/trees-add", fileMiddleware.any(), TreeController.addTreeInStore)

module.exports = router
