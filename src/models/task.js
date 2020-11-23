const mongoose = require("mongoose");
const validator = require("validator");

const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        validate(task) {
            if (task === "nothing" || task.includes("nothing")) {
                throw new Error("Not allowed, must set a task for the day!!!:)")
            }
        }
    },
    completed: {
        type: Boolean,
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },

}, {
    timestamps: true
})


const Task = mongoose.model("Task", taskSchema);

module.exports = Task;