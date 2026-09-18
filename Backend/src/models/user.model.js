const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true, 
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true
    }
}, {
    timestamps: true // Ye add kar diya taaki createdAt aur updatedAt automatically ban jaye (production best practice)
});

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;