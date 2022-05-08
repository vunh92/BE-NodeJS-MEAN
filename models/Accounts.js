const mongoose = require('mongoose');
// viết schema
const accountSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    phone: {
        type: String, 
        require: true,
        unique: true
    },
    role: {
        type: String,
        require: true,
        default: 'user' 
    },
    status: {
        type: Boolean,
        default: true
    },
    birthday: {
        type: Date
    },
    address: {
        type: String,
        default: ''
    },
    trash: {
        type: Boolean,
        default: false
    },
    date_created: {
        type: Date,
        default: Date.now()
    },
    date_updated: Date
})

module.exports = mongoose.model('Account', accountSchema);