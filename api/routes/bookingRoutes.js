const express = require('express');
const router = express.Router();
const bookingController = require('../controller/bookingController'); // Import the controller

// Get all bookings
router.get('/', bookingController.getBookings);

// Create a new booking
router.post('/', bookingController.createBooking);

// Checkout a booking
router.post('/checkout', bookingController.checkoutBooking);

// Get all service records
router.get('/service-records', bookingController.getServiceRecords);

// Create a new service record
router.post('/service-records', bookingController.createServiceRecord);

module.exports = router;
