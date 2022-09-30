const authRouter = require("./authRouter.js")
const treeRouter = require("./treeRouter.js")

module.exports = (app) => {
  app.use("/api", authRouter)
  app.use("/api", treeRouter)
}
