class TestService {
  static async test(req, res, next) {
    res.json("ok")
  }

  static async testAuth(req, res, next) {
    res.json("ok")
  }

  static async f1(req, res, next) {
    res.cookie("refreshToken", "f1", { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
    res.json("f1")
  }

  static async f2(req, res, next) {
    res.cookie("refreshToken", "f2", { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
    res.json("f2")
  }
}

module.exports = TestService
