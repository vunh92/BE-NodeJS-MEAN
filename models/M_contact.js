const mongoose = require('mongoose');

// viết schema
const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    address: String,
    status: {
        type: Boolean,
        default: true
    },
    trash: {
        type: Boolean,
        default: false
    },
    date_created: {
        type: Date,
        default: Date.now()
    },
    date_updated: {
        type: Date,
        default: null
    }
})

module.exports = mongoose.model('contact', contactSchema);