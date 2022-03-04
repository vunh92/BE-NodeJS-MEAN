const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

// Gọi model ship
const shipModel = require('../models/M_ship');

// Gọi model cart
const cartModel = require('../models/M_cart');

// Lấy dữ liệu theo id_user
router.get('/get_list/:id_user', (req, res) => {
    shipModel
        .find({ id_user: req.params.id_user })
        .exec((err, data) => {
            if (err) {
                res.send({ kq: 0, err });
            } else {
                res.send({ kq: 1, data });
            }
        })
});

// Lấy dữ liệu item theo id_user
// router.get('/get_item/:id_user/:id_product', (req, res)=>{
//     shipModel
//     .find({id_user: req.params.id_user, id_product: req.params.id_product})
//     .exec((err, data)=>{
//         if(err){
//             res.send({kq:0, err});
//         }else{
//             if(data==''){
//                 res.send({kq:0, err: 'Không tìm thấy sp'});
//             }else{
//                 res.send({kq:1, data});
//             }
//         }
//     })
// });

// thêm
router.post('/add', function (req, res) {
    // khai báo
    var array_cart = [], id_user = id_cart = error = '', pay = 0, flag = 1;
    // lấy dữ liệu
    id_user = req.body.id_user;
    pay = req.body.pay;
    array_cart = req.body.array_cart.split(",");

    // kiểm tra dữ liệu
    var obj = {};
    if (id_user == '' || array_cart.leght == 0) {
        flag = 0;
        error = 'Không thể thanh toán!';
    } else {
        flag = 1;
        obj['array_cart'] = array_cart;
        obj['id_user'] = id_user;
        obj['pay'] = pay;
    }

    // tổng hợp
    if (flag == 1) {
        shipModel
            .create(obj, (err, data) => {
                if (err) {
                    res.send({ kq: 0, err });
                } else {
                    cartModel
                        .deleteMany({_id:array_cart}, (err2, data2)=>{
                            if(err2){
                                res.send({kq:0, err2});
                            }else{
                                if(data2['deletedCount'] < array_cart.length){
                                    res.send({kq:0, data2});
                                }else {
                                    res.send({kq:1, data2});
                                }
                            }
                        })
                    // res.send({ kq: 1, data });
                }
            });
    } else {
        res.send({ kq: 0, err: error });
    }
})

// Xóa dữ liệu theo id_user
// router.post('/delete', (req, res)=>{

//     // khai báo
//     var error='', qty=0, flag=1;
//     // lấy dữ liệu
//     var _id = req.body.id

//     // kiểm tra dữ liệu
//     // var obj={};
//     if(_id == ''){
//         flag=0;
//         error='_id không được rỗng';
//     }else{
//         flag=1;
//     }

//     // tổng hợp
//     if(flag==1){
//     shipModel
//         .find({_id: _id})
//         .exec((err, data)=>{
//             if(err){
//                 res.send({kq:0, err});
//             }else{
//                 if(data==''){
//                     res.send({kq:0, err: 'Xóa thất bại!'});
//                 }else{
//                     shipModel
//                     .deleteOne({_id}, (err, data)=>{
//                         if(err){
//                             res.send({kq:0, err});
//                         }else{
//                             if(data['deletedCount'] == 0){
//                                 res.send({kq:0, data});
//                             }else {
//                                 res.send({kq:1, data});
//                             }
//                         }
//                     });
//                 }
//             }
//         })
//     }else{
//         res.send({kq:0, err: error});
//     }
// });

module.exports = router;