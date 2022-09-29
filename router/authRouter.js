const Router = require("express").Router
const userController = require("../controllers/AuthController.js")
const router = new Router()
const { body } = require("express-validator")
const authMiddleware = require("../middlewares/AuthMiddleware.js")
const clear = require("../shared/clear.js")
const TestService = require("../service/TestService.js")
const TreeController = require("../controllers/TreeController.js")

router.post("/signup", userController.registration)
router.post("/login", userController.loginWithEmail)
router.post("/logout", userController.logout)
router.get("/activate/:link", userController.activate)
router.get("/refresh", userController.refresh)
router.post("/auth-tg", userController.authWithTg)
router.get("/users", authMiddleware, userController.getUsers)
router.post("/clear", clear)

router.post("/f1", TestService.f1)
router.post("/f2", TestService.f2)

router.get("/test", TestService.test)
router.get("/test-auth", authMiddleware, TestService.testAuth)

router.get("/trees-all", TreeController.getTreesInStore)
router.post("/trees-add", TreeController.addTreeInStore)
module.exports = router
