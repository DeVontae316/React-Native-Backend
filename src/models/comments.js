const mongoose = require("mongoose");
const Schema = mongoose.Schema;




const userComments = new Schema({
    comment: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
    },

});

const Comments = mongoose.model("Comment", userComments);

module.exports = Comments;