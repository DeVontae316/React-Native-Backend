const mongoose = require("mongoose");

const testFormSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,

    },

})


const testFormData = mongoose.model("TestFormData", testFormSchema);

module.exports = testFormData;