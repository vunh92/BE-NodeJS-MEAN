const express = require('express')
const router = express.Router()

// Gọi model user
const userModel = require('../models/M_user');
// Gọi model token
const tokenModel = require('../models/M_token');

// Gọi bcrypt
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);

// Gọi jsonwebtoken
const jwt = require('jsonwebtoken');
const secret = '@#%$ED';

// Gọi class Html
const Html = require('../core/html');

router.get('/info-user/:id_user', (req, res) => {
    userModel
    .find({_id: req.params.id_user})
    .exec((err, data)=>{
        if(err){
            res.send({kq:0, err})
        }else{
            res.send({kq:1, data})
        }
    })
})

router.get('/list', (req, res) => {
    userModel
    .find()
    .exec((err, data)=>{
        if(err){
            res.send({kq:0, err})
        }else{
            res.send({kq:1, data})
        }
    })
})


router.get('/token', (req, res) => {
    tokenModel
    .find()
    .exec((err, data)=>{
        if(err){
            res.send({kq:0, err})
        }else{
            res.send({kq:1, data})
        }
    })
})

router.get('/token/:token', (req, res) => {
    tokenModel
    .find({token: req.params.token})
    .exec((err, data)=>{
        if(err){
            res.send({kq:0, err})
        }else{
            res.send({kq:1, data})
        }
    })
})

// login
router.post('/login', (req, res) => {
    // khai báo
    var user, pass, error='', flag=1;

    // lấy dữ liệu
    user = req.body.username;
    pass = req.body.password;

    // kiểm tra dữ liệu
    if(user=='')
    {
        flag=0;
        error+='Vui lòng nhập Tên Đăng Nhập\n';
    }

    if(pass=='')
    {
        flag=0;
        error+='Vui lòng nhập Mật Khẩu\n';
    }

    // Tổng kết
    if(flag==1)
    {
        // Gọi database

        // check username
        userModel
        .find({username: user})
        .exec((err, data)=>{
            if(err){
                res.send({kq:0, err})
            }else{
                if(data==''){
                    res.send({kq:0, err: 'Đăng Nhập không thành công'})
                }else{
                    // sử dụng bcryptjs để kiểm tra mật khẩu
                    const check_password = bcrypt.compareSync(pass, data[0].password);

                    if(check_password == true)
                    {
                        jwt.sign({
                            _id: data[0]._id,
                            device: req.headers
                        }, secret, { expiresIn: 60 * 60 }, (err, token)=>{
                            if(err){
                                res.send({kq:0, err})
                            }else{
                                // Lưu token vào db
                                const obj = { id_user: data[0]._id, role: data[0].role,token };

                                tokenModel
                                .create(obj, (err, dataToken)=>{
                                    if(err){
                                        res.send({kq:0, err})
                                    }else{
                                        res.send({kq:1, token: dataToken})
                                    }
                                })
                            }
                        });
                    }
                    else
                    {
                        res.send({kq:0, err: 'Đăng Nhập không thành công'})
                    }
                }
            }
        })
    }
    else
    {
        res.send(error);
    }
})


// register
router.post('/register', async (req, res) => {
    // khai báo
    var username=password=email=phone=role=error='', flag=1;

    // lấy dữ liệu
    username = req.body.username;
    password = req.body.password;
    email = req.body.email;
    phone = req.body.phone;
    role = req.body.role;
    // kiểm tra dữ liệu
    if(username=='')
    {
        flag=0;
        error+='Vui lòng nhập Tên Đăng Nhập\n';
    }
    if(password=='')
    {
        flag=0;
        error+='Vui lòng nhập Mật Khẩu\n';
    }
    if(email=='')
    {
        flag=0;
        error+='Vui lòng nhập Email\n';
    }
    if(phone=='')
    {
        flag=0;
        error+='Vui lòng nhập Phone\n';
    }

    // Tổng kết
    if(flag==1)
    {
        // Gọi database
        // check username
        userModel
        .find({username})
        .exec((errUsername, dataUsername)=>{
            if(errUsername){
                res.send({kq:0, err: errUsername})
            }else{
                // check username
                if(dataUsername==''){
                    userModel
                    .find({email})
                    .exec((errEmail, dataEmail)=>{
                        if(errEmail){
                            res.send({kq:0, err: errEmail});
                        }else{
                             // check email
                             if(dataEmail==''){
                                userModel
                                .find({phone})
                                .exec((errPhone, dataPhone)=>{
                                    if(errPhone){
                                        res.send({kq:0, err: errPhone});
                                    }else{
                                        // check phone
                                        if(dataPhone==''){
                                            // to hash a password
                                            var hash = bcrypt.hashSync(password, salt);

                                            // object để lưu vào collection
                                            const obj = {username, password: hash, email, phone, role};

                                            // thêm vào collection user
                                            userModel.create(obj, (errAddUser, data)=>{
                                                if(errAddUser){
                                                    res.send({kq:0, err: errAddUser});
                                                }else{
                                                    res.send({kq:1, data})
                                                }
                                            })
                                        }else{
                                            res.send({kq:0, err: 'Số Điện Thoại đã tồn tại'});
                                        }
                                    }
                                })
                             }else{
                                res.send({kq:0, err: 'Email đã tồn tại'});
                            }
                        }
                    })
                }else{
                    res.send({kq:0, err: 'Tên Đăng Nhập đã tồn tại'})
                }
            }
        })
    }
    else
    {
        res.send(error);
    }
})

module.exports = router;