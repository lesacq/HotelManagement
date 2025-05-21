import React, { useState, useEffect } from 'react';
import { Button, Modal } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import toast from 'react-hot-toast';
import strings from '../strings';
import useApi from '../hooks/useApi';

interface Guest {
  id: number;
  GuestId: string;
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
}

const Guests: React.FC = () => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [openAddModal, setOpenAddModal] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [newGuest, setNewGuest] = useState<Omit<Guest, 'GuestId' | 'id'>>({
    firstName: '',
    lastName: '',
    gender: 'male',
    email: '',
  });
  
  // Use our custom hook for API calls
  const [guestState, guestApi] = useApi<Guest[]>();
  const { data, loading, error } = guestState;

  useEffect(() => {
    fetchGuests();
  }, []);
  
  useEffect(() => {
    if (data) {
      setGuests(Array.isArray(data) ? data : []);
      console.log("Guests loaded:", data);
    }
    
    if (error) {
      toast.error(`Failed to fetch guests: ${error}`);
    }
  }, [data, error]);

  const fetchGuests = async () => {
    console.log('Fetching guests...');
    await guestApi.get(`${strings.url}/api/guest`);
  };

  const handleAddGuest = async () => {
    console.log('Adding new guest:', newGuest);
    
    const result = await guestApi.post(`${strings.url}/api/guest`, newGuest);
    
    if (result && !error) {
      toast.success('Guest added successfully!');
      setOpenAddModal(false);
      setNewGuest({ firstName: '', lastName: '', gender: 'male', email: '' }); // Reset form
      fetchGuests();
    }
  };

  const handleEditGuest = async () => {
    if (selectedGuest) {
      console.log('Updating guest:', selectedGuest);
      
      const result = await guestApi.put(`${strings.url}/api/guests/${selectedGuest.GuestId}`, selectedGuest);
      
      if (result && !error) {
        toast.success('Guest updated successfully!');
        setOpenEditModal(false);
        fetchGuests();
      }
    }
  };

  const handleDeleteGuest = async () => {
    if (selectedGuest) {
      console.log('Deleting guest:', selectedGuest.GuestId);
      
      const result = await guestApi.deleteReq(`${strings.url}/api/guests/${selectedGuest.GuestId}`);
      
      if (result && !error) {
        toast.success('Guest deleted successfully!');
        setOpenDeleteModal(false);
        fetchGuests();
      }
    }
  };

  return (
      <div className='w-full h-full flex flex-col'>
        <div className="flex flex-col">
          <small>Guest Management</small>
          <h1>Group 3 Hotel</h1>
        </div>
        <div className='flex flex-row w-full h-[90%] justify-between items-start'>
          <div className='bg-white w-[50%] h-full p-1 m-1'>
            <h1 className='font-bold text-lg'>All Guests</h1>
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : guests.length === 0 ? (
                <p className="text-gray-500 text-center my-8">No guests found. Add a new guest to get started.</p>
            ) : (
                <div className='overflow-x-auto'>
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                    <tr>
                      <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest ID</th>
                      <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                      <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {guests.map((guest) => (
                        <tr key={guest.GuestId}>
                          <td className="px-2 py-4 whitespace-nowrap">{guest.GuestId}</td>
                          <td className="px-2 py-4 whitespace-nowrap">{`${guest.firstName} ${guest.lastName}`}</td>
                          <td className="px-2 py-4 whitespace-nowrap">{guest.gender}</td>
                          <td className="px-2 py-4 whitespace-nowrap">{guest.email}</td>
                          <td className="px-2 py-4 whitespace-nowrap">
                            <Button onClick={() => {
                              setSelectedGuest(guest);
                              setOpenEditModal(true);
                            }}><Edit /></Button>
                            <Button onClick={() => {
                              setSelectedGuest(guest);
                              setOpenDeleteModal(true);
                            }}><Delete className={"text-red-600"} /></Button>
                          </td>
                        </tr>
                    ))}
                    </tbody>
                  </table>
                </div>
            )}
          </div>
          <div className='bg-white w-[48%] h-full p-3'>
            <h1 className='font-bold text-lg'>Add New Guest</h1>

                <form className="flex flex-col" onSubmit={(e) => {
                  e.preventDefault();
                  handleAddGuest();
                }}>
                  <label className="mb-1">First Name</label>
                  <input
                      type="text"
                      placeholder="Enter first name"
                      className="border p-2 mb-3 rounded"
                      value={newGuest.firstName}
                      onChange={(e) => setNewGuest({ ...newGuest, firstName: e.target.value })}
                      required
                  />
                  <label className="mb-1">Last Name</label>
                  <input
                      type="text"
                      placeholder="Enter last name"
                      className="border p-2 mb-3 rounded"
                      value={newGuest.lastName}
                      onChange={(e) => setNewGuest({ ...newGuest, lastName: e.target.value })}
                      required
                  />
                  <label className="mb-1">Gender</label>
                  <select
                      className="border p-2 mb-3 rounded"
                      value={newGuest.gender}
                      onChange={(e) => setNewGuest({ ...newGuest, gender: e.target.value })}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                  <label className="mb-1">Email</label>
                  <input
                      type="email"
                      placeholder="Enter email"
                      className="border p-2 mb-3 rounded"
                      value={newGuest.email}
                      onChange={(e) => setNewGuest({ ...newGuest, email: e.target.value })}
                      required
                  />
                  <button 
                      type="submit" 
                      className="bg-green-500 p-2 text-white"
                      disabled={loading}
                  >
                      {loading ? 'Adding...' : 'Add Guest'}
                  </button>
                </form>

          </div>
        </div>

        {/* Edit Modal */}
        <Modal open={openEditModal} className={"flex items-center justify-center"} onClose={() => setOpenEditModal(false)}>
          <div className='p-4 bg-white rounded w-[40%]'>
            <h2 className={"font-bold text-center text-2xl"}>Edit Guest</h2>
            {selectedGuest && (
                <form className="flex flex-col" onSubmit={(e) => {
                  e.preventDefault();
                  handleEditGuest();
                }}>
                  <label className="mb-1">First Name</label>
                  <input
                      type="text"
                      placeholder="Enter first name"
                      className="border p-2 mb-3 rounded"
                      value={selectedGuest.firstName}
                      onChange={(e) => setSelectedGuest({ ...selectedGuest, firstName: e.target.value })}
                      required
                  />
                  <label className="mb-1">Last Name</label>
                  <input
                      type="text"
                      placeholder="Enter last name"
                      className="border p-2 mb-3 rounded"
                      value={selectedGuest.lastName}
                      onChange={(e) => setSelectedGuest({ ...selectedGuest, lastName: e.target.value })}
                      required
                  />
                  <label className="mb-1">Gender</label>
                  <select
                      className="border p-2 mb-3 rounded"
                      value={selectedGuest.gender}
                      onChange={(e) => setSelectedGuest({ ...selectedGuest, gender: e.target.value })}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                  <label className="mb-1">Email</label>
                  <input
                      type="email"
                      placeholder="Enter email"
                      className="border p-2 mb-3 rounded"
                      value={selectedGuest.email}
                      onChange={(e) => setSelectedGuest({ ...selectedGuest, email: e.target.value })}
                      required
                  />
                  <Button 
                      onClick={handleEditGuest} 
                      variant="contained" 
                      style={{ backgroundColor: 'green', color: 'white' }}
                      disabled={loading}
                  >
                      {loading ? 'Updating...' : 'Update Guest'}
                  </Button>
                </form>
            )}
          </div>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal className={"flex items-center justify-center"} open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
          <div className='p-4 bg-white rounded w-[40%]'>
            <h2 className={"font-bold text-2xl"}>Confirm Deletion</h2>
            <p>Are you sure you want to delete {selectedGuest?.firstName} {selectedGuest?.lastName}?</p>
            <Button 
                className={"ml-4"} 
                onClick={handleDeleteGuest} 
                variant="contained" 
                color="secondary"
                disabled={loading}
            >
                {loading ? 'Deleting...' : 'Delete'}
            </Button>
            <Button onClick={() => setOpenDeleteModal(false)} variant="outlined">Cancel</Button>
          </div>
        </Modal>
      </div>
  );
};

export default Guests;
