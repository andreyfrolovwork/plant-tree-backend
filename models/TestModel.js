const { Schema, model, ObjectId } = require("mongoose")
const { TreeSchema } = require("../models/TreeModel.js")

const Tree = new Schema({
  buyDate: {
    type: Date,
    default: Date.now(),
  },
  items: [
    {
      count: Number,
      tree: [TreeSchema],
    },
  ],
  totalPrice: Number,
})

const TestSchema = new Schema({
  name: String,
  testAr: [{ id: String }],
  store: {
    history: [
      {
        id: String,
      },
    ],
  },
})

module.exports = model("Test", TestSchema)
