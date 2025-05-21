import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import toast from 'react-hot-toast';
import strings from '../strings';
import useApi from '../hooks/useApi';
import { Payment } from '../types';

const Payments: React.FC = () => {
    const [payments, setPayments] = useState<Payment[]>([]);
    
    // Use our custom hook for API calls
    const [state, api] = useApi<Payment[]>();
    const { data, loading, error } = state;

    useEffect(() => {
        fetchPayments();
    }, []);
    
    useEffect(() => {
        if (data) {
            setPayments(data);
        }
        
        if (error) {
            toast.error(`Failed to fetch payments: ${error}`);
        }
    }, [data, error]);

    const fetchPayments = async () => {
        console.log('Fetching payments...');
        await api.get(`${strings.url}/api/payments`);
    };

    return (
        <div className='w-full h-full flex flex-col justify-evenly'>
                <div className="flex flex-col h-[10%]">
                    <small>Payments</small>
                    <h1>Group 3 Hotel</h1>
                </div>

            {loading ? (
                <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
            ) : payments.length === 0 ? (
                <p className="text-gray-500 text-center my-8">No payments found.</p>
            ) : (
                <TableContainer className={"h-[80%]"} component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Amount</TableCell>
                                <TableCell>Payment Method</TableCell>
                                <TableCell>Staff ID</TableCell>
                                <TableCell>Item ID</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {payments.map((payment) => (
                                <TableRow key={payment.id}>
                                    <TableCell>{payment.id}</TableCell>
                                    <TableCell>{payment.amount}</TableCell>
                                    <TableCell>{payment.paymentMethod}</TableCell>
                                    <TableCell>{payment.StaffId}</TableCell>
                                    <TableCell>{payment.itemId}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </div>
    );
};

export default Payments;
