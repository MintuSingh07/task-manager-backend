const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    tasks: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdTime: {
        type: Number
    },
    user: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {timestamps: true});

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;