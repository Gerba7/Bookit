const mongoose = require('mongoose');


const ReviewsSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 10
    },
    comment: {
        type: String,
        required: true
    },
    tags: {
        type: [String]
    },

}, {timestamps: true}

);

module.exports = mongoose.model("Review", ReviewsSchema);