const bcrypt = require('bcrypt');
const { Staff } = require('../entities');
const { Op } = require('sequelize');

const StaffModel = {
    // Method to get the next StaffId
    getNextStaffId: async () => {
        try {
            console.log('[StaffModel.getNextStaffId] Generating next staff ID');
            const lastStaff = await Staff.findOne({
                order: [['StaffId', 'DESC']]
            });
            
            let nextId = 'STAFF0001'; // Default starting ID
            
            if (lastStaff) {
                // Extract numeric part and increment
                const numericPart = parseInt(lastStaff.StaffId.replace('STAFF', ''), 10) + 1;
                nextId = `STAFF${String(numericPart).padStart(4, '0')}`;
                console.log('[StaffModel.getNextStaffId] Found last staff ID:', lastStaff.StaffId, 'Next ID:', nextId);
            } else {
                console.log('[StaffModel.getNextStaffId] No existing staff found, using default ID:', nextId);
            }
            
            return nextId;
        } catch (error) {
            console.error('[StaffModel.getNextStaffId] Error generating next staff ID:', error);
            throw error;
        }
    },
    
    // Method to get all staff
    getAll: async () => {
        try {
            console.log('[StaffModel.getAll] Fetching all staff records');
            const staff = await Staff.findAll();
            console.log('[StaffModel.getAll] Found', staff.length, 'staff records');
            return staff;
        } catch (error) {
            console.error('[StaffModel.getAll] Error fetching all staff:', error);
            throw error;
        }
    },

    // Method to get staff by ID
    getById: async (staffId) => {
        try {
            console.log('[StaffModel.getById] Looking for staff with ID:', staffId);
            const staff = await Staff.findOne({
                where: { StaffId: staffId }
            });
            
            if (staff) {
                console.log('[StaffModel.getById] Found staff with ID:', staffId);
            } else {
                console.log('[StaffModel.getById] No staff found with ID:', staffId);
            }
            
            return staff;
        } catch (error) {
            console.error('[StaffModel.getById] Error fetching staff by ID:', staffId, error);
            throw error;
        }
    },

    // Method to create a new staff record with auto-generated StaffId
    create: async (staffData) => {
        try {
            console.log('[StaffModel.create] Creating new staff with data:', JSON.stringify(staffData));
            const nextStaffId = await StaffModel.getNextStaffId();
            const { name, gender, position, role, email, password } = staffData;
            
            // Log sanitized data (without password)
            console.log('[StaffModel.create] Creating staff record with ID:', nextStaffId, 'Name:', name, 'Email:', email);
            
            const newStaff = await Staff.create({
                StaffId: nextStaffId,
                name,
                gender,
                position,
                role,
                email,
                password
            });
            
            console.log('[StaffModel.create] Staff record created successfully with ID:', nextStaffId);
            
            return {
                StaffId: newStaff.StaffId,
                name: newStaff.name,
                gender: newStaff.gender,
                position: newStaff.position,
                role: newStaff.role,
                email: newStaff.email,
                id: newStaff.id
            };
        } catch (error) {
            console.error('[StaffModel.create] Error creating staff record:', error);
            throw error;
        }
    },

    // Method to update a staff record
    update: async (staffId, updatedData) => {
        try {
            console.log('[StaffModel.update] Updating staff with ID:', staffId, 'Data:', JSON.stringify(updatedData));
            const { name, gender, position, role, email, password } = updatedData;
            
            const result = await Staff.update(
                { name, gender, position, role, email, password },
                { where: { StaffId: staffId } }
            );
            
            console.log('[StaffModel.update] Update result for staff ID:', staffId, 'Rows affected:', result[0]);
            return result;
        } catch (error) {
            console.error('[StaffModel.update] Error updating staff record for ID:', staffId, error);
            throw error;
        }
    },

    // Method to delete a staff record
    delete: async (staffId) => {
        try {
            console.log('[StaffModel.delete] Deleting staff with ID:', staffId);
            const result = await Staff.destroy({
                where: { StaffId: staffId }
            });
            
            console.log('[StaffModel.delete] Delete result for staff ID:', staffId, 'Rows affected:', result);
            return result;
        } catch (error) {
            console.error('[StaffModel.delete] Error deleting staff record for ID:', staffId, error);
            throw error;
        }
    },

    // Authenticate staff by StaffId and password
    authenticate: async (StaffId, password) => {
        try {
            console.log('[StaffModel.authenticate] Authenticating staff with ID:', StaffId);
            
            // Find the staff record
            const staff = await Staff.findOne({
                where: { StaffId }
            });
            
            if (!staff) {
                console.warn('[StaffModel.authenticate] No staff found with ID:', StaffId);
                return null; // No staff found
            }
            
            console.log('[StaffModel.authenticate] Staff found:', StaffId, 'Name:', staff.name);
            
            // Compare passwords
            console.log('[StaffModel.authenticate] Comparing passwords for staff ID:', StaffId);
            const isMatch = await bcrypt.compare(password, staff.password);
            
            if (!isMatch) {
                console.warn('[StaffModel.authenticate] Password mismatch for staff ID:', StaffId);
                return null; // Invalid password
            }
            
            console.log('[StaffModel.authenticate] Authentication successful for staff ID:', StaffId);
            
            // Password matches, return staff details
            return {
                StaffId: staff.StaffId,
                name: staff.name,
                position: staff.position,
                role: staff.role,
                email: staff.email
            };
        } catch (error) {
            console.error('[StaffModel.authenticate] Error authenticating staff ID:', StaffId, error);
            throw error;
        }
    }
};

module.exports = StaffModel;
