const express = require('express')
const router = express.Router()

// Gọi model product
const productModel = require('../models/M_product');

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
    var list_roles = ['admin', 'user', 'guest'];

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
        obj_find = {trash: false, name: { $regex: '.*' + s + '.*' }};

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
    const kq_sumPage = await productModel.find({trash: false});
    const count_sumPage = Math.ceil(kq_sumPage.length/limit);

    // end pagination

    const _sd = new Html(req.originalUrl);

    // đếm sọt rác
    const kq_trash = await productModel.find({trash: true});
    const count_trash = kq_trash.length;

    productModel
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
                    name: e.name,
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
        {name: 'Điện Thoại Di Động', value: 'Điện Thoại Di Động'},
        {name: 'Máy Tính Bảng', value: 'Máy Tính Bảng'}
    ];

    // Tạo form: sau này tạo collection để chứa dữ liệu này
    const list_field_form = [
        {element: 'input', type: 'text', name: 'name', id: 'name', class: 'name', required: true, placeholder: '', disabled: false },
        {element: 'input', type: 'text', name: 'slug', id: 'slug', class: 'slug', required: true, placeholder: '', disabled: false },
        {element: 'select', type: '', name: 'parent', id: 'parent', class: 'parent', required: false, placeholder: '', disabled: false, array: list_array },
        {element: 'textarea', type: '', name: 'content', id: 'content', class: 'content', required: false, placeholder: '', disabled: false, ckefitor: true, rows: 5, cols: 5 },
    ];

    const module = _sd.get_module();

    const html_main = _sd.html_common('form', list_field_form, module);
    
    // kiểm tra js form
    const form = true;

    res.render('index', {html_main, module, form});
})

module.exports = router;