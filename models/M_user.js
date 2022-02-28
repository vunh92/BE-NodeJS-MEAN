const mongoose = require('mongoose');

// phân tích user

// 1. username
// 2. password
// 3. email
// 4. phone
// 5. status
// 6. trash
// 7. date_created
// 8. date_updated
// 9. role

// viết schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    phone: {
        type: String, // 0321221213, nếu để number thì không có số 0 ở đầu
        require: true,
        unique: true
    },
    role: { // admin (toàn quyền), user (không được xóa), guest (chỉ xem)
        type: String,
        require: true 
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
    date_updated: Date
})

module.exports = mongoose.model('user', userSchema);