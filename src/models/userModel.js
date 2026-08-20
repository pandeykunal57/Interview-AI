const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: [true, 'Username already exists']
    },
    email: {
        type: String,
        required: true,
        unique: [true, 'Account with this Email already exists']
    },
    password: {
        type: String,
        required: true
    }
});

const userModel = mongoose.model('users', userSchema);
module.exports = userModel;