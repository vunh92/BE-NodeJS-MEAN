const mongoose = require('mongoose');

// viết schema
const likeSchema = new mongoose.Schema({
    id_product: { type: String, require: true, unique: true },
    name: { type: String, require: true, unique: true },
    id_user: { type: mongoose.Types.ObjectId, default: null },
    price: { type: Number, default: 0 },
    img: { type: String, default: '' },
    status: { type: Boolean, default: false },
    date_created: { type: Date, default: Date.now() },
    date_updated: { type: Date, default: null }
})

module.exports = mongoose.model('like', likeSchema);
