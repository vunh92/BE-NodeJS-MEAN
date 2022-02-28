const express = require('express')
const router = express.Router()

// Gọi class Html
const Html = require('../core/html');

router.get('/index', (req, res)=>{

    const _sd = new Html(req.originalUrl);
    const html_main = _sd.html_common('dashboard');

    res.render('index', {html_main});
});

module.exports = router;