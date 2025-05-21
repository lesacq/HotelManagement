const express = require('express');
const router = express.Router();
const roomController = require('../controller/roomController');

// Define routes for room operations
router.get('/', roomController.getAllRooms); // Get all rooms
router.get('/:roomNumber', roomController.getRoomByNumber); // Get room by roomNumber
router.post('/', roomController.addRoom); // Add a new room
router.put('/:roomNumber', roomController.updateRoom); // Update a room
router.delete('/:roomNumber', roomController.deleteRoom); // Delete a room

module.exports = router;
