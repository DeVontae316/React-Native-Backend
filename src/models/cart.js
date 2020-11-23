const mongoose = require("mongoose");
const validator = require("validator");

const Cart = mongoose.model("Cart", {
    items: {
        type: String,
        trim: true,
        required: true,
        validate(name) {
            if (name === "" || name.includes(" ")) {
                throw new Error("Name not valid");
            }
        }
    },
    email: {
        type: String,
        trim: true,
        required: true,
        validate(email) {
            if (!validator.isEmail(email)) {
                throw new Error("Email isn't valid");
            }
        }
    },

});

module.exports = Cart;