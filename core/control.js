const express = require('express')
const router = express.Router()

// quản lý các controllers

// Gọi dashboard
router.use('/admin/dashboard', require('../controllers/C_dashboard'))
// Gọi category
router.use('/admin/category', require('../controllers/C_category'))
// Gọi product
router.use('/admin/product', require('../controllers/C_product'))
// Gọi user
router.use('/admin/user', require('../controllers/C_user'))

// Login
router.get('/login', (req, res)=>{ res.render('login')})

// Gọi api category
router.use('/api/category', require('../api/A_category'))
// Gọi api product
router.use('/api/product', require('../api/A_product'))
// Gọi api user
router.use('/api/user', require('../api/A_user'))
// Gọi api product
router.use('/api/contact', require('../api/A_contact'))
// Gọi api cart
router.use('/api/cart', require('../api/A_cart'))
// Gọi api like
router.use('/api/like', require('../api/A_like'))

module.exports = router;