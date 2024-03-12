const mongoose = require('mongoose');


const AccommodationsSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    adress: {
        type: String,
        required: true
    },
    location: {
        type: String
    },
    distance: {
        type: String,
        default: 500
    },
    photos: {
        type: [String],
    },
    description: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        min: 0,
        max: 10
    },
    stars: {
        type: Number,
        min: 0,
        max: 5
    },
    locationRating: {
        type: [Number]
    },
    modality: {
        type: String,
    },
    startingPrice: {
        type: Number,
        required: true
    },
    features: {
        type: [String],
        required: true
    },
    breakfast: {
        type: Boolean,
        required: true
    },
    sustainability: {
        type: Number,
    },
    reviews: {
        type: [String]
    },
    discount: {
        type: Number
    },
    freeCancelation: {
        type: Boolean,
        required: true,
        default: false
    },
    services: {
        type: [String]
    },
    reviews: {
        type: [String]
    },
    maxGuests: {
        type: Number,
        required: true
    },
    roomsQuantity: {
        type: Number,
        required: true
    },
    bookedDates: {
        type: Date,
    },
    reservations: {
        type: [String]
    },
    singleBeds: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
        max: 4
    },
    doubleBeds: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
        max: 2,
    },

}, {timestamps: true}

);

module.exports = mongoose.model("Accommodation", AccommodationsSchema);