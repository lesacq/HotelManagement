const { Room } = require('../entities');
const { Op } = require('sequelize');

const RoomModel = {
    // Method to get the next roomNumber
    getNextRoomNumber: async () => {
        try {
            console.log('[RoomModel.getNextRoomNumber] Generating next room number');
            const lastRoom = await Room.findOne({
                order: [['roomNumber', 'DESC']]
            });
            
            let nextRoomNumber = 'ROOM001'; // Default starting number
            
            if (lastRoom) {
                // Extract numeric part and increment
                const numericPart = parseInt(lastRoom.roomNumber.replace('ROOM', ''), 10) + 1;
                nextRoomNumber = `ROOM${String(numericPart).padStart(3, '0')}`;
                console.log('[RoomModel.getNextRoomNumber] Found last room number:', lastRoom.roomNumber, 'Next number:', nextRoomNumber);
            } else {
                console.log('[RoomModel.getNextRoomNumber] No existing rooms found, using default number:', nextRoomNumber);
            }
            
            return nextRoomNumber;
        } catch (error) {
            console.error('[RoomModel.getNextRoomNumber] Error generating next room number:', error);
            throw error;
        }
    },

    // Method to get all rooms
    getAll: async () => {
        try {
            console.log('[RoomModel.getAll] Fetching all room records');
            const rooms = await Room.findAll();
            console.log('[RoomModel.getAll] Found', rooms.length, 'room records');
            return rooms;
        } catch (error) {
            console.error('[RoomModel.getAll] Error fetching all rooms:', error);
            throw error;
        }
    },

    // Method to get a room by roomNumber
    getByRoomNumber: async (roomNumber) => {
        try {
            console.log('[RoomModel.getByRoomNumber] Looking for room with number:', roomNumber);
            const room = await Room.findOne({
                where: { roomNumber }
            });
            
            if (room) {
                console.log('[RoomModel.getByRoomNumber] Found room with number:', roomNumber);
            } else {
                console.log('[RoomModel.getByRoomNumber] No room found with number:', roomNumber);
            }
            
            return room;
        } catch (error) {
            console.error('[RoomModel.getByRoomNumber] Error fetching room by number:', roomNumber, error);
            throw error;
        }
    },

    // Method to create a new room record with auto-generated roomNumber
    create: async (roomData) => {
        try {
            console.log('[RoomModel.create] Creating new room with data:', JSON.stringify(roomData));
            const nextRoomNumber = await RoomModel.getNextRoomNumber();
            const { type, description, status } = roomData;
            
            console.log('[RoomModel.create] Creating room with number:', nextRoomNumber, 'Type:', type);
            
            const newRoom = await Room.create({
                roomNumber: nextRoomNumber,
                type,
                description,
                status: status || 'available' // Default to available if not specified
            });
            
            console.log('[RoomModel.create] Room created successfully with number:', nextRoomNumber);
            
            return {
                roomNumber: newRoom.roomNumber,
                type: newRoom.type,
                description: newRoom.description,
                status: newRoom.status,
                id: newRoom.id
            };
        } catch (error) {
            console.error('[RoomModel.create] Error creating room record:', error);
            throw error;
        }
    },

    // Method to update a room record
    update: async (roomNumber, updatedData) => {
        try {
            console.log('[RoomModel.update] Updating room with number:', roomNumber, 'Data:', JSON.stringify(updatedData));
            const { type, description, status } = updatedData;
            
            const result = await Room.update(
                { type, description, status },
                { where: { roomNumber } }
            );
            
            console.log('[RoomModel.update] Update result for room number:', roomNumber, 'Rows affected:', result[0]);
            return result;
        } catch (error) {
            console.error('[RoomModel.update] Error updating room record for number:', roomNumber, error);
            throw error;
        }
    },

    // Method to delete a room record
    delete: async (roomNumber) => {
        try {
            console.log('[RoomModel.delete] Deleting room with number:', roomNumber);
            const result = await Room.destroy({
                where: { roomNumber }
            });
            
            console.log('[RoomModel.delete] Delete result for room number:', roomNumber, 'Rows affected:', result);
            return result;
        } catch (error) {
            console.error('[RoomModel.delete] Error deleting room record for number:', roomNumber, error);
            throw error;
        }
    }
};

module.exports = RoomModel;
