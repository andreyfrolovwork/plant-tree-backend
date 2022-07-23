const userService = require("../service/UserService.js")
const { validationResult } = require("express-validator")
const ApiError = require("../exceptions/ApiError.js")
const models = require("../models/index.js")
const checkSignature = require("../shared/checkSignature.js")
const UserService = require("../service/UserService.js")
const { v1 } = require("uuid")

class AuthController {
  async registration(req, res, next) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest("Ошибка при валидации", errors.array()))
      }
      const { email, password } = req.body
      const userData = await userService.registration(email, password)
      res.cookie("refreshToken", userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
      return res.json(userData)
    } catch (e) {
      next(e)
    }
  }

  async loginWithEmail(req, res, next) {
    try {
      const { email, password } = req.body
      const userData = await userService.login(email, password)
      res.cookie("refreshToken", userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
      return res.json(userData)
    } catch (e) {
      next(e)
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies
      const token = await userService.logout(refreshToken)
      res.clearCookie("refreshToken")
      return res.json(token)
    } catch (e) {
      next(e)
    }
  }

  async activate(req, res, next) {
    try {
      const activationLink = req.params.link
      await userService.activate(activationLink)
      return res.redirect(process.env.CLIENT_URL)
    } catch (e) {
      next(e)
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies
      const userData = await userService.refresh(refreshToken)
      res.cookie("refreshToken", userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
      return res.json(userData)
    } catch (e) {
      next(e)
    }
  }

  async authWithTg(req, res, next) {
    try {
      const userData = req.body
      if (
        !checkSignature({
          hash: userData.hash,
          ...userData,
        })
      ) {
        throw ApiError.UnauthorizedError()
      }
      const user = await models.users.find({
        tgAccount: userData.username,
      })
      console.log(user[0])
      if (user.length === 0) {
        const newUser = await UserService.createUser({ login: v1(), tgAccount: userData.username })
        const response = await UserService.logWithTg(newUser)
        res.json(response)
      }
      if (user.length !== 0) {
        const response = await UserService.logWithTg(user[0]._doc)
        res.json(response)
      }

      console.log("")
    } catch (e) {
      next(e)
    }
  }

  async getUsers(req, res, next) {
    try {
      const users = await userService.getAllUsers()
      return res.json(users)
    } catch (e) {
      next(e)
    }
  }
}

module.exports = new AuthController()
