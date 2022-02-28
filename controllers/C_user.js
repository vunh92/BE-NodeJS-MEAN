const express = require('express')
const router = express.Router()

// Gọi model user
const userModel = require('../models/M_user');

// Gọi bcrypt
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);

// Gọi class Html
const Html = require('../core/html');

router.get('/index(/:pageNumber)?', 

// check login
(req, res, next)=>{
    if(req.cookies.key == undefined){
        // trở về login
        res.redirect('/login');
    }else{
        next()
    }
},

// check vai trò
(req, res, next)=>{
    var list_roles = ['admin', 'user'];

    if(list_roles.indexOf(req.cookies.key.role) != -1 ){
        next()
    }else{
        // trở về login
        res.send('Bạn không có vai trò để vào trang này!');
    }
},

async (req, res)=>{
    // lấy get tìm kiếm sau ?
    const s = req.query.search;

    let obj_find;
    let str_s;

    if(s=='' || s==undefined)
    {
        // không tìm kiếm
        obj_find = {trash: false};

        // chuỗi tìm kiếm
        str_s='';
    }
    else
    {
        // có tìm kiếm
        obj_find = {trash: false, username: { $regex: '.*' + s + '.*' }};

        // chuỗi tìm kiếm
        str_s=s;
    }

    // pagination
    const pageNumber = req.params.pageNumber;

    let skip;
    const limit=2; // skip: 0 2 

    // xét số trang
    if(pageNumber==1 || pageNumber==undefined)
    {
        skip=0;
    }
    else
    {
        skip=(pageNumber-1)*limit;
    }

    // tổng số trang
    const kq_sumPage = await userModel.find({trash: false});
    const count_sumPage = Math.ceil(kq_sumPage.length/limit);

    // end pagination

    const _sd = new Html(req.originalUrl);

    // đếm sọt rác
    const kq_trash = await userModel.find({trash: true});
    const count_trash = kq_trash.length;

    userModel
    .find(obj_find)
    .sort({_id: -1})
    .limit(limit)
    .skip(skip)
    .exec((err, data)=>{
        if(err){
            res.send({kq:0, err});
        }else{

            const new_array=[];

            data.forEach(e=>{
                new_array.push({
                    _id: e._id,
                    name: e.username,
                    status: e.status
                })
            })

            const module = _sd.get_module();

            const html_main = _sd.html_common('table', new_array, _sd.get_module(), count_trash, str_s, count_sumPage);

            // kiểm tra js form
            const form = false;

            res.render('index', {html_main, module, form});
        }
    })
});

router.get('/add', (req, res) => {

    const _sd = new Html(req.originalUrl);

    const list_array = [
        {name: 'Admin', value: 'admin', selected: ''},
        {name: 'User', value: 'user', selected: ''},
        {name: 'Guest', value: 'guest', selected: 'selected'}
    ];

    // Tạo form: sau này tạo collection để chứa dữ liệu này
    const list_field_form = [
        {element: 'input', type: 'text', name: 'username', id: 'username', class: 'username', required: true, placeholder: '', disabled: false, changeSlug: false },
        {element: 'input', type: 'password', name: 'password', id: 'password', class: 'password', required: true, placeholder: '', disabled: false, changeSlug: false },
        {element: 'input', type: 'email', name: 'email', id: 'email', class: 'email', required: true, placeholder: '', disabled: false, changeSlug: false },
        {element: 'input', type: 'tel', name: 'phone', id: 'phone', class: 'phone', required: true, placeholder: '', disabled: false, changeSlug: false },
        {element: 'select', type: '', name: 'role', id: 'role', class: 'role', required: true, placeholder: '', disabled: false, array: list_array }
    ];

    const module = _sd.get_module();

    const html_main = _sd.html_common('form', list_field_form, module);
    
    // kiểm tra js form
    const form = true;

    res.render('index', {html_main, module, form});
})

// xử lý form
router.post('/processForm', function (req, res) {
    // khai báo
    var username=password=email=phone=role=error='', flag=1;

    // lấy dữ liệu
    username = req.body.username;
    password = req.body.password;
    email = req.body.email;
    phone = req.body.phone;
    role = req.body.role;

    // kiểm tra dữ liệu

    // tổng hợp
    if(flag==1){
        userModel
        .find({username})
        .exec((err, dataUsername)=>{
            if(err){
                res.send({kq:0, err});
            }else{
                // check username
                if(dataUsername==''){
                    userModel
                    .find({email})
                    .exec((err, dataEmail)=>{
                        if(err){
                            res.send({kq:0, err});
                        }else{
                            // check email
                            if(dataEmail==''){
                                userModel
                                .find({phone})
                                .exec((err, dataPhone)=>{
                                    if(err){
                                        res.send({kq:0, err});
                                    }else{
                                        // check phone
                                        if(dataPhone==''){
                                            // to hash a password
                                            var hash = bcrypt.hashSync(password, salt);

                                            // object để lưu vào collection
                                            const obj = {username, password: hash, email, phone, role};

                                            //console.log(obj);

                                            // thêm vào collection user
                                            userModel.create(obj, (err, data)=>{
                                                if(err){
                                                    res.send({kq:0, err});
                                                }else{
                                                    res.send({kq:1});
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
                    res.send({kq:0, err: 'Tên Đăng Nhập đã tồn tại'});
                }
            }
        })
    }else{
        res.send({kq:0, err: error});
    }
})

router.post('/delete', (req, res) => {
    var _id=err='', flag=1;
    
    _id=req.body.id;

    if(_id=='')
    {
        err='ID không được rỗng';
        flag=0;
    }

    if(flag==1)
    {
        userModel
        .find({_id})
        .exec((err, data)=>{
            if(err){
                res.send({kq:0, err});
            }else{
                if(data==''){
                    res.send({kq:0, err:'User không tồn tại'});
                }else{
                    userModel
                    .updateMany({_id}, {trash: true}, async (err)=>{
                        if(err){
                            res.send({kq:0, err});
                        }else{
                            // đếm sọt rác
                            const kq_trash = await userModel.find({trash: true});
                            const count_trash = kq_trash.length;

                            res.send({kq:1, count_trash});
                        }
                    })
                }
            }
        })
    }
    else
    {
        res.send({kq:0, err});
    }
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
                        // Tạo cookie để xác nhận đăng nhập
                        res.cookie('key', {username: user, role: data[0].role}, {maxAge: 60000*60}).send({kq:1, msg: 'Đăng nhập thành công'});
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

module.exports = router;