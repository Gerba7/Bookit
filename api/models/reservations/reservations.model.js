const mongoose = require('mongoose');


const ReservationsSchema = new mongoose.Schema({

    price: {
        type: Number,
        required: true,
        min: 0
    },
    guests: {
        type: Number,
        required: true,
        min: 0
    },
    roomsQuantity: {
        type: Number,
        required: true
    },
    checkIn: {
        type: String,
        required: true
    },
    checkOut: {
        type: String,
        required: true
    },
    accommodationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Accommodation',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    name: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    }

}, {timestamps: true}

);

module.exports = mongoose.model("Reservation", ReservationsSchema);