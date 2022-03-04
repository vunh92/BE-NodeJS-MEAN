const mongoose = require('mongoose');

// viết schema
const cartSchema = new mongoose.Schema({
    id_product: { type: mongoose.Types.ObjectId, require: true },
    name: { type: String, require: true },
    id_user: { type: mongoose.Types.ObjectId, require: true },
    price: { type: Number, default: 0 },
    qty: { type: Number, default: 0 },
    img: { type: String, default: '' },
    status: { type: Boolean, default: false },
    date_created: { type: Date, default: Date.now() },
    date_updated: { type: Date, default: null }
})

module.exports = mongoose.model('cart', cartSchema);
