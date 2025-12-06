const {Order, validate} = require('../models/order')
const {Customer} = require('../models/customer')
const {Product} = require('../models/product')
const express = require('express')
const router = express.Router()


router.post('/create', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let order = new Order(req.body);
    await order.save();

    // Initialize Paystack
    const response = await axios.post(
        "https://api.paystack.co/transaction/initialize",
        {
            email: order.customerSnapshot.email,
            amount: order.totalAmount * 100, // in kobo
            metadata: { orderId: order._id.toString() }
        },
        {
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
            }
        }
    );

    // save reference
    order.paymentReference = response.data.data.reference;
    await order.save();

    res.send({
        orderId: order._id,
        authorizationUrl: response.data.data.authorization_url,
        reference: response.data.data.reference
    });
});


router.post('/confirm', async (req, res) => {
    const { reference } = req.body;

    const response = await axios.get(
        "https://api.paystack.co/transaction/verify/${reference}",
        {
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
            }
        }
    );

    const data = response.data.data;
    if (data.status === "success") {
        const order = await Order.findOneAndUpdate(
            { paymentReference: reference },
            { paymentStatus: "paid", transactionId: data.id },
            { new: true }
        );
        return res.send({ success: true, order });
    } else {
        return res.status(400).send({ success: false, message: "Payment failed" });
    }
});


router.post('/webhook', express.json({ type: 'application/json' }), async (req, res) => {
    const event = req.body;

    if (event.event === "charge.success") {
        const reference = event.data.reference;
        await Order.findOneAndUpdate(
            { paymentReference: reference },
            { paymentStatus: "paid", transactionId: event.data.id }
        );
    }

    res.sendStatus(200);
});

module.exports = router