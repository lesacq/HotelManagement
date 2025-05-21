import React, { useState, useEffect } from 'react';
import { Button, Modal } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import axios from 'axios';
import toast from 'react-hot-toast'
import strings from '../strings';

interface StaffMember {
    id: number;
    name: string;
    gender: string;
    position: string;
    email: string;
    role: string;
    StaffId?: string; // Optional for frontend
    password?: string; // Optional for frontend
}

const Staff: React.FC = () => {
    const [staff, setStaff] = useState<StaffMember[]>([]);
    const [openAddModal, setOpenAddModal] = useState<boolean>(false);
    const [openEditModal, setOpenEditModal] = useState<boolean>(false);
    const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
    const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
    const [newStaff, setNewStaff] = useState<Omit<StaffMember, 'id' | 'StaffId'>>({
        name: '',
        gender: 'male',
        position: '',
        email: '',
        role: 'regular',
        password: '', // Added password field
    });

    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        try {
            const response = await axios.get(`${strings.url}/api/staff`);
            console.log(response);
            setStaff(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("Error fetching staff:", error);
            setStaff([]);
        }
    };

    const handleAddStaff = async () => {
        console.log('Form data to be sent:', newStaff); // Log the form data
        try {
            const response = await axios.post(`${strings.url}/api/staff`, newStaff);
            console.log(response,'adding staff');
            toast.success('Booking created successfully!');
            setOpenAddModal(false);
            setNewStaff({ name: '', gender: 'male', position: '', email: '', role: 'regular', password: '' }); // Reset form
            fetchStaff();
        } catch (error) {
            console.error('Error adding staff:', error); // Log any errors from the API
        }
    };

    const handleEditStaff = async () => {
        if (selectedStaff) {
            console.log('Editing staff:', selectedStaff); // Log the staff being edited
            await axios.put(`${strings.url}/api/staff/${selectedStaff.StaffId}`, selectedStaff);
            setOpenEditModal(false);
            fetchStaff();
        }
    };

    const handleDeleteStaff = async () => {
        if (selectedStaff) {
            await axios.delete(`${strings.url}/api/staff/${selectedStaff.StaffId}`);
            setOpenDeleteModal(false);
            fetchStaff();
        }
    };

    return (
        <div className='w-full h-full flex flex-col'>
            <div className="flex flex-col">
                <small>Staff Management</small>
                <h1>Group 3 Hotel</h1>
            </div>
            <div className='flex flex-row w-full h-[90%]  justify-between items-start'>
                <div className='bg-white w-[50%]h-full p-1 m-1'>
                    <h1 className='font-bold text-lg'>All Staff</h1>
                    {staff.length === 0 ? (
                        <p>No staff members found.</p>
                    ) : (
                        <div className='overflow-x-auto'>
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                <tr>
                                    <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                                    <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {staff.map((member) => (
                                    <tr key={member.id}>
                                        <td className="px-2 py-4 whitespace-nowrap">{member.name}</td>
                                        <td className="px-2 py-4 whitespace-nowrap">{member.position}</td>
                                        <td className="px-2 py-4 whitespace-nowrap">{member.email}</td>
                                        <td className="px-2 py-4 whitespace-nowrap">
                                            <Button onClick={() => {
                                                setSelectedStaff(member);
                                                setOpenEditModal(true);
                                            }}><Edit/></Button>
                                            <Button onClick={() => {
                                                setSelectedStaff(member);
                                                setOpenDeleteModal(true);
                                            }}><Delete className={"text-red-600"}/></Button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
                <div className='bg-white w-[48%] h-full p-3'>
                    <h1 className='font-bold text-lg'>Add New Staff</h1>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        handleAddStaff();
                    }} className="flex flex-col">
                        <label className="mb-1">Name</label>
                        <input
                            type="text"
                            placeholder="Enter name"
                            className="border p-2 mb-3 rounded"
                            value={newStaff.name}
                            onChange={(e) => setNewStaff({...newStaff, name: e.target.value})}
                            required
                        />
                        <label className="mb-1">Gender</label>
                        <select
                            className="border p-2 mb-3 rounded"
                            value={newStaff.gender}
                            onChange={(e) => setNewStaff({...newStaff, gender: e.target.value})}
                        >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                        <label className="mb-1">Position</label>
                        <input
                            type="text"
                            placeholder="Enter position"
                            className="border p-2 mb-3 rounded"
                            value={newStaff.position}
                            onChange={(e) => setNewStaff({...newStaff, position: e.target.value})}
                            required
                        />
                        <label className="mb-1">Email</label>
                        <input
                            type="email"
                            placeholder="Enter email"
                            className="border p-2 mb-3 rounded"
                            value={newStaff.email}
                            onChange={(e) => setNewStaff({...newStaff, email: e.target.value})}
                            required
                        />
                        <label className="mb-1">Password</label>
                        <input
                            type="password"
                            placeholder="Enter password"
                            className="border p-2 mb-3 rounded"
                            value={newStaff.password}
                            onChange={(e) => setNewStaff({...newStaff, password: e.target.value})}
                            required
                        />
                        <label className="mb-1">Role</label>
                        <select
                            className="border p-2 mb-3 rounded"
                            value={newStaff.role}
                            onChange={(e) => setNewStaff({...newStaff, role: e.target.value})}
                        >
                            <option value="regular">Regular</option>
                            <option value="admin">Admin</option>
                        </select>
                        <button type="submit" className={"bg-green-500 text-white p-2 rounded-sm"}>Add
                            Staff</button>
                    </form>
                </div>
            </div>

            {/* Edit Modal */}
            <Modal open={openEditModal} className={"flex items-center justify-center"} onClose={() => setOpenEditModal(false)}>
                <div className='p-4 bg-white rounded w-[40%]'>
                    <h2 className={"font-bold text-center text-2xl"}>Edit Staff</h2>
                    {selectedStaff && (
                        <form className="flex flex-col">
                            <label className="mb-1">Name</label>
                            <input
                                type="text"
                                placeholder="Enter name"
                                className="border p-2 mb-3 rounded"
                                value={selectedStaff.name}
                                onChange={(e) => setSelectedStaff({...selectedStaff, name: e.target.value})}
                                required
                            />
                            <label className="mb-1">Gender</label>
                            <select
                                className="border p-2 mb-3 rounded"
                                value={selectedStaff.gender}
                                onChange={(e) => setSelectedStaff({...selectedStaff, gender: e.target.value})}
                            >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                            <label className="mb-1">Position</label>
                            <input
                                type="text"
                                placeholder="Enter position"
                                className="border p-2 mb-3 rounded"
                                value={selectedStaff.position}
                                onChange={(e) => setSelectedStaff({...selectedStaff, position: e.target.value})}
                                required
                            />
                            <label className="mb-1">Email</label>
                            <input
                                type="email"
                                placeholder="Enter email"
                                className="border p-2 mb-3 rounded"
                                value={selectedStaff.email}
                                onChange={(e) => setSelectedStaff({ ...selectedStaff, email: e.target.value })}
                                required
                            />
                            <label className="mb-1">Role</label>
                            <select
                                className="border p-2 mb-3 rounded"
                                value={selectedStaff.role}
                                onChange={(e) => setSelectedStaff({ ...selectedStaff, role: e.target.value })}
                            >
                                <option value="regular">Regular</option>
                                <option value="admin">Admin</option>
                            </select>
                            <Button onClick={handleEditStaff} variant="contained" style={{ backgroundColor: 'green', color: 'white' }}>Update Staff</Button>
                        </form>
                    )}
                </div>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal className={"flex items-center justify-center"} open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
                <div className='p-4 bg-white rounded w-[40%]'>
                    <h2 className={"font-bold text-2xl"}>Confirm Deletion</h2>
                    <p>Are you sure you want to delete {selectedStaff?.name}?</p>
                    <Button className={"ml-4"} onClick={handleDeleteStaff} variant="contained" color="secondary">Delete</Button>
                    <Button onClick={() => setOpenDeleteModal(false)} variant="outlined">Cancel</Button>
                </div>
            </Modal>
        </div>
    );
};

export default Staff;
