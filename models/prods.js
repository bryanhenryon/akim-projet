const mongoose = require("mongoose");

const prodsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 30,
  },
  song: {
    type: String,
    required: true,
    trim: true
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
  genres: {
    type: [String],
    required: true
  },
  price: {
      type: String,
      required: true
  },
  maxStreams: {
    type: Number,
    required: true
  }
}, { timestamps: true });

const Prods = mongoose.model("Prods", prodsSchema);

module.exports = Prods;