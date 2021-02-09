const mongoose = require("mongoose");

const prodsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: [30, "Le titre doit être de 30 caractères maximum"],
  },
  song: {
    type: String,
    required: true,
    trim: true
  },
  songToDisplay: {
    type: String,
    trim: true
  },
  format: {
    type: String,
  },
  artist: {
    type: String,
    required: true,
    trim: true,
  },
  cover: {
    type: String,
    trim: true,
    default: "placeholder.jpg"
  },
  coverToDisplay: {
    type: String,
    trim: true
  },
  tags: {
    type: [String]
  },
  price: {
      type: String,
      required: true
  },
  maxStreams: {
    type: String,
    default: "illimité"
  }
}, { timestamps: true });

const Prods = mongoose.model("Prods", prodsSchema);

module.exports = Prods;