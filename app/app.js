require("dotenv").config()
const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const routes = require("../router/index.js")
const errorMiddleware = require("../middlewares/ErrorMiddleware.js")
const mongoose = require("mongoose")
const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
)

app.use("/images", express.static("storage"))

function getUrlDb() {
  require("dotenv").config()
  if (process.env.NODE_ENV === "test") {
    return process.env.DB_URL_TEST
  } else {
    return process.env.DB_URL
  }
}

mongoose.connect(
  getUrlDb(),
  {
    useNewUrlParser: true,
  },
  () => {
    console.log("db ok")
  }
)
routes(app)
app.use(errorMiddleware)
module.exports = app
