const mongoose = require('mongoose');

// viết schema
const shipSchema = new mongoose.Schema({
    array_cart: { type: Array, default: [], require: true },
    id_user: { type: mongoose.Types.ObjectId, require: true },
    pay: { type: Number, default: 0 },
    status: { type: Boolean, default: false },
    date_created: { type: Date, default: Date.now() },
    date_updated: { type: Date, default: null }
})

module.exports = mongoose.model('ship', shipSchema);
