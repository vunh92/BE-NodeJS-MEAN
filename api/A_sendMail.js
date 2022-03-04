const express = require('express')
const router = express.Router()

// thêm dữ liệu
router.get('/:email', (req, res) => {
    // khai báo
    var email='', flag=1;
    // lấy dữ liệu
    email=req.params.email;
    // kiểm tra dữ liệu
    if(email=='' ){
        flag = 0
        error='Email không được rỗng';
    }

    console.log(email)
    // tổng hợp
    if(flag==1){
        /**
         * cài đặt nodemailer:
         * - npm install nodemailer
         */
        var nodemailer = require('nodemailer');
        //Cài đặt emial gửi tin
        //1. bật POP/IMAP
        //2. Bật quyền truy cập bên thứ 3

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'huuvu1992hk@gmail.com',
                pass: 'QuocNhat@2007'
            }
        });

        //Thông tin người nhận và phản hồi
        var mailOptions = {
            from: 'huuvu1992hk@gmail.com',
            to: email,
            subject: 'Sending Email using Node.js',
            text: 'Nội dung email: Lấy lại mật khẩu'
        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
                res.send({kq:0, error: 'Lỗi. Không gửi được mail'})
            } else {
                console.log('Email sent: ' + info.response);
                res.send({kq:1, data: 'Gửi mail thành công. Vui lòng kiểm tra lại mail!'})
            }
        });
    }else{
        res.send({kq:0, err});
    }
})

module.exports = router;