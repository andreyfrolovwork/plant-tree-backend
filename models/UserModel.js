const { Schema, model, ObjectId } = require("mongoose")
const { TreeSchema } = require("../models/TreeModel.js")

const Tree = new Schema()

const UserSchema = new Schema({
  login: {
    type: String /*unique: true,*/,
    required: false,
  },
  email: {
    type: String /*unique: true, */,
    required: false,
    default: null,
  },
  password: {
    type: String,
    required: false,
    default: null,
  },
  isActivated: {
    type: Boolean,
    default: false,
  },
  tgAccount: {
    type: String,
    default: null /*unique: true*/,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  history: [
    {
      buyDate: {
        type: Date,
        default: Date.now(),
      },
      items: [
        {
          count: Number,
          tree: TreeSchema,
        },
      ],
      totalPrice: Number,
    },
  ],
})

module.exports = model("User", UserSchema)
