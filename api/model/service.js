const { Service } = require('../entities');
const { Op } = require('sequelize');

const ServiceModel = {
    // Method to get the next ServiceId
    getNextServiceId: async () => {
        try {
            console.log('[ServiceModel.getNextServiceId] Generating next service ID');
            const lastService = await Service.findOne({
                order: [['ServiceId', 'DESC']]
            });
            
            let nextId = 'SERVICE0001'; // Default starting ID
            
            if (lastService) {
                // Extract numeric part and increment
                const numericPart = parseInt(lastService.ServiceId.replace('SERVICE', ''), 10) + 1;
                nextId = `SERVICE${String(numericPart).padStart(4, '0')}`;
                console.log('[ServiceModel.getNextServiceId] Found last service ID:', lastService.ServiceId, 'Next ID:', nextId);
            } else {
                console.log('[ServiceModel.getNextServiceId] No existing services found, using default ID:', nextId);
            }
            
            return nextId;
        } catch (error) {
            console.error('[ServiceModel.getNextServiceId] Error generating next service ID:', error);
            throw error;
        }
    },

    // Method to get all services
    getAll: async () => {
        try {
            console.log('[ServiceModel.getAll] Fetching all service records');
            const services = await Service.findAll();
            console.log('[ServiceModel.getAll] Found', services.length, 'service records');
            return services;
        } catch (error) {
            console.error('[ServiceModel.getAll] Error fetching all services:', error);
            throw error;
        }
    },

    // Method to get a service by ID
    getById: async (serviceId) => {
        try {
            console.log('[ServiceModel.getById] Looking for service with ID:', serviceId);
            const service = await Service.findOne({
                where: { ServiceId: serviceId }
            });
            
            if (service) {
                console.log('[ServiceModel.getById] Found service with ID:', serviceId);
            } else {
                console.log('[ServiceModel.getById] No service found with ID:', serviceId);
            }
            
            return service;
        } catch (error) {
            console.error('[ServiceModel.getById] Error fetching service by ID:', serviceId, error);
            throw error;
        }
    },

    // Method to create a new service record with auto-generated ServiceId
    create: async (serviceData) => {
        try {
            console.log('[ServiceModel.create] Creating new service with data:', JSON.stringify(serviceData));
            const nextServiceId = await ServiceModel.getNextServiceId();
            const { ServiceName, price, inCharge } = serviceData;
            
            console.log('[ServiceModel.create] Creating service with ID:', nextServiceId, 'Name:', ServiceName);
            
            const newService = await Service.create({
                ServiceId: nextServiceId,
                ServiceName,
                price,
                inCharge
            });
            
            console.log('[ServiceModel.create] Service created successfully with ID:', nextServiceId);
            
            return {
                ServiceId: newService.ServiceId,
                ServiceName: newService.ServiceName,
                price: newService.price,
                inCharge: newService.inCharge,
                id: newService.id
            };
        } catch (error) {
            console.error('[ServiceModel.create] Error creating service record:', error);
            throw error;
        }
    },

    // Method to update a service record
    update: async (serviceId, updatedData) => {
        try {
            console.log('[ServiceModel.update] Updating service with ID:', serviceId, 'Data:', JSON.stringify(updatedData));
            const { ServiceName, price, inCharge } = updatedData;
            
            const result = await Service.update(
                { ServiceName, price, inCharge },
                { where: { ServiceId: serviceId } }
            );
            
            console.log('[ServiceModel.update] Update result for service ID:', serviceId, 'Rows affected:', result[0]);
            return result;
        } catch (error) {
            console.error('[ServiceModel.update] Error updating service record for ID:', serviceId, error);
            throw error;
        }
    },

    // Method to delete a service record
    delete: async (serviceId) => {
        try {
            console.log('[ServiceModel.delete] Deleting service with ID:', serviceId);
            const result = await Service.destroy({
                where: { ServiceId: serviceId }
            });
            
            console.log('[ServiceModel.delete] Delete result for service ID:', serviceId, 'Rows affected:', result);
            return result;
        } catch (error) {
            console.error('[ServiceModel.delete] Error deleting service record for ID:', serviceId, error);
            throw error;
        }
    }
};

module.exports = ServiceModel;
