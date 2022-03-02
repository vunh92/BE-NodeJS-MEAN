const mongoose = require('mongoose');

// viết schema
const productSchema = new mongoose.Schema({
    name: { type: String, require: true, unique: true },
    slug: { type: String, require: true, unique: true },
    price: { type: Number, default: 0 },
    parent: { type: mongoose.Types.ObjectId, default: null }, // danh mục
    id_user: { type: mongoose.Types.ObjectId, default: null },
    discount: { type: Number, default: 0 },
    type: { type: String, default: '' },
    note: { type: String, default: '' },
    gallery: { type: Array, default: [] },
    status: { type: Boolean, default: true },
    detail: { type: String, default: '' },
    detail2: { type: String, default: '' },
    detail3: { type: String, default: '' },
    img: { type: String, default: '' },
    trash: { type: Boolean, default: false },
    date_created: { type: Date, default: Date.now() },
    date_updated: { type: Date, default: null }
})

module.exports = mongoose.model('product', productSchema);

// phân tích product

// 1. name
// 2. slug
// 3. parent
// 4. id_user
// 5. price
// 6. img
// 7. gallery
// 5. status
// 6. trash
// 7. date_created
// 8. date_updated