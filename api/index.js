const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const staffRoutes = require('./routes/staffRoutes');
const guestRoutes = require('./routes/guestRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const roomRoutes = require('./routes/roomRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

// Import database connection and entities
require('./entities'); // This initializes the database and models

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
    const start = Date.now();
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - Request received`);
    
    if (Object.keys(req.body).length > 0) {
        // Sanitize body for logging (remove sensitive fields)
        const sanitizedBody = { ...req.body };
        if (sanitizedBody.password) sanitizedBody.password = '********';
        console.log(`[${new Date().toISOString()}] Request body:`, JSON.stringify(sanitizedBody));
    }
    
    // Capture original response methods to intercept
    const originalSend = res.send;
    const originalJson = res.json;
    
    // Override response methods to log response data
    res.send = function(body) {
        const responseTime = Date.now() - start;
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - Response status: ${res.statusCode} - Time: ${responseTime}ms`);
        return originalSend.call(this, body);
    };
    
    res.json = function(body) {
        const responseTime = Date.now() - start;
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - Response status: ${res.statusCode} - Time: ${responseTime}ms`);
        if (body) {
            const sanitizedResponse = { ...body };
            if (body.staff && body.staff.password) sanitizedResponse.staff.password = '********';
            console.log(`[${new Date().toISOString()}] Response body:`, JSON.stringify(sanitizedResponse).substring(0, 200) + (JSON.stringify(sanitizedResponse).length > 200 ? '...' : ''));
        }
        return originalJson.call(this, body);
    };
    
    next();
});

// Define routes
app.use('/api/staff', staffRoutes);
app.use('/api/guest', guestRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/dashboards', dashboardRoutes);

// Define the port
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
    console.log(`[${new Date().toISOString()}] Server running on http://localhost:${PORT}`);
});
