import React, { useEffect, useState } from 'react';
import {toast} from 'react-hot-toast';
import strings from '../strings';
import useApi from '../hooks/useApi';

interface Room {
    id: number;
    roomNumber: string;
    type: string;
    description: string;
    status: 'available' | 'occupied';
}

const RoomComponent: React.FC = () => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [newRoom, setNewRoom] = useState<{ type: string; description: string; status: 'available' | 'occupied' }>({
        type: 'Regular',
        description: '',
        status: 'available',
    });
    const [editRoom, setEditRoom] = useState<Room | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Use our custom hook for API calls
    const [state, api] = useApi<Room[]>();
    const { data, loading, error } = state;

    useEffect(() => {
        fetchRooms();
    }, []);

    useEffect(() => {
        if (data) {
            setRooms(data);
        }
        if (error) {
            toast.error(`Failed to fetch rooms: ${error}`);
        }
    }, [data, error]);

    const fetchRooms = async () => {
        console.log('Fetching rooms...');
        await api.get(`${strings.url}/api/rooms`);
    };

    const handleAddRoom = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Adding new room:', newRoom);
        
        const result = await api.post(`${strings.url}/api/rooms`, newRoom);
        
        if (result && !error) {
            toast.success('Room created successfully!');
            setNewRoom({ type: 'Regular', description: '', status: 'available' });
            fetchRooms();
        }
    };

    const handleEditRoom = (room: Room) => {
        setEditRoom(room);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setEditRoom(null);
    };

    const handleUpdateRoom = async () => {
        if (editRoom) {
            console.log('Updating room:', editRoom);
            
            const result = await api.put(`${strings.url}/api/rooms/${editRoom.roomNumber}`, editRoom);
            
            if (result && !error) {
                toast.success('Room updated successfully!');
                fetchRooms();
                handleModalClose();
            }
        }
    };

    return (
        <div className='w-full h-full flex flex-col'>
            <div className="flex flex-col">
                <small>Rooms</small>
                <h1>Group 3 Hotel</h1>
            </div>
            <div className='flex flex-row w-full h-[90%] py-2 justify-between items-start'>
                <div className='bg-white w-[48%] h-full p-3 overflow-auto'>
                    <h1 className='font-bold text-lg'>All Rooms</h1>
                    {loading ? (
                        <div className="flex justify-center items-center h-32">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                        </div>
                    ) : rooms.length > 0 ? (
                        <ul className="grid grid-cols-5 gap-4">
                            {rooms.map(room => (
                                <li key={room.id}
                                    className={`flex justify-between items-center p-2 rounded text-white ${room.status === 'available' ? 'bg-green-500' : 'bg-red-500'} mb-2`}>
                                    <span>{room.roomNumber}</span>
                                    <button onClick={() => handleEditRoom(room)} className="">
                                        ✏️
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 text-center my-8">No rooms available. Add a new room to get started.</p>
                    )}
                </div>
                <div className='bg-white w-[48%] h-[50%] p-3'>
                    <h1 className='font-bold text-lg'>Add New Room</h1>
                    <form onSubmit={handleAddRoom}>
                        <select
                            value={newRoom.type}
                            onChange={(e) => setNewRoom({...newRoom, type: e.target.value})}
                            required
                            className="border rounded p-2 mb-2 w-full"
                        >
                            <option value="Regular">Regular</option>
                            <option value="Deluxe">Deluxe</option>
                        </select>
                        <textarea
                            placeholder="Description"
                            value={newRoom.description}
                            onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })}
                            required
                            className="border rounded p-2 mb-2 w-full"
                        />
                        <select
                            value={newRoom.status}
                            onChange={(e) => setNewRoom({ ...newRoom, status: e.target.value as 'available' | 'occupied' })}
                            className="border rounded p-2 mb-2 w-full"
                        >
                            <option value="available">Available</option>
                            <option value="occupied">Occupied</option>
                        </select>
                        <button 
                            type="submit" 
                            className="bg-green-500 text-white rounded p-2 w-full"
                            disabled={loading}
                        >
                            {loading ? 'Adding...' : 'Add Room'}
                        </button>
                    </form>
                </div>
            </div>

            {/* Modal for Editing Room */}
            {isModalOpen && editRoom && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-5 rounded shadow-lg">
                        <h2 className="font-bold text-lg">Edit Room</h2>
                        <select
                            value={editRoom.type}
                            onChange={(e) => setEditRoom({ ...editRoom, type: e.target.value })}
                            className="border rounded p-2 mb-2 w-full"
                        >
                            <option value="Regular">Regular</option>
                            <option value="Deluxe">Deluxe</option>
                        </select>
                        <textarea
                            value={editRoom.description}
                            onChange={(e) => setEditRoom({ ...editRoom, description: e.target.value })}
                            className="border rounded p-2 mb-2 w-full"
                        />
                        <select
                            value={editRoom.status}
                            onChange={(e) => setEditRoom({ ...editRoom, status: e.target.value as 'available' | 'occupied' })}
                            className="border rounded p-2 mb-2 w-full"
                        >
                            <option value="available">Available</option>
                            <option value="occupied">Occupied</option>
                        </select>
                        <button 
                            onClick={handleUpdateRoom} 
                            className="bg-blue-500 text-white rounded p-2 w-full"
                            disabled={loading}
                        >
                            {loading ? 'Updating...' : 'Update Room'}
                        </button>
                        <button onClick={handleModalClose} className="mt-2 text-red-500">Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoomComponent;
