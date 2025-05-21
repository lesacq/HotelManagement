const express = require('express');
const router = express.Router();
const staffController = require('../controller/staffController');

// Define routes for staff operations
router.get('/', staffController.getAllStaff); // Get all staff
router.get('/:staffId', staffController.getStaffById); // Get staff by ID
router.post('/', staffController.addStaff); // Add new staff
router.put('/:staffId', staffController.updateStaff); // Update staff
router.delete('/:staffId', staffController.deleteStaff); // Delete staff
router.post('/login', staffController.staffLogin); // Staff login route

module.exports = router;
