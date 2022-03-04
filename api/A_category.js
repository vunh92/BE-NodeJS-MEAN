const express = require('express')
const router = express.Router()

// Gọi model category
const categoryModel = require('../models/M_category');

// Gọi class Admin
const Admin = require('../core/admin');

// list category
router.get('/list', (req, res)=>{
    categoryModel
    .find()
    .exec((err, data)=>{
        if(err){
            res.send({kq:0, err});
        }else{
            res.send({kq:1, data});
        }
    })
});

// aside
router.get('/aside', (req, res)=>{
    var d = [];
    categoryModel
    .find({trash: false})
    .exec((err, data)=>{
        if(err){
            res.send({kq:0, err});
        }else{
            const kq = new Admin();

            data.forEach(e => {
                var parent=(e.parent==null) ? '' : e.parent;
                d.push({ 
                    _id: e._id.toString(),
                    name: e.name,
                    slug: e.slug,
                    parent
                })
            });

            res.send({kq:1, data: kq.dequy(d)});
        }
    })
});

// thêm
router.post('/add', function (req, res) {
    // khai báo
    var name=slug=error='', parent, id_user, flag=1;
    
    const kq = new Admin();

    // lấy dữ liệu
    name=req.body.name;
    slug=kq.ChangeToSlug(name);
    parent=req.body.parent;
    // kiểm tra dữ liệu
    var obj={};

    if(name==''){
        flag=1;
        error='Danh mục không được rỗng';
    }else{
        obj['name'] = name;
        obj['slug'] = slug;
    }

    if(parent!='') obj['parent'] = parent;

    // tổng hợp
    if(flag==1){
        categoryModel
        .find({name})
        .exec((err, data)=>{
            if(err){
                res.send({kq:0, err});
            }else{
                if(data==''){
                    categoryModel
                    .create(obj, (err, data)=>{
                        if(err){
                            res.send({kq:0, err});
                        }else{
                            res.send({kq:1, data});
                        }
                    });
                }else{
                    res.send({kq:0, err: 'Danh mục đã tồn tại, vui lòng nhập tên khác.'});
                }
            }
        })
    }else{
        res.send({kq:0, err: error});
    }
})

// lấy id danh mục dựa vào slug
router.get('/getid/:slug', function (req, res) {
    categoryModel
    .find({slug: req.params.slug})
    .exec((err, data)=>{
        if(err){
            res.send({kq:0, err})
        }else{
            if(data!=''){
                res.send({kq:1, data: data[0]._id})
            }else{
                res.send({kq:0, err: 'Không tìm thấy dữ liệu'})
            }
        }
    })
})

module.exports = router;