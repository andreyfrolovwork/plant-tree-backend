const Router = require("express").Router
const userController = require("../controllers/AuthController.js")
const router = new Router()
const { body } = require("express-validator")
const authMiddleware = require("../middlewares/AuthMiddleware.js")
const clear = require("../shared/clear.js")

router.post(
  "/signup",
  body("email").isEmail(),
  body("password").isLength({ min: 3, max: 32 }),
  userController.registration
)
router.post("/login", userController.loginWithEmail)
router.post("/logout", userController.logout)
router.get("/activate/:link", userController.activate)
router.get("/refresh", userController.refresh)
router.post("/auth-tg", userController.authWithTg)
router.get("/users", authMiddleware, userController.getUsers)
router.post("/clear", clear)

module.exports = router
