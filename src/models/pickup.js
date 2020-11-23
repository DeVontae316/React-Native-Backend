const mongoose = require("mongoose");

const pickupSchema = new mongoose.Schema({
    photo: [{
        type: String,
        required: false,
    }],
    title: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    label: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    }
}, {
    timestamps: true,
})

const Pickup = mongoose.model('Pickup', pickupSchema);

module.exports = Pickup;