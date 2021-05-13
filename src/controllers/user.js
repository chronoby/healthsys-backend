'use strict'

const mongoose = require('mongoose');
const userModel = mongoose.model('user');
const doctorModel = mongoose.model('doctor');

exports.login = (req, res) => {
    user.findOne({
        _id: req.body.accountId
    })

};

exports.register = (req, res) => {
    const user = new userModel({
        _id: req.body.userId,
        username: req.body.userName,
        password: userModel.encryptPassword(req.body.password),
        type: req.body.userPermission,
        gender: req.body.userInfo.xingbie,
    });
    user.save((err, user) => {
        if(err) {
            res.status(500).send({message: err});
            return;
        }
        
    })
    if(req.body.userPermission == 'doctor') {
        const doctor = new doctorModel({
            _id: req.body.userId,
            hospital_name: req.body.userInfo.hospitalName,
            department: req.body.userInfo.keshi,
            rank: req.body.userInfo.zhicheng,
            description: '',
            status: false
        });    
    }
}