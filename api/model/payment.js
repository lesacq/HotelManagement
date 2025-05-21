const { Payment } = require('../entities');
const { Op } = require('sequelize');

const PaymentModel = {
    // Method to get all payments
    getAll: async () => {
        try {
            console.log('[PaymentModel.getAll] Fetching all payment records');
            const payments = await Payment.findAll();
            console.log('[PaymentModel.getAll] Found', payments.length, 'payment records');
            return payments;
        } catch (error) {
            console.error('[PaymentModel.getAll] Error fetching all payments:', error);
            throw error;
        }
    },
    
    // Get payment by ID
    getById: async (id) => {
        try {
            console.log('[PaymentModel.getById] Looking for payment with ID:', id);
            const payment = await Payment.findByPk(id);
            
            if (payment) {
                console.log('[PaymentModel.getById] Found payment with ID:', id);
            } else {
                console.log('[PaymentModel.getById] No payment found with ID:', id);
            }
            
            return payment;
        } catch (error) {
            console.error('[PaymentModel.getById] Error fetching payment by ID:', id, error);
            throw error;
        }
    },
    
    // Create a new payment
    create: async (paymentData) => {
        try {
            console.log('[PaymentModel.create] Creating new payment with data:', JSON.stringify(paymentData));
            const { amount, paymentMethod, StaffId, itemId } = paymentData;
            
            const newPayment = await Payment.create({
                amount,
                paymentMethod,
                StaffId,
                itemId
            });
            
            console.log('[PaymentModel.create] Payment created successfully with ID:', newPayment.id);
            return newPayment;
        } catch (error) {
            console.error('[PaymentModel.create] Error creating payment record:', error);
            throw error;
        }
    }
};

module.exports = PaymentModel;
