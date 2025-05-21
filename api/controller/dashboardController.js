const Dashboard = require('../model/dashboard');

// Get booking count
exports.getBookingCount = async (req, res) => {
    try {
        console.log('[DashboardController.getBookingCount] Fetching booking count');
        const bookingCount = await Dashboard.getBookingCount();
        console.log('[DashboardController.getBookingCount] Successfully fetched booking count:', bookingCount);
        res.status(200).json({ bookingCount });
    } catch (err) {
        console.error('[DashboardController.getBookingCount] Error:', err);
        return res.status(500).json({ error: err.message });
    }
};

// Get room counts
exports.getRoomCounts = async (req, res) => {
    try {
        console.log('[DashboardController.getRoomCounts] Fetching room counts');
        const roomCounts = await Dashboard.getRoomCounts();
        console.log('[DashboardController.getRoomCounts] Successfully fetched room counts:', roomCounts);
        res.status(200).json(roomCounts);
    } catch (err) {
        console.error('[DashboardController.getRoomCounts] Error:', err);
        return res.status(500).json({ error: err.message });
    }
};

// Get check-in and check-out counts
exports.getCheckInOutCount = async (req, res) => {
    try {
        console.log('[DashboardController.getCheckInOutCount] Fetching check-in/out counts');
        const checkInOutCounts = await Dashboard.getCheckInOutCount();
        console.log('[DashboardController.getCheckInOutCount] Successfully fetched check-in/out counts:', checkInOutCounts);
        res.status(200).json(checkInOutCounts);
    } catch (err) {
        console.error('[DashboardController.getCheckInOutCount] Error:', err);
        return res.status(500).json({ error: err.message });
    }
};

// Get all dashboard data
exports.getDashboardData = async (req, res) => {
    try {
        console.log('[DashboardController.getDashboardData] Fetching all dashboard data');
        
        const [bookingCount, roomCounts, checkInOutCounts] = await Promise.all([
            Dashboard.getBookingCount(),
            Dashboard.getRoomCounts(),
            Dashboard.getCheckInOutCount()
        ]);
        
        const responseData = {
            bookingCount,
            roomCounts,
            checkInOutCounts
        };
        
        console.log('[DashboardController.getDashboardData] Successfully fetched all dashboard data');
        res.status(200).json(responseData);
    } catch (err) {
        console.error('[DashboardController.getDashboardData] Error:', err);
        return res.status(500).json({ error: err.message });
    }
};
