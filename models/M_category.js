const mongoose = require('mongoose');

// phân tích category

// 1. name
// 2. slug
// 3. parent (để phân cấp cha con)
// 4. id_user
// 5. status
// 6. trash
// 7. date_created
// 8. date_updated

// viết schema
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        unique: true
    },
    slug: {
        type: String,
        require: true,
        unique: true
    },
    parent: {
        type: mongoose.Types.ObjectId,
        default: null
    },
    id_user: {
        type: mongoose.Types.ObjectId,
        default: null
    },
    content: {
        type: String,
        default: ''
    },
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

module.exports = mongoose.model('category', categorySchema);