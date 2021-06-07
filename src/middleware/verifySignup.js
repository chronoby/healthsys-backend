'use strict'

const mongoose = require('mongoose');
const userModel = mongoose.model('user');

exports.checkDuplicatePhong = (req, res, next) => {
    userModel.findOne({
        _id: req.body.userId
    }).exec((err, user) => {
        if(err) {
            res.status(500).send({ status: false, message: err });
            return;
        }
        if(user) {
            res.status(200).send({ status: false, message: "错误：手机号已注册，请直接登录！" });
            return;
        }
        next();
    });
}
