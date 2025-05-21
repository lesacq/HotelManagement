const express = require('express');
const router = express.Router();
const serviceController = require('../controller/serviceController');

// Define routes for service operations
router.get('/', serviceController.getAllServices); // Get all services
router.get('/:serviceId', serviceController.getServiceById); // Get service by ID
router.post('/', serviceController.addService); // Add a new service
router.put('/:serviceId', serviceController.updateService); // Update service
router.delete('/:serviceId', serviceController.deleteService); // Delete service

module.exports = router;
