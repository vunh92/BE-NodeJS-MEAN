const mongoose = require('mongoose');

// viết schema
const tokenSchema = new mongoose.Schema({
    id_user: { type: mongoose.Types.ObjectId, default: null },
    role: { type: String, require: true, default: 'guest' },
    token: { type: String, default: null },
    status: { type: Boolean, default: true },
    date_created: { type: Date, default: Date.now() },
    date_updated: { type: Date, default: null }
})

module.exports = mongoose.model('token', tokenSchema);