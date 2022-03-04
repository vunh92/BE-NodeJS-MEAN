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
    var name=slug=parent=detail=img=img2=img3=err='', price=discount=0, flag=1, status, gallery=[], date_created, date_updated;

    const kq = new Admin();

    // lấy dữ liệu
    name=req.body.name;
    slug=req.body.slug;
    parent=req.body.parent;
    price=req.body.price;
    discount=req.body.discount;
    // gallery=req.body.gallery;
    status=req.body.status;
    detail=req.body.detail;
    img=req.body.img;
    img2=req.body.img2;
    img3=req.body.img3;
    date_created=req.body.date_created;
    date_updated=req.body.date_updated;
    // var galleryList = []
    // galleryList.push(img, img2, img3)
    gallery = [img, img2, img3]

    // kiểm tra dữ liệu
    if(name==''){
        flag=0;
        err='Vui lòng nhập Tên Sản Phẩm';
    } 
    const obj = {name, slug, parent, price, discount, gallery, status, detail, img, date_created};
    console.log(obj)

    // tổng hợp
    if(flag==1){
        productModel
        .find({slug})
        .exec((err, data)=>{
            if(err){
                res.send({kq:0, err});
            }else{
                if(data==''){
                    // const obj = {name, slug, parent, price, discount, gallery, status, detail, img, date_created, date_updated};
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