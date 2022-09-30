const { Schema, model } = require("mongoose")

const TreeSchema = new Schema({
  name: {
    type: String,
    required: true,
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
  },
  absorptionCo2: {
    type: Number,
    required: true,
  },
  lifeSpan: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  inStore: {
    type: Boolean,
    required: true,
  },
  picturePath: {
    type: String,
    required: false,
  },
})

module.exports = model("Tree", TreeSchema)
