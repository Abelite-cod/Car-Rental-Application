const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    carId: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },

    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },

    // computed: days * car.price
    totalPrice: { type: Number, required: true, min: 0 },

    status: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },

    // Optional: store Flutterwave tx_ref for verification linking
    tx_ref: { type: String },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model('Rental', rentalSchema);
