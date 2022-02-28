const express = require('express')
const router = express.Router()

// Gọi model category
const categoryModel = require('../models/M_category');

// Gọi model user
const userModel = require('../models/M_user');

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
        obj_find = {trash: false, username: { $regex: '.*' + s + '.*' }};

        // chuỗi tìm kiếm
        str_s=s;
    }

    const _sd = new Html(req.originalUrl);

    // đếm sọt rác
    const kq_trash = await categoryModel.find({trash: true});
    const count_trash = kq_trash.length;

    categoryModel
    .find(obj_find)
    .sort({_id: -1})
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

            const html_main = _sd.html_common('table', new_array, _sd.get_module(), count_trash, str_s, 0);

            // kiểm tra js form
            const form = false;

            res.render('index', {html_main, module, form});
        }
    })
});

router.get('/add', (req, res) => {

    const _sd = new Html(req.originalUrl);

    categoryModel
    .find()
    .exec((err, data)=>{
        if(err){
            res.send({kq:0, err})
        }else{
            const module = _sd.get_module();

            // Tạo form: sau này tạo collection để chứa dữ liệu này
            const list_field_form = [
                {element: 'input', type: 'text', name: 'name', id: 'name', class: 'name', required: true, placeholder: '', disabled: false, changeSlug: true },
                {element: 'input', type: 'text', name: 'slug', id: 'slug', class: 'slug', required: true, placeholder: '', disabled: false, changeSlug: false },
                {element: 'select', type: '', name: 'parent', id: 'parent', class: 'parent', required: false, placeholder: '', disabled: false, array: _sd.html_dequy(data), dequy: true},
                {element: 'textarea', type: '', name: 'content', id: 'content', class: 'content', required: false, placeholder: '', disabled: false, ckefitor: true, rows: 5, cols: 5 },
            ];

            const html_main = _sd.html_common('form', list_field_form, module);
            
            // kiểm tra js form
            const form = true;

            res.render('index', {html_main, module, form});
        }
    })
})

// xử lý form
router.post('/processForm', function (req, res) {
    // khai báo
    var name=slug=parent=content=error='', flag=1;

    // lấy dữ liệu
    name = req.body.name;
    slug = req.body.slug;
    parent = req.body.parent;

    // kiểm tra dữ liệu

    // tổng hợp
    if(flag==1){
        categoryModel
        .find({name})
        .exec((err, dataName)=>{
            if(err){
                res.send({kq:0, err});
            }else{
                // check name
                if(dataName==''){
                    categoryModel
                    .find({slug})
                    .exec((err, dataSlug)=>{
                        if(err){
                            res.send({kq:0, err});
                        }else{
                            // check slug
                            if(dataSlug==''){
                                userModel
                                .find({username: req.cookies.key.username})
                                .exec((err, data)=>{
                                    if(err){
                                        res.send({kq:0, err})
                                    }else{
                                        if(data==''){
                                            res.send({kq:0, err: 'Thành viên không tồn tại.'})
                                        }else{
                                            // object để lưu vào collection
                                            const obj = {name, slug, parent, content, id_user: data[0]._id};

                                            // Thêm dữ liệu vào db
                                            categoryModel
                                            .create(obj, (err, data)=>{
                                                if(err){
                                                    res.send({kq:0, err})
                                                }else{
                                                    res.send({kq:1, data})
                                                }
                                            })
                                        }
                                    }
                                })
                            }else{
                                res.send({kq:0, err: 'Slug đã tồn tại'});
                            }
                        }
                    })
                }else{
                    res.send({kq:0, err: 'Tên đã tồn tại'});
                }
            }
        })
    }else{
        res.send({kq:0, err: error});
    }
})

module.exports = router;

// test đệ quy
// const arr = [
//     { name: 'A', parent: '' }, // cấp 0
//     { name: 'B', parent: '' },

//     { name: 'A1', parent: 'A' }, // cấp 1
//     { name: 'A2', parent: 'A' },
//     { name: 'A3', parent: 'A' },

//     { name: 'A11', parent: 'A1' }, // cấp 2
//     { name: 'A12', parent: 'A1' },
//     { name: 'A13', parent: 'A1' },

//     { name: 'A21', parent: 'A2' }, // cấp 2
//     { name: 'A22', parent: 'A2' },
//     { name: 'A23', parent: 'A2' },
// ]

/*
    [
        {
            name: 'A',
            parent: [
                {
                    name: 'A1',
                    parent: [
                        { name: 'A11', parent: 'A1' },
                        { name: 'A12', parent: 'A1' },
                        { name: 'A13', parent: 'A1' }
                    ]
                }, 
                {
                    name: 'A2',
                    parent: [
                        { name: 'A21', parent: 'A2' },
                        { name: 'A22', parent: 'A2' },
                        { name: 'A23', parent: 'A2' },
                    ]
                },
                { name: 'A3', parent: 'A' }
            ]
        },
        {
            name: 'B'
        }
    ]
*/