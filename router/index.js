const authRouter = require("./authRouter.js");

module.exports = (app) => {
  app.use("/api", authRouter);
};
