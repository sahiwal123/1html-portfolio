const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Feedback schema
const feedbackSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String
});
const Feedback = mongoose.model('Feedback', feedbackSchema);

// Order schema
const orderSchema = new mongoose.Schema({
    items: Array,
    total: Number,
    email: String
});
const Order = mongoose.model('Order', orderSchema);

// Feedback route
app.post('/feedback', async (req, res) => {
    const { name, email, message } = req.body;

    const feedback = new Feedback({ name, email, message });
    await feedback.save();

    // Send email notification
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    let mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: 'New Feedback Received',
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });

    res.status(200).send('Feedback received');
});

// Order route
app.post('/order', async (req, res) => {
    const { items, total, email } = req.body;

    const order = new Order({ items, total, email });
    await order.save();

    // Send email notification
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    let mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: 'New Order Received',
        text: `Order Details:\nItems: ${JSON.stringify(items)}\nTotal: $${total}\nCustomer Email: ${email}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });

    res.status(200).send('Order received');
});

// Payment route
app.post('/pay', async (req, res) => {
    const { amount, source } = req.body;

    try {
        const charge = await stripe.charges.create({
            amount: amount * 100, // amount in cents
            currency: 'usd',
            source,
            description: 'Restaurant Order'
        });
        res.status(200).send({ success: true });
    } catch (error) {
        console.error('Payment error:', error);
        res.status(500).send({ success: false });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
