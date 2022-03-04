const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

// Gọi model like
const likeModel = require('../models/M_like');

// Gọi model token
const tokenModel = require('../models/M_token');

// Gọi class Admin
const Admin = require('../core/admin');

// Lấy dữ liệu theo id_user
router.get('/get_list/:id_user', (req, res)=>{
    likeModel
    .find({id_user: req.params.id_user})
    .exec((err, data)=>{
        if(err){
            res.send({kq:0, err});
        }else{
            res.send({kq:1, data});
        }
    })
});

// Lấy dữ liệu item theo id_user
router.get('/get_item/:id_user/:id_product', (req, res)=>{
    likeModel
    .find({id_user: req.params.id_user, id_product: req.params.id_product})
    .exec((err, data)=>{
        if(err){
            res.send({kq:0, err});
        }else{
            if(data==''){
                res.send({kq:0, err: 'Không tìm thấy sp'});
            }else{
                res.send({kq:1, data});
            }
        }
    })
});

// thêm
router.post('/add', function (req, res) {
    // khai báo
    var name=id_product=error='', price=qty=0, id_user, flag=1;
    // lấy dữ liệu
    id_product=req.body.id_product;
    name=req.body.name;
    id_user=req.body.id_user;
    price=req.body.price;
    img=req.body.img;

    // kiểm tra dữ liệu
    var obj={};
    if(name==''){
        flag=0;
        error='Tên sp không được rỗng';
    }else{
        flag=1;
        obj['name'] = name;
        obj['id_product'] = id_product;
        obj['id_user'] = id_user;
        obj['price'] = price;
        obj['img'] = img;
    }

    // tổng hợp
    if(flag==1){
        likeModel
        .find({id_product: mongoose.Types.ObjectId(id_product), id_user: mongoose.Types.ObjectId(id_user)})
        .exec((err, data)=>{
            if(err){
                res.send({kq:0, err});
            }else{
                if(data==''){
                    likeModel
                    .create(obj, (err2, data2)=>{
                        if(err2){
                            res.send({kq:0, err2});
                        }else{
                            res.send({kq:1, data2});
                        }
                    });
                }else{
                    res.send({kq:0, err: 'SP đã thích!'});
                }
            }
        })
    }else{
        res.send({kq:0, err: error});
    }
})

// Xóa dữ liệu theo id_user
router.post('/delete', (req, res)=>{

    // khai báo
    var error='', qty=0, flag=1;
    // lấy dữ liệu
    var _id = req.body.id

    // kiểm tra dữ liệu
    // var obj={};
    if(_id == ''){
        flag=0;
        error='_id không được rỗng';
    }else{
        flag=1;
    }

    // tổng hợp
    if(flag==1){
    likeModel
        .find({_id: _id})
        .exec((err, data)=>{
            if(err){
                res.send({kq:0, err});
            }else{
                if(data==''){
                    res.send({kq:0, err: 'Xóa thất bại!'});
                }else{
                    likeModel
                    .deleteOne({_id}, (err, data)=>{
                        if(err){
                            res.send({kq:0, err});
                        }else{
                            if(data['deletedCount'] == 0){
                                res.send({kq:0, data});
                            }else {
                                res.send({kq:1, data});
                            }
                        }
                    });
                }
            }
        })
    }else{
        res.send({kq:0, err: error});
    }
});

module.exports = router;