const axios = require('axios');
const Car = require('../models/car.schema');
const Rental = require('../models/rental.schema');

/**
 * POST /api/cars/rent-car/:carId
 * Body: { startDate, endDate }
 * Auth: Bearer token (req.user.id available from isAuthenticated middleware)
 */
exports.rentCar = async (req, res) => {
  try {
    const { carId } = req.params;
    const userId = req.user.id;
    const { startDate, endDate } = req.body;

    // 1) Validate inputs
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'startDate and endDate are required' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start) || isNaN(end)) {
      return res.status(400).json({ message: 'Invalid dates' });
    }
    if (end <= start) {
      return res.status(400).json({ message: 'endDate must be after startDate' });
    }

    // 2) Find car
    const car = await Car.findById(carId);
    if (!car) return res.status(404).json({ message: 'Car not found' });

    // 3) (Optional) Prevent overlapping rentals for this car
    const overlap = await Rental.findOne({
      carId: car._id,
      status: { $in: ['pending', 'paid'] },
      $or: [
        { startDate: { $lte: end }, endDate: { $gte: start } },
      ],
    });
    if (overlap) {
      return res.status(400).json({ message: 'Car is already booked for the selected dates' });
    }

    // 4) Calculate total price
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const totalPrice = days * Number(car.price);
    if (!Number.isFinite(totalPrice) || totalPrice < 0) {
      return res.status(500).json({ message: 'Error calculating total price' });
    }

    // 5) Create rental (pending)
    const rental = await Rental.create({
      userId,
      carId: car._id,
      startDate: start,
      endDate: end,
      totalPrice,
      status: 'pending',
    });

    // 6) Initiate payment via Flutterwave
    const tx_ref = `rental_${rental._id}_${Date.now()}`;
    const payload = {
      tx_ref: rental._id.toString(),
      amount: totalPrice,
      currency: 'NGN',
      redirect_url: process.env.FLW_REDIRECT_URL || `${process.env.BASE_URL}/api/payment/callback`,
      customer: {
        email: req.user.email || 'user@example.com',
        name: req.user.name || 'Customer',
      },
      meta: {
        rentalId: rental._id.toString(),
        carId: car._id.toString(),
        userId: userId.toString(),
      },
      customizations: {
        title: 'Car Rental Payment',
        description: `Payment for ${car.make} ${car.model}`,
      },
    };

    const flwRes = await axios.post('https://api.flutterwave.com/v3/payments', payload, {
      headers: {
        Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (flwRes.data?.status !== 'success') {
      // mark rental failed if payment init fails
      rental.status = 'failed';
      await rental.save();
      return res.status(500).json({ message: 'Failed to initiate payment' });
    }

    // Save tx_ref so we can match in callback
    rental.tx_ref = tx_ref;
    await rental.save();

    return res.status(200).json({
      message: 'Proceed to payment',
      paymentLink: flwRes.data.data.link,
      rentalId: rental._id,
      totalPrice,
      days,
    });
  } catch (error) {
    console.error('RentCar error:', error.response?.data || error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
