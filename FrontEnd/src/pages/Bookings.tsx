import React, { useState, useEffect } from 'react';
import {toast} from 'react-hot-toast';
import { FaPlus } from "react-icons/fa6";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import strings from '../strings';
import useApi from '../hooks/useApi';

interface Room {
    id: number;
    roomNumber: string;
    type: string;
    description: string;
    status: 'available' | 'occupied';
}

interface Guest {
    id: number;
    GuestId: string;
    firstName: string;
    lastName: string;
    gender: string;
    email: string;
}

interface Service {
    id: number;
    ServiceId: string;
    ServiceName: string;
    price: number;
    inCharge: string;
}

interface Booking {
    id?: string;
    BookingId?: string;
    roomNumber: string;
    guestId: string;
    GuestId?: string;
    amount: number;
    paymentMethod: string;
    status?: string;
    Status?: string;
    checkInDate?: string;
    checkOutDate?: string;
}

interface ServiceRecord {
    id: string;
    guestId: string;
    GuestId?: string;
    amount: number;
    paymentMethod: string;
    status: string;
    date?: string;
}

const Bookings: React.FC = () => {
    // States for data
    const [rooms, setRooms] = useState<Room[]>([]);
    const [guests, setGuests] = useState<Guest[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [serviceRecords, setServiceRecords] = useState<ServiceRecord[]>([]);
    
    // States for form inputs
    const [newBooking, setNewBooking] = useState<Booking>({
        id: '',
        roomNumber: '',
        guestId: '',
        amount: 0,
        paymentMethod: '',
        status: 'pending',
    });
    const [newServiceRecord, setNewServiceRecord] = useState<ServiceRecord>({
        id: '',
        guestId: '',
        amount: 0,
        paymentMethod: '',
        status: 'paid',
    });
    
    // Modal states
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [showServiceModal, setShowServiceModal] = useState(false);
    
    // API hooks
    const [roomState, roomApi] = useApi<Room[]>();
    const [guestState, guestApi] = useApi<Guest[]>();
    const [serviceState, serviceApi] = useApi<Service[]>();
    const [bookingState, bookingApi] = useApi<Booking[]>();
    const [serviceRecordState, serviceRecordApi] = useApi<ServiceRecord[]>();
    const [createBookingState, createBookingApi] = useApi<any>();
    const [createServiceState, createServiceApi] = useApi<any>();
    const [checkoutState, checkoutApi] = useApi<any>();
    
    // Loading states
    const roomsLoading = roomState.loading;
    const guestsLoading = guestState.loading;
    const servicesLoading = serviceState.loading;
    const bookingsLoading = bookingState.loading;
    const serviceRecordsLoading = serviceRecordState.loading;
    const creatingBooking = createBookingState.loading;
    const creatingService = createServiceState.loading;
    const checkingOut = checkoutState.loading;
    
    // Any operation in progress
    const isLoading = roomsLoading || guestsLoading || servicesLoading || 
                    bookingsLoading || serviceRecordsLoading || 
                    creatingBooking || creatingService || checkingOut;

    // Fetch data on component mount
    useEffect(() => {
        fetchRooms();
        fetchGuests();
        fetchServices();
        fetchBookings();
        fetchServiceRecords();
    }, []);
    
    // Update state when data changes
    useEffect(() => {
        if (roomState.data) {
            setRooms(roomState.data);
        }
        if (roomState.error) {
            toast.error(`Failed to fetch rooms: ${roomState.error}`);
        }
    }, [roomState.data, roomState.error]);
    
    useEffect(() => {
        if (guestState.data) {
            setGuests(guestState.data);
        }
        if (guestState.error) {
            toast.error(`Failed to fetch guests: ${guestState.error}`);
        }
    }, [guestState.data, guestState.error]);
    
    useEffect(() => {
        if (serviceState.data) {
            setServices(serviceState.data);
        }
        if (serviceState.error) {
            toast.error(`Failed to fetch services: ${serviceState.error}`);
        }
    }, [serviceState.data, serviceState.error]);
    
    useEffect(() => {
        if (bookingState.data) {
            setBookings(bookingState.data);
        }
        if (bookingState.error) {
            toast.error(`Failed to fetch bookings: ${bookingState.error}`);
        }
    }, [bookingState.data, bookingState.error]);
    
    useEffect(() => {
        if (serviceRecordState.data) {
            setServiceRecords(serviceRecordState.data);
        }
        if (serviceRecordState.error) {
            toast.error(`Failed to fetch service records: ${serviceRecordState.error}`);
        }
    }, [serviceRecordState.data, serviceRecordState.error]);
    
    useEffect(() => {
        if (createBookingState.data && !createBookingState.error) {
            toast.success('Booking created successfully!');
            setShowBookingModal(false);
            setNewBooking({
                id: '',
                roomNumber: '',
                guestId: '',
                amount: 0,
                paymentMethod: '',
                status: 'pending',
            });
            fetchBookings();
            fetchRooms(); // Refresh rooms as status may have changed
        }
        if (createBookingState.error) {
            toast.error(`Failed to create booking: ${createBookingState.error}`);
        }
    }, [createBookingState.data, createBookingState.error]);
    
    useEffect(() => {
        if (createServiceState.data && !createServiceState.error) {
            toast.success('Service record created successfully!');
            setShowServiceModal(false);
            setNewServiceRecord({
                id: '',
                guestId: '',
                amount: 0,
                paymentMethod: '',
                status: 'paid',
            });
            fetchServiceRecords();
        }
        if (createServiceState.error) {
            toast.error(`Failed to create service record: ${createServiceState.error}`);
        }
    }, [createServiceState.data, createServiceState.error]);
    
    useEffect(() => {
        if (checkoutState.data && !checkoutState.error) {
            toast.success('Check-out completed successfully!');
            fetchBookings();
            fetchRooms(); // Refresh rooms as status may have changed
        }
        if (checkoutState.error) {
            toast.error(`Failed to check out: ${checkoutState.error}`);
        }
    }, [checkoutState.data, checkoutState.error]);

    // Fetch functions
    const fetchRooms = async () => {
        console.log('Fetching rooms...');
        await roomApi.get(`${strings.url}/api/rooms?status=available`);
    };

    const fetchGuests = async () => {
        console.log('Fetching guests...');
        await guestApi.get(`${strings.url}/api/guest`);
    };

    const fetchServices = async () => {
        console.log('Fetching services...');
        await serviceApi.get(`${strings.url}/api/services`);
    };

    const fetchBookings = async () => {
        console.log('Fetching bookings...');
        await bookingApi.get(`${strings.url}/api/bookings`);
    };

    const fetchServiceRecords = async () => {
        console.log('Fetching service records...');
        await serviceRecordApi.get(`${strings.url}/api/bookings/service-records`);
    };

    // Action handlers
    const handleCreateBooking = async () => {
        console.log('Creating booking:', newBooking);
        
        try {
            const staffObj = localStorage.getItem('user');
            if (!staffObj) {
                toast.error('User information not found. Please log in again.');
                return;
            }
            
            const staff = JSON.parse(staffObj);
            const StaffId = staff.StaffId;
            
            await createBookingApi.post(`${strings.url}/api/bookings`, {
                roomNumber: newBooking.roomNumber,
                guestId: newBooking.guestId,
                amount: newBooking.amount,
                paymentMethod: newBooking.paymentMethod,
                StaffId,
            });
        } catch (error) {
            console.error('Error parsing user data:', error);
            toast.error('Invalid user data. Please log in again.');
        }
    };

    const handleCreateServiceRecord = async () => {
        console.log('Creating service record:', newServiceRecord);
        
        try {
            const staffObj = localStorage.getItem('user');
            if (!staffObj) {
                toast.error('User information not found. Please log in again.');
                return;
            }
            
            const staff = JSON.parse(staffObj);
            const StaffId = staff.StaffId;
            
            await createServiceApi.post(`${strings.url}/api/bookings/service-records`, {
                guestId: newServiceRecord.guestId,
                amount: newServiceRecord.amount,
                paymentMethod: newServiceRecord.paymentMethod,
                StaffId,
            });
        } catch (error) {
            console.error('Error parsing user data:', error);
            toast.error('Invalid user data. Please log in again.');
        }
    };

    const handleCheckout = async (bookingId: string, roomNumber: string) => {
        console.log('Checking out booking:', bookingId, 'for room:', roomNumber);
        
        await checkoutApi.post(`${strings.url}/api/bookings/checkout`, {
            bookingId,
            roomNumber,
        });
    };

    return (
        <div className='w-full h-full flex flex-col'>
            <div className="flex flex-row items-center justify-between p-2">
                <div className="flex flex-col">
                    <small>Bookings</small>
                    <h1>Group 3 Hotel</h1>
                </div>
                <button 
                    className={"p-2 bg-[#079b31] flex flex-row items-center text-white "} 
                    onClick={() => setShowBookingModal(true)}
                    disabled={isLoading}
                >
                    <FaPlus /> Create New Booking
                </button>
                <button 
                    className={"p-2 bg-[#079b31] flex flex-row items-center text-white "} 
                    onClick={() => setShowServiceModal(true)}
                    disabled={isLoading}
                >
                    <FaPlus /> Create New Service Record
                </button>
            </div>

            {/* Modals */}
            {showBookingModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-4 rounded w-1/3">
                        <h2 className="font-bold text-center text-2xl">Create New Booking</h2>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            handleCreateBooking();
                        }} className="flex flex-col">
                            <label className="mb-1">Select Room</label>
                            <select
                                className="border p-2 mb-3 rounded"
                                value={newBooking.roomNumber}
                                onChange={(e) => setNewBooking({ ...newBooking, roomNumber: e.target.value })}
                                required
                                disabled={roomsLoading || creatingBooking}
                            >
                                <option value="">Select Room</option>
                                {rooms
                                    .filter(room => room.status === 'available') // Only available rooms
                                    .map(room => (
                                        <option key={room.roomNumber} value={room.roomNumber}>
                                            {room.roomNumber}
                                        </option>
                                    ))}
                            </select>

                            <label className="mb-1">Select Guest</label>
                            <select
                                className="border p-2 mb-3 rounded"
                                value={newBooking.guestId}
                                onChange={(e) => setNewBooking({ ...newBooking, guestId: e.target.value })}
                                required
                                disabled={guestsLoading || creatingBooking}
                            >
                                <option value="">Select Guest</option>
                                {guests.map(guest => (
                                    <option key={guest.GuestId} value={guest.GuestId}>{`${guest.firstName} ${guest.lastName}`}</option>
                                ))}
                            </select>

                            <label className="mb-1">Amount</label>
                            <input
                                type="number"
                                className="border p-2 mb-3 rounded"
                                value={newBooking.amount}
                                onChange={(e) => setNewBooking({ ...newBooking, amount: parseFloat(e.target.value) })}
                                required
                                disabled={creatingBooking}
                            />

                            <label className="mb-1">Payment Method</label>
                            <input
                                type="text"
                                className="border p-2 mb-3 rounded"
                                value={newBooking.paymentMethod}
                                onChange={(e) => setNewBooking({ ...newBooking, paymentMethod: e.target.value })}
                                required
                                disabled={creatingBooking}
                            />

                            <Button 
                                variant="contained" 
                                color="primary" 
                                type="submit"
                                disabled={creatingBooking}
                            >
                                {creatingBooking ? 'Creating...' : 'Create Booking'}
                            </Button>
                            <Button 
                                variant="contained" 
                                color="secondary" 
                                onClick={() => setShowBookingModal(false)} 
                                className="mt-2"
                                disabled={creatingBooking}
                            >
                                Close
                            </Button>
                        </form>
                    </div>
                </div>
            )}

            {showServiceModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-4 rounded w-1/3">
                        <h2 className="font-bold text-center text-2xl">Create New Service Record</h2>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            handleCreateServiceRecord();
                        }} className="flex flex-col">
                            <label className="mb-1">Select Guest</label>
                            <select
                                className="border p-2 mb-3 rounded"
                                value={newServiceRecord.guestId}
                                onChange={(e) => setNewServiceRecord({ ...newServiceRecord, guestId: e.target.value })}
                                required
                                disabled={guestsLoading || creatingService}
                            >
                                <option value="">Select Guest</option>
                                {guests.map(guest => (
                                    <option key={guest.GuestId} value={guest.GuestId}>{`${guest.firstName} ${guest.lastName}`}</option>
                                ))}
                            </select>

                            <label className="mb-1">Amount</label>
                            <input
                                type="number"
                                className="border p-2 mb-3 rounded"
                                value={newServiceRecord.amount}
                                onChange={(e) => setNewServiceRecord({ ...newServiceRecord, amount: parseFloat(e.target.value) })}
                                required
                                disabled={creatingService}
                            />

                            <label className="mb-1">Payment Method</label>
                            <input
                                type="text"
                                className="border p-2 mb-3 rounded"
                                value={newServiceRecord.paymentMethod}
                                onChange={(e) => setNewServiceRecord({ ...newServiceRecord, paymentMethod: e.target.value })}
                                required
                                disabled={creatingService}
                            />

                            <Button 
                                variant="contained" 
                                color="primary" 
                                type="submit"
                                disabled={creatingService}
                            >
                                {creatingService ? 'Creating...' : 'Create Service Record'}
                            </Button>
                            <Button 
                                variant="contained" 
                                color="secondary" 
                                onClick={() => setShowServiceModal(false)} 
                                className="mt-2"
                                disabled={creatingService}
                            >
                                Close
                            </Button>
                        </form>
                    </div>
                </div>
            )}

            {/* Data tables for bookings and service records */}
            <div className="flex flex-row justify-between overflow-auto mt-4">
                <div className="w-1/2 p-2">
                    <h3>Bookings</h3>
                    {bookingsLoading ? (
                        <div className="flex justify-center items-center h-32">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                        </div>
                    ) : bookings.length === 0 ? (
                        <p className="text-gray-500 text-center my-8">No bookings found. Create a new booking to get started.</p>
                    ) : (
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID</TableCell>
                                        <TableCell>Guest</TableCell>
                                        <TableCell>Room</TableCell>
                                        <TableCell>Check-in Date</TableCell>
                                        <TableCell>Check-out Date</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {bookings.map((booking) => (
                                        <TableRow key={booking.BookingId}>
                                            <TableCell>{booking.BookingId}</TableCell>
                                            <TableCell>{guests.find(guest => guest.GuestId === booking.GuestId)?.firstName}</TableCell>
                                            <TableCell>{booking.roomNumber}</TableCell>
                                            <TableCell>{booking.checkInDate ? new Date(booking.checkInDate).toLocaleDateString() : 'N/A'}</TableCell>
                                            <TableCell>{booking.checkOutDate ? new Date(booking.checkOutDate).toLocaleDateString() : 'N/A'}</TableCell>
                                            <TableCell>
                                                {booking.Status === 'checked_out' ? (
                                                    <span className="bg-green-500 text-white px-2 py-1 rounded">Checked Out</span>
                                                ) : (
                                                    <span>{booking.Status}</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {booking.Status !== 'checked_out' && booking.BookingId && (
                                                    <Button 
                                                        variant="contained" 
                                                        color="secondary" 
                                                        onClick={() => handleCheckout(booking.BookingId, booking.roomNumber)}
                                                        disabled={checkingOut}
                                                    >
                                                        {checkingOut ? 'Processing...' : 'Checkout'}
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </div>

                <div className="w-1/2 p-2">
                    <h3>Service Records</h3>
                    {serviceRecordsLoading ? (
                        <div className="flex justify-center items-center h-32">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                        </div>
                    ) : serviceRecords.length === 0 ? (
                        <p className="text-gray-500 text-center my-8">No service records found. Create a new service record to get started.</p>
                    ) : (
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID</TableCell>
                                        <TableCell>Guest</TableCell>
                                        <TableCell>Amount Paid</TableCell>
                                        <TableCell>Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {serviceRecords.map((serviceRecord) => (
                                        <TableRow key={serviceRecord.id}>
                                            <TableCell>{serviceRecord.id}</TableCell>
                                            <TableCell>{guests.find(guest => guest.GuestId === serviceRecord.GuestId)?.firstName}</TableCell>
                                            <TableCell>{serviceRecord.amount}</TableCell>
                                            <TableCell>{serviceRecord.status}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Bookings;
