import  { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa6';
import {toast} from 'react-hot-toast'
import strings from '../strings';
import useApi from '../hooks/useApi';

interface Service {
    id: number;
    serviceId: string;
    ServiceName: string;
    inCharge: string;
    price: number;
}

interface StaffMember {
    id: number;
    StaffId: string;
    name: string;
}

export default function Services() {
    const [services, setServices] = useState<Service[]>([]);
    const [staff, setStaff] = useState<StaffMember[]>([]);
    const [newService, setNewService] = useState({
        ServiceName: '',
        inCharge: '',
        price: 0,
    });

    // Use our custom hook for API calls
    const [serviceState, serviceApi] = useApi<Service[]>();
    const [staffState, staffApi] = useApi<StaffMember[]>();
    
    const { data: servicesData, loading: servicesLoading, error: servicesError } = serviceState;
    const { data: staffData, loading: staffLoading, error: staffError } = staffState;

    // Fetch all services and staff when component mounts
    useEffect(() => {
        fetchServices();
        fetchStaff();
    }, []);
    
    // Update state when data changes
    useEffect(() => {
        if (servicesData) {
            setServices(servicesData);
        }
        
        if (servicesError) {
            toast.error(`Failed to fetch services: ${servicesError}`);
        }
    }, [servicesData, servicesError]);
    
    useEffect(() => {
        if (staffData) {
            setStaff(staffData);
        }
        
        if (staffError) {
            toast.error(`Failed to fetch staff: ${staffError}`);
        }
    }, [staffData, staffError]);

    // Fetch all services
    const fetchServices = async () => {
        console.log('Fetching services...');
        await serviceApi.get(`${strings.url}/api/services`);
    };

    // Fetch all staff members
    const fetchStaff = async () => {
        console.log('Fetching staff...');
        await staffApi.get(`${strings.url}/api/staff`);
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Creating new service:', newService);
        
        const result = await serviceApi.post(`${strings.url}/api/services`, newService);
        
        if (result && !servicesError) {
            toast.success('Service created successfully!');
            setNewService({ ServiceName: '', inCharge: '', price: 0 });
            fetchServices(); // Refresh the services list
        }
    };

    return (
        <div className='w-full h-full flex flex-col'>
            <div className="flex flex-row items-center justify-between p-2">
                <div className="flex flex-col">
                    <small>Services</small>
                    <h1>Group 3 Hotel</h1>
                </div>
                <button className="bg-[#079b31] flex flex-row p-3 px-4 items-center justify-between rounded-sm text-white">
                    <FaPlus color="white" />
                    Create New Service Record
                </button>
            </div>
            <div className='flex flex-row w-full h-[90%] py-2 justify-between items-center'>
                <div className='bg-white w-[48%] h-full p-3 overflow-auto'>
                    <h1 className='font-bold text-lg'>All Services</h1>
                    {servicesLoading ? (
                        <div className="flex justify-center items-center h-32">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                        </div>
                    ) : services.length > 0 ? (
                        <ul className="grid grid-cols-2 gap-4">
                            {services.map(service => (
                                <li key={service.id} className='p-2 border rounded bg-[#079b31]'>
                                    <strong>{service.ServiceName}</strong><br />
                                    Price: ₵{service.price}<br />
                                    Staff ID: {service.inCharge}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 text-center my-8">No services available. Add a new service to get started.</p>
                    )}
                </div>
                <div className='bg-white w-[48%] h-full p-3'>
                    <h1 className='font-bold text-lg'>Add New Service</h1>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Service Name"
                            value={newService.ServiceName}
                            onChange={(e) => setNewService({ ...newService, ServiceName: e.target.value })}
                            required
                            className="border rounded p-2 mb-2 w-full"
                        />
                        <select
                            value={newService.inCharge}
                            onChange={(e) => setNewService({ ...newService, inCharge: e.target.value })}
                            required
                            className="border rounded p-2 mb-2 w-full"
                            disabled={staffLoading}
                        >
                            <option value="">Select Staff</option>
                            {staff.map(staffMember => (
                                <option key={staffMember.id} value={staffMember.StaffId}>{staffMember.name}</option>
                            ))}
                        </select>
                        <input
                            type="number"
                            placeholder="Price"
                            value={newService.price}
                            onChange={(e) => setNewService({ ...newService, price: parseFloat(e.target.value) })}
                            required
                            className="border rounded p-2 mb-2 w-full"
                        />
                        <button 
                            type="submit" 
                            className="bg-[#079b31] text-white rounded p-2 w-full"
                            disabled={servicesLoading || staffLoading}
                        >
                            {servicesLoading ? 'Adding...' : 'Add Service'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
