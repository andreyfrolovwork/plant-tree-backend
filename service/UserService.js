const UserModel = require("../models/UserModel.js")
const bcrypt = require("bcrypt")
const uuid = require("uuid")
const tokenService = require("./TokenService.js")
const UserDto = require("../dtos/UserDto.js")
const ApiError = require("../exceptions/ApiError.js")
const models = require("../models/index.js")
const { v1 } = require("uuid")

class UserService {
  static async registration(email, password) {
    const candidate = await UserModel.findOne({ email })
    if (candidate) {
      throw ApiError.BadRequest(`Пользователь с почтовым адресом ${email} уже существует`)
    }
    const hashPassword = await bcrypt.hash(password, 3)
    const activationLink = uuid.v4() // v34fa-asfasf-142saf-sa-asf

    const user = await UserModel.create({
      login: v1(),
      email: email,
      password: hashPassword,
      activationLink,
      isActivated: false,
    })
    /*    await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);*/

    const userDto = new UserDto(user) // id, email, isActivated
    const tokens = tokenService.generateTokens({ ...userDto })
    await tokenService.saveToken(userDto.id, tokens.refreshToken)

    return { ...tokens, ...userDto }
  }

  /*  async activate(activationLink) {
    const user = await UserModel.findOne({ activationLink });
    if (!user) {
      throw ApiError.BadRequest("Неккоректная ссылка активации");
    }
    user.isActivated = true;
    await user.save();
  }*/

  static async login(email, password) {
    const user = await UserModel.findOne({ email })
    if (!user) {
      throw ApiError.BadRequest("Пользователь с таким email не найден")
    }
    const isPassEquals = await bcrypt.compare(password, user.password)
    if (!isPassEquals) {
      throw ApiError.BadRequest("Неверный пароль")
    }
    const userDto = new UserDto(user)
    const tokens = tokenService.generateTokens({ ...userDto })

    await tokenService.saveToken(userDto.id, tokens.refreshToken)
    return { ...tokens, ...userDto }
  }

  static async logWithTg(user) {
    const userDto = new UserDto(user)
    const tokens = tokenService.generateTokens({ ...userDto })

    await tokenService.saveToken(userDto.id, tokens.refreshToken)
    return { ...tokens, ...userDto }
  }

  static async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken)
    return token
  }

  static async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError()
    }
    const userData = tokenService.validateRefreshToken(refreshToken)
    const tokenFromDb = await tokenService.findToken(refreshToken)
    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError()
    }
    const user = await UserModel.findById(userData.id)
    const userDto = new UserDto(user)
    const tokens = tokenService.generateTokens({ ...userDto })

    await tokenService.saveToken(userDto.id, tokens.refreshToken)
    return { ...tokens, ...userDto }
  }

  static async createUser({ tgAccount }) {
    const newUser = await models.users.create({
      tgAccount,
    })
    return newUser
  }

  static async getAllUsers() {
    const users = await UserModel.find()
    return users
  }
}

module.exports = UserService
