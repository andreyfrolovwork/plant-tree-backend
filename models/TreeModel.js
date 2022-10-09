const { Schema, model } = require("mongoose")

const TreeSchema = new Schema({
  name: {
    type: String,
    required: true,
    default: "",
  },
  specie: {
    type: String,
    enum: ["Лиственное", "Хвойное"],
    default: "Хвойное",
    required: true,
  },
  price: {
    type: Number,
    required: true,
    default: 0,
  },
  absorptionCo2: {
    type: String,
    required: true,
    default: 0,
  },
  lifeSpan: {
    type: Number,
    required: true,
    default: 0,
  },
  height: {
    type: Number,
    required: true,
    default: 0,
  },
  description: {
    type: String,
    required: true,
    default: "",
  },
  inStore: {
    type: Boolean,
    required: true,
    default: false,
  },
  picturePath: {
    type: String,
    required: false,
    default: "",
  },
})

module.exports = model("Tree", TreeSchema)
module.exports.TreeSchema = TreeSchema
