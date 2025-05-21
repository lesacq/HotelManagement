const Guest = require('../model/guest');

// Get all guests
exports.getAllGuests = async (req, res) => {
    try {
        console.log('[GuestController.getAllGuests] Fetching all guests');
        const guestList = await Guest.getAll();
        console.log('[GuestController.getAllGuests] Successfully fetched guests, count:', guestList.length);
        res.status(200).json(guestList);
    } catch (err) {
        console.error('[GuestController.getAllGuests] Error:', err);
        return res.status(500).json({ error: err.message });
    }
};

// Get guest by ID
exports.getGuestById = async (req, res) => {
    const { guestId } = req.params;
    try {
        console.log('[GuestController.getGuestById] Fetching guest with ID:', guestId);
        const guest = await Guest.getById(guestId);
        
        if (!guest) {
            console.warn('[GuestController.getGuestById] Guest not found:', guestId);
            return res.status(404).json({ message: 'Guest not found' });
        }
        
        console.log('[GuestController.getGuestById] Successfully fetched guest:', guestId);
        res.status(200).json(guest);
    } catch (err) {
        console.error('[GuestController.getGuestById] Error fetching guest:', guestId, err);
        return res.status(500).json({ error: err.message });
    }
};

// Add a new guest
exports.addGuest = async (req, res) => {
    const guestData = req.body;
    console.log('[GuestController.addGuest] Incoming request payload:', guestData);

    try {
        const result = await Guest.create(guestData);
        console.log('[GuestController.addGuest] Guest created successfully:', result);
        res.status(201).json({ message: 'Guest added successfully', data: result });
    } catch (err) {
        console.error('[GuestController.addGuest] Error while creating guest:', err);
        return res.status(500).json({ error: 'Failed to create guest', details: err.message });
    }
};

// Update a guest
exports.updateGuest = async (req, res) => {
    const { guestId } = req.params;
    const updatedData = req.body;
    
    try {
        console.log('[GuestController.updateGuest] Updating guest:', guestId, 'with data:', updatedData);
        const result = await Guest.update(guestId, updatedData);
        console.log('[GuestController.updateGuest] Guest updated successfully:', guestId);
        res.status(200).json({ message: 'Guest updated successfully', data: result });
    } catch (err) {
        console.error('[GuestController.updateGuest] Error updating guest:', guestId, err);
        return res.status(500).json({ error: err.message });
    }
};

// Delete a guest
exports.deleteGuest = async (req, res) => {
    const { guestId } = req.params;
    
    try {
        console.log('[GuestController.deleteGuest] Deleting guest:', guestId);
        const result = await Guest.delete(guestId);
        console.log('[GuestController.deleteGuest] Guest deleted successfully:', guestId);
        res.status(200).json({ message: 'Guest deleted successfully' });
    } catch (err) {
        console.error('[GuestController.deleteGuest] Error deleting guest:', guestId, err);
        return res.status(500).json({ error: err.message });
    }
};
