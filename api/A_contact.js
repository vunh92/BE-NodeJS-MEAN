const express = require('express')
const router = express.Router()

// Gọi model contact
const contactModel = require('../models/M_contact');

// thêm dữ liệu
router.post('/add', function (req, res) {
    // khai báo
    var name=email=phone=address=err='', flag=1;
    // lấy dữ liệu
    name=req.body.name;
    email=req.body.email;
    phone=req.body.phone;
    address=req.body.address;
    // kiểm tra dữ liệu
    if(name=='' || email=='' ){
        flag = 0
        error='Tên hoặc email không được rỗng';
    }

    // tổng hợp
    if(flag==1){
        const obj = {name, email, phone, address};
        contactModel
        .find({email: email})
        .exec((err, data)=>{
            if(err){
                res.send({kq:0, err: 'Thất bại'});
            }else{
                if(data==''){
                    contactModel
                    .create(obj, (err, data)=>{
                        if(err){
                            res.send({kq:0, err});
                        }else{
                            res.send({kq:1, data});
                        }
                    })
                }else{
                    res.send({kq:0, err: 'Contact đã tồn tại, vui lòng nhập tên khác.'});
                }
            }
        })
        
    }else{
        res.send({kq:0, err});
    }
})

module.exports = router;