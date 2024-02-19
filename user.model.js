const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true,
        unique: true
    },
    password:{
        type: String,
        require: true,
    },
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    }]
}, {timestamps: true});

const User = mongoose.model('User', userSchema);
module.exports = User;