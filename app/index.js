require("dotenv").config()
const mongoose = require("mongoose")
const PORT = process.env.PORT_DEV
const app = require("./app.js")

const start = async () => {
  try {
    app.listen(PORT, () => console.log(`Server started on PORT = ${PORT}`))
  } catch (e) {
    console.log(e)
    debugger
  }
}
start()
