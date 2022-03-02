const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000

const domain = 'http://localhost:4200'
// const domain = 'https://fe-angular-mean.vercel.app' //or *

// cho phép domain sử dụng api
app.use((req, res, next)=>{
    res.setHeader('Access-Control-Allow-Origin', domain);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

const bodyParser = require('body-parser')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// Cài đặt đường dẫn tĩnh
app.use(express.static(__dirname + '/public'));

// Gọi cookie
var cookieParser = require('cookie-parser')
app.use(cookieParser())

// Sử dụng ejs
app.set('view engine', 'ejs')

// Gọi database
require('./core/database');

// Gọi control để gọi các controllers
app.use('/', require('./core/control'))

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))
// app.listen(process.env.PORT, () =>
//   console.log(`Example app listening on port ${PORT}!`)
// );