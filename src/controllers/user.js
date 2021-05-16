'use strict'

const mongoose = require('mongoose');
const User = mongoose.model('user');
const Doctor = mongoose.model('doctor');
const config = require('../../config/config')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

exports.login = (req, res) => {
    User.findOne({
        _id: req.body.accountId
    })
    .populate('doctor_id')
    .exec((err, user) => {
        if (err) {
            console.log(err);
            res.status(500).send({ loginData: {loginStatus: false, message: err }});
            return;
        }
        if(!user) {
            res.status(404).send({ loginData: {loginStatus: false, message: "用户不存在" }});
            return;
        }
        var isPasswordTrue = user.authenticate(req.body.password);
        if(!isPasswordTrue) {
            res.status(401).send({ loginData: {loginStatus: false, message: "密码错误" }});
            return;
        }
        var token = jwt.sign({id: user._id}, config.token_secret_key, {
            expiresIn: 86400 // 24 hours
        });
        var resObj = {
            loginData: {
                loginStatus: true,
                message: "登录成功"
            },
            userData: {
                userId: user._id,
                userName: user.username,
                userPermission: user.type,
                userStatus: user.status,
                userInfo: {
                    xingbie: user.gender
                } 
            }
        };
        if(user.type == 'doctor') {
            resObj.userData.userInfo.hospitalName = user.doctor_id.hospital_name;
            resObj.userData.userInfo.keshi = user.doctor_id.department;
            resObj.userData.userInfo.zhicheng = user.doctor_id.rank;
        }
        res.status(200).send(resObj);
    })

};

exports.register = (req, res) => {
    if(req.body.userPermission == 'user') {
        const user = new User({
            _id: req.body.userId,
            username: req.body.userName,
            type: req.body.userPermission,
            gender: req.body.userInfo.xingbie,
        });
        user.encrypted_password = user.encryptPassword(req.body.password);
        user.save((err, user) => {
            if(err) {
                res.status(500).send({registerData: {registerStatus: false, message: err}});
                return;
            } else {
                res.send({registerData:{ registerStatus: true, message: "注册成功"}});
            }
        });
    } else if(req.body.userPermission == 'doctor') {
        const doctor = new Doctor({
            _id: new mongoose.Types.ObjectId(),
            hospital_name: req.body.userInfo.hospitalName,
            department: req.body.userInfo.keshi,
            rank: req.body.userInfo.zhicheng,
            description: '',
            status: false
        });
        doctor.save((err) => {
            if(err) {
                res.status(500).send({registerData: {registerStatus: false, message: err}});
                return;
            }
            const user = new User({
                _id: req.body.userId,
                username: req.body.userName,
                type: req.body.userPermission,
                gender: req.body.userInfo.xingbie,
                doctor_id: doctor._id
            });
            user.encrypted_password = user.encryptPassword(req.body.password);

            user.save((err) => {
                if(err) {
                    res.status(500).send({registerData: {registerStatus: false, message: err}});
                    return;
                }
                res.send({registerData: {registerStatus: true, message: "注册成功"}});
            });
        });
    }
}

exports.updateUserInfo = (req, res) => {
    if(req.body.userId === '') {
        
    }
}
