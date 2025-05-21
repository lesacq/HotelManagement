const { Booking: BookingEntity, Room, Payment, ServiceRecord: ServiceRecordEntity } = require('../entities');
const { v4: uuidv4 } = require('uuid');
const { sequelize } = require('../entities');

const BookingModel = {
    // Method to get all bookings
    getAll: async () => {
        try {
            console.log('[BookingModel.getAll] Fetching all booking records');
            const bookings = await BookingEntity.findAll({
                order: [['checkInDate', 'DESC']]
            });
            console.log('[BookingModel.getAll] Found', bookings.length, 'booking records');
            return bookings;
        } catch (error) {
            console.error('[BookingModel.getAll] Error fetching all bookings:', error);
            throw error;
        }
    },

    // Method to create a new booking
    create: async (bookingData) => {
        const { roomNumber, guestId, amount, paymentMethod, StaffId } = bookingData;
        console.log('[BookingModel.create] Creating new booking with data:', JSON.stringify(bookingData));
        
        const bookingId = uuidv4();
        const checkInDate = new Date().toISOString().split('T')[0];
        
        // Using transaction to ensure all operations succeed or fail together
        const t = await sequelize.transaction();
        
        try {
            console.log('[BookingModel.create] Changing room status to occupied for room:', roomNumber);
            // Change room status to occupied
            await Room.update(
                { status: 'occupied' },
                { 
                    where: { roomNumber },
                    transaction: t
                }
            );
            
            console.log('[BookingModel.create] Creating booking record with ID:', bookingId);
            // Insert into bookings table
            await BookingEntity.create({
                BookingId: bookingId,
                Status: 'checked_in',
                GuestId: guestId,
                StaffId,
                roomNumber,
                checkInDate
            }, { transaction: t });
            
            console.log('[BookingModel.create] Creating payment record for booking:', bookingId);
            // Insert into payments table
            await Payment.create({
                amount,
                paymentMethod,
                StaffId,
                itemId: bookingId
            }, { transaction: t });
            
            // Commit transaction
            await t.commit();
            console.log('[BookingModel.create] Booking created successfully with ID:', bookingId);
            
            return { message: 'Booking created successfully', bookingId };
        } catch (error) {
            // Rollback transaction on error
            await t.rollback();
            console.error('[BookingModel.create] Error creating booking:', error);
            throw error;
        }
    },

    // Method to check out a booking
    checkout: async (bookingData) => {
        const { bookingId, roomNumber } = bookingData;
        console.log('[BookingModel.checkout] Checking out booking:', JSON.stringify(bookingData));
        
        const checkOutDate = new Date().toISOString().split('T')[0];
        
        // Using transaction to ensure all operations succeed or fail together
        const t = await sequelize.transaction();
        
        try {
            console.log('[BookingModel.checkout] Updating booking status for ID:', bookingId);
            // Update booking with check-out date
            await BookingEntity.update(
                {
                    checkOutDate,
                    Status: 'checked_out'
                },
                { 
                    where: { BookingId: bookingId },
                    transaction: t
                }
            );
            
            console.log('[BookingModel.checkout] Changing room status to available for room:', roomNumber);
            // Update room status to available
            await Room.update(
                { status: 'available' },
                { 
                    where: { roomNumber },
                    transaction: t
                }
            );
            
            // Commit transaction
            await t.commit();
            console.log('[BookingModel.checkout] Booking checked out successfully:', bookingId);
            
            return { message: 'Booking checked out successfully' };
        } catch (error) {
            // Rollback transaction on error
            await t.rollback();
            console.error('[BookingModel.checkout] Error checking out booking:', error);
            throw error;
        }
    }
};

const ServiceRecordModel = {
    // Method to get all service records
    getAll: async () => {
        try {
            console.log('[ServiceRecordModel.getAll] Fetching all service records');
            const records = await ServiceRecordEntity.findAll({
                order: [['date', 'DESC']]
            });
            console.log('[ServiceRecordModel.getAll] Found', records.length, 'service records');
            return records;
        } catch (error) {
            console.error('[ServiceRecordModel.getAll] Error fetching all service records:', error);
            throw error;
        }
    },

    // Method to create a new service record
    create: async (serviceData) => {
        const { guestId, amount, StaffId, paymentMethod } = serviceData;
        console.log('[ServiceRecordModel.create] Creating new service record with data:', JSON.stringify(serviceData));
        
        const recordId = uuidv4();
        const currentDate = new Date().toISOString().split('T')[0];
        
        // Using transaction to ensure all operations succeed or fail together
        const t = await sequelize.transaction();
        
        try {
            console.log('[ServiceRecordModel.create] Creating service record with ID:', recordId);
            // Insert into service records table
            await ServiceRecordEntity.create({
                RecordId: recordId,
                amount,
                date: currentDate,
                status: 'paid',
                GuestId: guestId,
                StaffId
            }, { transaction: t });
            
            console.log('[ServiceRecordModel.create] Creating payment record for service:', recordId);
            // Insert into payments table
            await Payment.create({
                amount,
                paymentMethod,
                StaffId,
                itemId: recordId
            }, { transaction: t });
            
            // Commit transaction
            await t.commit();
            console.log('[ServiceRecordModel.create] Service record created successfully with ID:', recordId);
            
            return { message: 'Service record created successfully', recordId };
        } catch (error) {
            // Rollback transaction on error
            await t.rollback();
            console.error('[ServiceRecordModel.create] Error creating service record:', error);
            throw error;
        }
    }
};

module.exports = { Booking: BookingModel, ServiceRecord: ServiceRecordModel };
