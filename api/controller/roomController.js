const Room = require('../model/room');

// Get all rooms
exports.getAllRooms = async (req, res) => {
    console.log('[getAllRooms] Request received to get all rooms');
    try {
        const roomList = await Room.getAll();
        console.log('[getAllRooms] Successfully fetched rooms, count:', roomList.length);
        res.status(200).json(roomList);
    } catch (err) {
        console.error('[getAllRooms] Error fetching rooms:', err);
        return res.status(500).json({ error: err.message });
    }
};

// Get a room by roomNumber
exports.getRoomByNumber = async (req, res) => {
    const { roomNumber } = req.params;
    console.log('[getRoomByNumber] Request received to get room:', roomNumber);
    
    try {
        const room = await Room.getByRoomNumber(roomNumber);
        
        if (!room) {
            console.warn('[getRoomByNumber] Room not found:', roomNumber);
            return res.status(404).json({ message: 'Room not found' });
        }
        
        console.log('[getRoomByNumber] Successfully fetched room:', roomNumber);
        res.status(200).json(room);
    } catch (err) {
        console.error('[getRoomByNumber] Error fetching room:', roomNumber, err);
        return res.status(500).json({ error: err.message });
    }
};

// Add a new room
exports.addRoom = async (req, res) => {
    const roomData = req.body;
    console.log('[addRoom] Incoming request payload:', JSON.stringify(roomData));

    try {
        const result = await Room.create(roomData);
        console.log('[addRoom] Room created successfully:', JSON.stringify(result));
        res.status(201).json({ message: 'Room added successfully', data: result });
    } catch (err) {
        console.error('[addRoom] Error while creating room:', err);
        return res.status(500).json({ error: 'Failed to create room', details: err.message });
    }
};

// Update a room
exports.updateRoom = async (req, res) => {
    const { roomNumber } = req.params;
    const updatedData = req.body;
    console.log('[updateRoom] Request to update room:', roomNumber, 'with data:', JSON.stringify(updatedData));
    
    try {
        const result = await Room.update(roomNumber, updatedData);
        console.log('[updateRoom] Room updated successfully:', roomNumber);
        res.status(200).json({ message: 'Room updated successfully', data: result });
    } catch (err) {
        console.error('[updateRoom] Error updating room:', roomNumber, err);
        return res.status(500).json({ error: err.message });
    }
};

// Delete a room
exports.deleteRoom = async (req, res) => {
    const { roomNumber } = req.params;
    console.log('[deleteRoom] Request to delete room:', roomNumber);
    
    try {
        const result = await Room.delete(roomNumber);
        console.log('[deleteRoom] Room deleted successfully:', roomNumber);
        res.status(200).json({ message: 'Room deleted successfully' });
    } catch (err) {
        console.error('[deleteRoom] Error deleting room:', roomNumber, err);
        return res.status(500).json({ error: err.message });
    }
};
