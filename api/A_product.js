const express = require('express')
const router = express.Router()

// Gọi model product
const productModel = require('../models/M_product');

// Gọi class Admin
const Admin = require('../core/admin');

// Lấy toàn bộ dữ liệu
router.get('/list', (req, res)=>{
    productModel
    .find()
    .exec((err, data)=>{
        if(err){
            res.send({kq:0, err});
        }else{
            res.send({kq:1, data});
        }
    })
});

// Lấy dữ liệu item
router.get('/get_item/:id', (req, res)=>{
    productModel
    .find({_id: req.params.id})
    .exec((err, data)=>{
        if(err){
            res.send({kq:0, err});
        }else{
            res.send({kq:1, data});
        }
    })
});

// thêm sản phẩm
router.post('/add', (req, res) => {
    // khai báo
    var name=slug=err='', price=0, parent, id_user, flag=1;

    const kq = new Admin();

    // lấy dữ liệu
    name=req.body.name;
    parent=req.body.parent;
    price=req.body.price;
    slug=kq.ChangeToSlug(name);

    // kiểm tra dữ liệu
    if(name==''){
        flag=0;
        err='Vui lòng nhập Tên Sản Phẩm';
    }

    // tổng hợp
    if(flag==1){
        productModel
        .find({name})
        .exec((err, data)=>{
            if(err){
                res.send({kq:0, err});
            }else{
                if(data==''){
                    const obj = {name, slug, price, parent};
                    // thêm
                    productModel
                    .create(obj, (err, data)=>{
                        if(err){
                            res.send({kq:0, err});
                        }else{
                            res.send({kq:1, data});
                        }
                    });
                }else{
                    res.send({kq:0, err: 'Sản phẩm đã tồn tại, vui lòng nhập thông tin khác.'});
                }
            }
        })
    }else{
        res.send({kq:0, err});
    }
})

// lấy danh sách sản phẩm theo id_category
router.get('/listProduct/:parent', (req, res) => {
    productModel
    .find({parent: req.params.parent})
    .exec((err, data)=>{
        if(err){
            res.send({kq:0, err})
        }else{
            if(data!=''){
                res.send({kq:1, data})
            }else{
                res.send({kq:0, err: 'Không tìm thấy dữ liệu'})
            }
        }
    })
})

// thông tin sản phẩm
router.get('/info/:slug', (req, res) => {
    productModel
    .find({slug: req.params.slug})
    .exec((err, data)=>{
        if(err){
            res.send({kq:0, err})
        }else{
            if(data!=''){
                res.send({kq:1, data})
            }else{
                res.send({kq:0, err: 'Không tìm thấy dữ liệu'})
            }
        }
    })
})

// sản phẩm liên quan
router.get('/related__products/:id_product/:id_category', (req, res) => {
    productModel
    .find({parent: req.params.id_category, _id: { $ne: req.params.id_product } })
    .exec((err, data)=>{
        if(err){
            res.send({kq:0, err})
        }else{
            if(data!=''){
                res.send({kq:1, data})
            }else{
                res.send({kq:0, err: 'Không tìm thấy dữ liệu'})
            }
        }
    })
})

module.exports = router;