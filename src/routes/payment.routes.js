const express = require('express');
const axios = require('axios');
const Rental = require('../models/rental.schema');
const Car = require('../models/car.schema');

const router = express.Router();

/**
 * Redirect/callback from Flutterwave
 * GET /api/payment/callback?status=successful&transaction_id=...&tx_ref=...
 */
// ===================== FLUTTERWAVE CALLBACK =====================
router.get("/callback", async (req, res) => {
  const { status, tx_ref, transaction_id } = req.query;

  try {
    // Accept both 'successful' and 'completed'
    if (status === "successful" || status === "completed") {
      // Verify transaction with Flutterwave
      const verifyRes = await axios.get(
        `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`,
        {
          headers: {
            Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
          },
        }
      );

      if (verifyRes.data.status === "success") {
        const rentalId = tx_ref.split('_')[1]; // Extract rental ObjectId
        const carId = verifyRes.data.data.meta.carId;

        // Update rental and car
        await Rental.findByIdAndUpdate(rentalId, { status: "paid" });
        await Car.findByIdAndUpdate(carId, { isRented: true });

        return res.send("✅ Payment verified successfully, car rented!");
      }
    }

    // If payment failed or cancelled
    const rentalId = tx_ref.split('_')[1];
    await Rental.findByIdAndUpdate(rentalId, { status: "failed" });
    return res.send("❌ Payment failed or cancelled.");
  } catch (err) {
    console.error("Payment callback error:", err.response?.data || err.message);
    res.status(500).send("Internal server error");
  }
});


/**
 * Optional: Webhook for server-to-server confirmation
 * Set the webhook URL in Flutterwave dashboard to POST /api/payment/webhook
 * NOTE: For signature verification you’d need the raw body. Skipping here for brevity.
 */
router.post('/webhook', express.json({ type: '*/*' }), async (req, res) => {
  try {
    const payload = req.body;

    if (payload?.event === 'charge.completed' && payload?.data?.status === 'successful') {
      const txRef = payload.data.tx_ref;
      const rental = await Rental.findOne({ tx_ref: txRef });
      if (rental) {
        rental.status = 'paid';
        await rental.save();
        await Car.findByIdAndUpdate(rental.carId, { isRented: true });
      }
    }

    res.sendStatus(200);
  } catch (err) {
    console.error('Webhook error:', err.message);
    res.sendStatus(500);
  }
});

module.exports = router;
