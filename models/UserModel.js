const { Schema, model } = require("mongoose")
const Tree = new Schema({
  buyDate: { type: Date, default: Date.now() },
})
const UserSchema = new Schema({
  login: { type: String, /*unique: true,*/ required: false },
  email: { type: String, /*unique: true, */ required: false, default: null },
  password: { type: String, required: false, default: null },
  isActivated: { type: Boolean, default: false },
  tgAccount: { type: String, default: null /*unique: true*/ },
  store: {
    trees: [Tree],
  },
})

module.exports = model("User", UserSchema)
