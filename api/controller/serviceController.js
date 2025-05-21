const Service = require('../model/service');

// Get all services
exports.getAllServices = async (req, res) => {
    try {
        console.log('[ServiceController.getAllServices] Fetching all services');
        const serviceList = await Service.getAll();
        console.log('[ServiceController.getAllServices] Successfully fetched services, count:', serviceList.length);
        res.status(200).json(serviceList);
    } catch (err) {
        console.error('[ServiceController.getAllServices] Error:', err);
        return res.status(500).json({ error: err.message });
    }
};

// Get service by ID
exports.getServiceById = async (req, res) => {
    const { serviceId } = req.params;
    try {
        console.log('[ServiceController.getServiceById] Fetching service with ID:', serviceId);
        const service = await Service.getById(serviceId);
        
        if (!service) {
            console.warn('[ServiceController.getServiceById] Service not found:', serviceId);
            return res.status(404).json({ message: 'Service not found' });
        }
        
        console.log('[ServiceController.getServiceById] Successfully fetched service:', serviceId);
        res.status(200).json(service);
    } catch (err) {
        console.error('[ServiceController.getServiceById] Error fetching service:', serviceId, err);
        return res.status(500).json({ error: err.message });
    }
};

// Add a new service
exports.addService = async (req, res) => {
    const serviceData = req.body;
    console.log('[ServiceController.addService] Incoming request payload:', serviceData);

    try {
        const result = await Service.create(serviceData);
        console.log('[ServiceController.addService] Service created successfully:', result);
        res.status(201).json({ message: 'Service added successfully', data: result });
    } catch (err) {
        console.error('[ServiceController.addService] Error while creating service:', err);
        return res.status(500).json({ error: 'Failed to create service', details: err.message });
    }
};

// Update a service
exports.updateService = async (req, res) => {
    const { serviceId } = req.params;
    const updatedData = req.body;
    
    try {
        console.log('[ServiceController.updateService] Updating service:', serviceId, 'with data:', updatedData);
        const result = await Service.update(serviceId, updatedData);
        console.log('[ServiceController.updateService] Service updated successfully:', serviceId);
        res.status(200).json({ message: 'Service updated successfully', data: result });
    } catch (err) {
        console.error('[ServiceController.updateService] Error updating service:', serviceId, err);
        return res.status(500).json({ error: err.message });
    }
};

// Delete a service
exports.deleteService = async (req, res) => {
    const { serviceId } = req.params;
    
    try {
        console.log('[ServiceController.deleteService] Deleting service:', serviceId);
        const result = await Service.delete(serviceId);
        console.log('[ServiceController.deleteService] Service deleted successfully:', serviceId);
        res.status(200).json({ message: 'Service deleted successfully' });
    } catch (err) {
        console.error('[ServiceController.deleteService] Error deleting service:', serviceId, err);
        return res.status(500).json({ error: err.message });
    }
};
