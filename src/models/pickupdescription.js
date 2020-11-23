const mongoose = require("mongoose");

const descriptionSchema = new mongoose.Schema({
    label: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
});

const Description = mongoose.model("Description", descriptionSchema);

module.exports = Description;