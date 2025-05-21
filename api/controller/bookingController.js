const { Booking, ServiceRecord } = require('../model/booking'); // Import the Booking and ServiceRecord models

// Fetch all bookings
exports.getBookings = async (req, res) => {
    try {
        console.log('[BookingController.getBookings] Fetching all bookings');
        const bookings = await Booking.getAll();
        console.log('[BookingController.getBookings] Successfully fetched bookings count:', bookings.length);
        res.status(200).json(bookings);
    } catch (err) {
        console.error('[BookingController.getBookings] Error fetching bookings:', err);
        return res.status(500).json({ error: 'Error fetching bookings', details: err.message });
    }
};

// Create a new booking
exports.createBooking = async (req, res) => {
    const { roomNumber, guestId, amount, paymentMethod, StaffId } = req.body;
    console.log('[BookingController.createBooking] Creating new booking:', { roomNumber, guestId, amount, paymentMethod, StaffId });

    try {
        const bookingData = {
            roomNumber,
            guestId,
            amount,
            paymentMethod,
            StaffId
        };

        const result = await Booking.create(bookingData);
        console.log('[BookingController.createBooking] Booking created successfully');
        res.status(201).json(result);
    } catch (err) {
        console.error('[BookingController.createBooking] Error creating booking:', err);
        return res.status(500).json({ error: 'Error creating booking', details: err.message });
    }
};

// Checkout a booking
exports.checkoutBooking = async (req, res) => {
    const { bookingId, roomNumber } = req.body;
    console.log('[BookingController.checkoutBooking] Checking out booking:', { bookingId, roomNumber });

    try {
        const bookingData = {
            bookingId,
            roomNumber
        };

        const result = await Booking.checkout(bookingData);
        console.log('[BookingController.checkoutBooking] Booking checked out successfully');
        res.status(200).json(result);
    } catch (err) {
        console.error('[BookingController.checkoutBooking] Error checking out booking:', err);
        return res.status(500).json({ error: 'Error checking out booking', details: err.message });
    }
};

// Fetch all service records
exports.getServiceRecords = async (req, res) => {
    try {
        console.log('[BookingController.getServiceRecords] Fetching all service records');
        const serviceRecords = await ServiceRecord.getAll();
        console.log('[BookingController.getServiceRecords] Successfully fetched service records count:', serviceRecords.length);
        res.status(200).json(serviceRecords);
    } catch (err) {
        console.error('[BookingController.getServiceRecords] Error fetching service records:', err);
        return res.status(500).json({ error: 'Error fetching service records', details: err.message });
    }
};

// Create a new service record
exports.createServiceRecord = async (req, res) => {
    const { guestId, amount, paymentMethod, StaffId } = req.body;
    console.log('[BookingController.createServiceRecord] Creating new service record:', { guestId, amount, paymentMethod, StaffId });

    try {
        const serviceData = {
            guestId,
            StaffId,
            amount,
            paymentMethod
        };

        const result = await ServiceRecord.create(serviceData);
        console.log('[BookingController.createServiceRecord] Service record created successfully');
        res.status(201).json(result);
    } catch (err) {
        console.error('[BookingController.createServiceRecord] Error creating service record:', err);
        return res.status(500).json({ error: 'Error creating service record', details: err.message });
    }
};
