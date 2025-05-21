import { useEffect, useState, useRef } from 'react';
import { FaHome } from "react-icons/fa";
import { FaBook } from "react-icons/fa";
import { FaBuildingCircleArrowRight } from "react-icons/fa6";
import { MdOutlineLocalLaundryService } from "react-icons/md";
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import toast from 'react-hot-toast';
import strings from '../strings';
import useApi from '../hooks/useApi';

// Register the required components
ChartJS.register(ArcElement, Tooltip, Legend);

interface DashboardData {
    bookingCount: number;
    roomCounts: {
        totalRooms: number;
        availableRooms: number;
        unavailableRooms: number;
    };
    checkInOutCounts: {
        checkInCount: number;
        checkOutCount: number;
    };
}

type CardProps = {
    icon: React.ReactNode;
    title: string;
    value: string;
};

const CardItems: CardProps[] = [
    { icon: <FaHome color="black" />, title: "Bookings", value: "0" },
    { icon: <FaBook color="black" />, title: "Available Rooms", value: "0" },
    { icon: <FaBuildingCircleArrowRight />, title: "Check ins", value: "0" },
    { icon: <MdOutlineLocalLaundryService />, title: "Check Outs", value: "0" }
];

const Card = ({ icon, title, value }: CardProps) => {
    return (
        <div className="w-[20%] h-[95%] bg-white flex flex-row items-center justify-center gap-10">
            <span className="bg-gray-200 rounded-sm flex items-center justify-center p-3">{icon}</span>
            <div className="bg-white rounded-md flex flex-col">
                <small className="text-black font-bold text-xs">{title}</small>
                <h1 className="text-black text-md font-bold">{value}</h1>
            </div>
        </div>
    );
};

export default function Home() {
    const [bookingCount, setBookingCount] = useState(0);
    const [availableRooms, setAvailableRooms] = useState(0);
    const [unavailableRooms, setUnavailableRooms] = useState(0);
    const [checkInCount, setCheckInCount] = useState(0);
    const [checkOutCount, setCheckOutCount] = useState(0);
    const chartRef = useRef<any>(null);
    
    // Use our custom hook for API calls
    const [state, api] = useApi<DashboardData>();
    const { data, loading, error } = state;

    useEffect(() => {
        fetchDashboardData();
    }, []);
    
    useEffect(() => {
        if (data) {
            // Update state with dashboard data
            setBookingCount(data.bookingCount);
            setAvailableRooms(data.roomCounts.availableRooms);
            setUnavailableRooms(data.roomCounts.unavailableRooms);
            setCheckInCount(data.checkInOutCounts.checkInCount);
            setCheckOutCount(data.checkInOutCounts.checkOutCount);
            
            toast.success('Dashboard data loaded successfully!');
        }
        
        if (error) {
            toast.error(`Failed to load dashboard data: ${error}`);
        }
    }, [data, error]);

    const fetchDashboardData = async () => {
        console.log('Fetching dashboard data...');
        await api.get(`${strings.url}/api/dashboards`);
    };

    const chartData = {
        labels: ['Available Rooms', 'Unavailable Rooms'],
        datasets: [
            {
                data: [availableRooms, unavailableRooms],
                backgroundColor: ['#079b31', '#ff0000'],
            },
        ],
    };

    const updatedCardItems = CardItems.map((item) => {
        if (item.title === "Bookings") {
            return { ...item, value: bookingCount.toString() };
        }
        if (item.title === "Available Rooms") {
            return { ...item, value: availableRooms.toString() };
        }
        if (item.title === "Check ins") {
            return { ...item, value: checkInCount.toString() };
        }
        if (item.title === "Check Outs") {
            return { ...item, value: checkOutCount.toString() };
        }
        return item;
    });

    useEffect(() => {
        // Cleanup chart instance on unmount
        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
            }
        };
    }, []);

    return (
        <div className="flex w-full h-full flex-col p-4 items-center justify-between">
            <div className="w-full h-[25%] flex flex-col justify-between">
                <div className="flex flex-row items-center justify-between">
                    <div className="flex flex-col">
                        <small>Home</small>
                        <h1>Group 3 Hotel</h1>
                    </div>
                </div>
                {loading ? (
                    <div className="w-full h-[70%] py-3 flex flex-row justify-center items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                    </div>
                ) : (
                    <div className="w-full h-[70%] py-3 flex flex-row justify-between">
                        {updatedCardItems.map((item, index) => (
                            <Card key={index} icon={item.icon} title={item.title} value={item.value} />
                        ))}
                    </div>
                )}
            </div>
            <div className="w-full h-[70%] flex flex-row items-center justify-between">
                <div className="bg-white w-[48%] h-[100%] flex justify-center items-center">
                    {loading ? (
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                    ) : (
                        <Doughnut ref={chartRef} data={chartData} />
                    )}
                </div>
                <div className="w-[48%] h-[100%] flex flex-col justify-between">
                    <div className="bg-white h-[48%]"></div>
                    <div className="bg-white h-[48%]"></div>
                </div>
            </div>
        </div>
    );
}
