const Staff = require('../model/staff');

// Get all staff
exports.getAllStaff = async (req, res) => {
    console.log('[getAllStaff] Request received to get all staff');
    
    try {
        const staffList = await Staff.getAll();
        console.log('[getAllStaff] Successfully fetched staff list, count:', staffList.length);
        res.status(200).json(staffList);
    } catch (err) {
        console.error('[getAllStaff] Error fetching staff:', err);
        return res.status(500).json({ error: err.message });
    }
};

// Get staff by ID
exports.getStaffById = async (req, res) => {
    const { staffId } = req.params;
    console.log('[getStaffById] Request received to get staff:', staffId);
    
    try {
        const staff = await Staff.getById(staffId);
        
        if (!staff) {
            console.warn('[getStaffById] Staff not found:', staffId);
            return res.status(404).json({ message: 'Staff not found' });
        }
        
        console.log('[getStaffById] Successfully fetched staff:', staffId);
        res.status(200).json(staff);
    } catch (err) {
        console.error('[getStaffById] Error fetching staff:', staffId, err);
        return res.status(500).json({ error: err.message });
    }
};

exports.addStaff = async (req, res) => {
    const staffData = req.body;
    console.log('[addStaff] Incoming request payload:', JSON.stringify(staffData));

    // Validate required fields
    if (!staffData.name || !staffData.email || !staffData.password) {
        console.error('[addStaff] Missing required fields');
        return res.status(400).json({ error: 'Missing required fields: name, email, and password are required' });
    }

    try {
        const result = await Staff.create(staffData);
        console.log('[addStaff] Staff created successfully:', JSON.stringify(result));
        res.status(201).json({ message: 'Staff added successfully', data: result });
    } catch (err) {
        console.error('[addStaff] Error while creating staff:', err);
        return res.status(500).json({ error: 'Failed to create staff', details: err.message });
    }
};

// Update a staff
exports.updateStaff = async (req, res) => {
    const { staffId } = req.params;
    const updatedData = req.body;
    console.log('[updateStaff] Request to update staff:', staffId, 'with data:', JSON.stringify(updatedData));
    
    try {
        const result = await Staff.update(staffId, updatedData);
        console.log('[updateStaff] Staff updated successfully:', staffId);
        res.status(200).json({ message: 'Staff updated successfully', data: result });
    } catch (err) {
        console.error('[updateStaff] Error updating staff:', staffId, err);
        return res.status(500).json({ error: err.message });
    }
};

// Delete a staff
exports.deleteStaff = async (req, res) => {
    const { staffId } = req.params;
    console.log('[deleteStaff] Request to delete staff:', staffId);
    
    try {
        const result = await Staff.delete(staffId);
        console.log('[deleteStaff] Staff deleted successfully:', staffId);
        res.status(200).json({ message: 'Staff deleted successfully' });
    } catch (err) {
        console.error('[deleteStaff] Error deleting staff:', staffId, err);
        return res.status(500).json({ error: err.message });
    }
};

// Staff login controller
exports.staffLogin = async (req, res) => {
    console.log('[staffLogin] Login attempt received');
    const { StaffId, password } = req.body;
    console.log('[staffLogin] Login attempt for StaffId:', StaffId);

    if (!StaffId || !password) {
        console.error('[staffLogin] Missing credentials - StaffId:', !!StaffId, 'Password provided:', !!password);
        return res.status(400).json({ error: 'StaffId and password are required.' });
    }

    // Authenticate the staff
    console.log('[staffLogin] Attempting authentication for StaffId:', StaffId);
    
    try {
        const staff = await Staff.authenticate(StaffId, password);
        
        if (!staff) {
            console.warn('[staffLogin] Authentication failed for StaffId:', StaffId, '- Invalid credentials');
            return res.status(401).json({ error: 'Invalid StaffId or password.' });
        }

        console.log('[staffLogin] Authentication successful for StaffId:', StaffId);
        // Send staff details to the frontend
        res.status(200).json({
            message: 'Login successful.',
            staff
        });
    } catch (err) {
        console.error('[staffLogin] Authentication error for StaffId:', StaffId, 'Error:', err);
        return res.status(500).json({ error: 'An error occurred during login.', details: err.message });
    }
};