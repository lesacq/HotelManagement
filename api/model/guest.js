const { Guest } = require('../entities');
const { Op } = require('sequelize');

const GuestModel = {
    // Method to get the next GuestId
    getNextGuestId: async () => {
        try {
            console.log('[GuestModel.getNextGuestId] Generating next guest ID');
            const lastGuest = await Guest.findOne({
                order: [['GuestId', 'DESC']]
            });
            
            let nextId = 'GUEST0001'; // Default starting ID
            
            if (lastGuest) {
                // Extract numeric part and increment
                const numericPart = parseInt(lastGuest.GuestId.replace('GUEST', ''), 10) + 1;
                nextId = `GUEST${String(numericPart).padStart(4, '0')}`;
                console.log('[GuestModel.getNextGuestId] Found last guest ID:', lastGuest.GuestId, 'Next ID:', nextId);
            } else {
                console.log('[GuestModel.getNextGuestId] No existing guests found, using default ID:', nextId);
            }
            
            return nextId;
        } catch (error) {
            console.error('[GuestModel.getNextGuestId] Error generating next guest ID:', error);
            throw error;
        }
    },

    // Method to get all guests
    getAll: async () => {
        try {
            console.log('[GuestModel.getAll] Fetching all guest records');
            const guests = await Guest.findAll();
            console.log('[GuestModel.getAll] Found', guests.length, 'guest records');
            return guests;
        } catch (error) {
            console.error('[GuestModel.getAll] Error fetching all guests:', error);
            throw error;
        }
    },

    // Method to get guest by ID
    getById: async (guestId) => {
        try {
            console.log('[GuestModel.getById] Looking for guest with ID:', guestId);
            const guest = await Guest.findOne({
                where: { GuestId: guestId }
            });
            
            if (guest) {
                console.log('[GuestModel.getById] Found guest with ID:', guestId);
            } else {
                console.log('[GuestModel.getById] No guest found with ID:', guestId);
            }
            
            return guest;
        } catch (error) {
            console.error('[GuestModel.getById] Error fetching guest by ID:', guestId, error);
            throw error;
        }
    },

    // Method to create a new guest record with auto-generated GuestId
    create: async (guestData) => {
        try {
            console.log('[GuestModel.create] Creating new guest with data:', JSON.stringify(guestData));
            const nextGuestId = await GuestModel.getNextGuestId();
            const { firstName, lastName, gender, email } = guestData;
            
            console.log('[GuestModel.create] Creating guest with ID:', nextGuestId, 'Name:', `${firstName} ${lastName}`);
            
            const newGuest = await Guest.create({
                GuestId: nextGuestId,
                firstName,
                lastName,
                gender,
                email
            });
            
            console.log('[GuestModel.create] Guest created successfully with ID:', nextGuestId);
            
            return {
                GuestId: newGuest.GuestId,
                firstName: newGuest.firstName,
                lastName: newGuest.lastName,
                gender: newGuest.gender,
                email: newGuest.email,
                id: newGuest.id
            };
        } catch (error) {
            console.error('[GuestModel.create] Error creating guest record:', error);
            throw error;
        }
    },

    // Method to update a guest record
    update: async (guestId, updatedData) => {
        try {
            console.log('[GuestModel.update] Updating guest with ID:', guestId, 'Data:', JSON.stringify(updatedData));
            const { firstName, lastName, gender, email } = updatedData;
            
            const result = await Guest.update(
                { firstName, lastName, gender, email },
                { where: { GuestId: guestId } }
            );
            
            console.log('[GuestModel.update] Update result for guest ID:', guestId, 'Rows affected:', result[0]);
            return result;
        } catch (error) {
            console.error('[GuestModel.update] Error updating guest record for ID:', guestId, error);
            throw error;
        }
    },

    // Method to delete a guest record
    delete: async (guestId) => {
        try {
            console.log('[GuestModel.delete] Deleting guest with ID:', guestId);
            const result = await Guest.destroy({
                where: { GuestId: guestId }
            });
            
            console.log('[GuestModel.delete] Delete result for guest ID:', guestId, 'Rows affected:', result);
            return result;
        } catch (error) {
            console.error('[GuestModel.delete] Error deleting guest record for ID:', guestId, error);
            throw error;
        }
    }
};

module.exports = GuestModel;
