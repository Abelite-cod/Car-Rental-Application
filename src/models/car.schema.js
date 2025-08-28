const mongoose = require('mongoose');

const carSchema = new mongoose.Schema(
  {
    make: { type: String, required: true, trim: true },
    model: { type: String, required: true, trim: true },
    year: { type: Number, required: true, min: 1886 },
    // price PER DAY
    price: { type: Number, required: true, min: 0 },

    description: { type: String, trim: true },
    color: { type: String, trim: true },
    brand: { type: String, trim: true },

    // simple availability flag
    isRented: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model('Car', carSchema);
