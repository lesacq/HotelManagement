const { Booking, Room } = require('../entities');
const { sequelize } = require('../entities');
const { Op } = require('sequelize');

const DashboardModel = {
    // Method to get the count of all bookings
    getBookingCount: async () => {
        try {
            console.log('[DashboardModel.getBookingCount] Getting total booking count');
            const bookingCount = await Booking.count();
            console.log('[DashboardModel.getBookingCount] Total bookings:', bookingCount);
            return bookingCount;
        } catch (error) {
            console.error('[DashboardModel.getBookingCount] Error:', error);
            throw error;
        }
    },

    // Method to get counts of available, unavailable, and total rooms
    getRoomCounts: async () => {
        try {
            console.log('[DashboardModel.getRoomCounts] Getting room counts');
            
            // Get total rooms count
            const totalRooms = await Room.count();
            console.log('[DashboardModel.getRoomCounts] Total rooms:', totalRooms);
            
            // Get available rooms count
            const availableRooms = await Room.count({
                where: { status: 'available' }
            });
            console.log('[DashboardModel.getRoomCounts] Available rooms:', availableRooms);
            
            // Get occupied/unavailable rooms count
            const unavailableRooms = await Room.count({
                where: { status: 'occupied' }
            });
            console.log('[DashboardModel.getRoomCounts] Occupied rooms:', unavailableRooms);
            
            return {
                totalRooms,
                availableRooms,
                unavailableRooms
            };
        } catch (error) {
            console.error('[DashboardModel.getRoomCounts] Error:', error);
            throw error;
        }
    },

    // Method to get counts of check-ins and check-outs
    getCheckInOutCount: async () => {
        try {
            console.log('[DashboardModel.getCheckInOutCount] Getting check-in/out counts');
            
            // Get check-in count
            const checkInCount = await Booking.count({
                where: { Status: 'checked_in' }
            });
            console.log('[DashboardModel.getCheckInOutCount] Check-in count:', checkInCount);
            
            // Get check-out count
            const checkOutCount = await Booking.count({
                where: { Status: 'checked_out' }
            });
            console.log('[DashboardModel.getCheckInOutCount] Check-out count:', checkOutCount);
            
            return {
                checkInCount,
                checkOutCount
            };
        } catch (error) {
            console.error('[DashboardModel.getCheckInOutCount] Error:', error);
            throw error;
        }
    },
};

module.exports = DashboardModel;
