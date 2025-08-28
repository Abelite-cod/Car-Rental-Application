const express = require('express');
const router = express.Router();
const { addCar, searchCars, getAllCars, editCar, deleteCar } = require('../controller/admin.controller');
const { isAuthenticated } = require('../middlewares/isAuth');
const { rentCar } = require('../controller/rental.controller');

// Admin car CRUD
router.post('/add-car', isAuthenticated, addCar);
router.get('/search-cars', searchCars);
router.get('/get-cars', getAllCars);
router.put('/edit-car/:carID', isAuthenticated, editCar);
router.delete('/delete-car/:carID', isAuthenticated, deleteCar);

// Rentals
router.post('/rent-car/:carId', isAuthenticated, rentCar);

module.exports = router;
