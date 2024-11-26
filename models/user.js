const mongoose = require('mongoose');

// Define User Schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
},
    { timestamps: true }
);

// Create and export User model
module.exports = mongoose.model('User', userSchema);
