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