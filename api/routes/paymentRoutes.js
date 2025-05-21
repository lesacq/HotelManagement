const express = require('express');
const router = express.Router();
const paymentController = require('../controller/paymentController');

// Define routes for room operations
router.get('/', paymentController.getAllPayments); // Get all rooms


module.exports = router;
