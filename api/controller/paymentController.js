const Payment = require('../model/payment');

// Get all payments
exports.getAllPayments = async (req, res) => {
    try {
        console.log('[PaymentController.getAllPayments] Fetching all payments');
        const paymentList = await Payment.getAll();
        console.log('[PaymentController.getAllPayments] Successfully fetched payments, count:', paymentList.length);
        res.status(200).json(paymentList);
    } catch (err) {
        console.error('[PaymentController.getAllPayments] Error:', err);
        return res.status(500).json({ error: err.message });
    }
};