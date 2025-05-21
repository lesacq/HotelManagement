const express = require('express');
const router = express.Router();
const guestController = require('../controller/guestController');

// Define routes for guest operations
router.get('/', guestController.getAllGuests); // Get all guests
router.get('/:guestId', guestController.getGuestById); // Get guest by ID
router.post('/', guestController.addGuest); // Add a new guest
router.put('/:guestId', guestController.updateGuest); // Update guest
router.delete('/:guestId', guestController.deleteGuest); // Delete guest

module.exports = router;
