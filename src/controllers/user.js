'use strict'

const mongoose = require('mongoose');
const User = mongoose.model('user');
const Doctor = mongoose.model('doctor');
const AvailableDoctor = mongoose.model('available_doctor');
const Blacklist = mongoose.model('blacklist');
const config = require('../../config/config');
const jwt = require('jsonwebtoken');

exports.login = (req, res) => {
    // console.log(req.body);
    User.findOne({
        _id: req.body.userId
    })
    .populate('doctor_id')
    .exec((err, user) => {
        if (err) {
            // console.log(err);
            res.status(500).send({ status: false, message: err });
            return;
        }
        if(!user) {
            res.status(200).send({ status: false, message: "用户不存在" });
            return;
        }
        var isPasswordTrue = user.authenticate(req.body.password);
        if(!isPasswordTrue) {
            res.status(200).send({ status: false, message: "密码错误" });
            return;
        }
        var token = jwt.sign({id: user._id}, config.token_secret_key, {
            expiresIn: 86400 // 24 hours
        });
        var resObj = {
            status: true,
            message: "登录成功",
            token: token,
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
            resObj.userData.userInfo.age = user.doctor_id.age;
            resObj.userData.userInfo.workYears = user.doctor_id.work_years;
            resObj.userData.userInfo.description = user.doctor_id.description;
            resObj.userData.userInfo.avatar = user.doctor_id.avatar;
        }
        res.status(200).send(resObj);
    })
};

exports.getLoginStatus = (req, res) => {
    User.findOne({
        _id: req.idinToken
    })
    .populate('doctor_id')
    .exec((err, user) => {
        if (err) {
            // console.log(err);
            res.status(500).send({ status: false, message: err });
            return;
        }
        if(!user) {
            res.status(200).send({ status: false, message: "用户不存在" });
            return;
        }
        var resObj = {
            status: true,
            message: "登录成功",
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
            resObj.userData.userInfo.age = user.doctor_id.age;
            resObj.userData.userInfo.workYears = user.doctor_id.work_years;
            resObj.userData.userInfo.description = user.doctor_id.description;
            resObj.userData.userInfo.avatar = user.doctor_id.avatar;
        }
        res.status(200).send(resObj);
    })

};

exports.logout = (req, res) => {
    const invalidToken = new Blacklist({
        invalid_token: req.headers['token']
    });
    invalidToken.save((err, doc) => {
        if(err) {
            res.status(500).send({ status: false, message: err });
            return;
        }
        res.status(200).send({ status: true, message: "注销成功" });
    });
};

exports.register = (req, res) => {
    // console.log(req.body);
    if(req.body.userPermission == 'user' || req.body.userPermission == 'admin') {
        const user = new User({
            _id: req.body.userId,
            username: req.body.userName,
            type: req.body.userPermission,
            gender: req.body.userInfo.xingbie,
            status: true
        });
        user.encrypted_password = user.encryptPassword(req.body.password);
        user.save((err, user) => {
            if(err) {
                res.status(500).send({ status: false, message: err });
                return;
            }
            res.status(200).send({ status: true, message: "注册成功" });
        });
    } else if(req.body.userPermission == 'doctor') {
        const doctor = new Doctor({
            _id: new mongoose.Types.ObjectId(),
            hospital_name: req.body.userInfo.hospitalName,
            department: req.body.userInfo.keshi,
            rank: req.body.userInfo.zhicheng,
            age: req.body.userInfo.age,
            work_years: req.body.userInfo.workYears,
            description: req.body.userInfo.description,
            avatar: req.body.userInfo.avatar
        });
        doctor.save((err) => {
            if(err) {
                res.status(500).send({ status: false, message: err});
                return;
            }
            const user = new User({
                _id: req.body.userId,
                username: req.body.userName,
                type: req.body.userPermission,
                gender: req.body.userInfo.xingbie,
                doctor_id: doctor._id,
                status: false
            });
            user.encrypted_password = user.encryptPassword(req.body.password);

            user.save((err) => {
                if(err) {
                    res.status(500).send({ status: false, message: err });
                    return;
                }
                res.status(200).send({ status: true, message: "注册成功" });
            });
        });
    }
}

exports.UploadImage = (req, res) => {
    const { file: { filename, path } } = req;
    // console.log(filename);
    res.status(200).send({ status: true, message: "上传成功", value: filename });
}

exports.updateUserInfo = (req, res) => {
    var reqInfo = req.body.userInfo;
    var updateUserInfo = {};
    var updateDoctorInfo = {};
    var needUpdateDoctor = 0;
    var query;
    if(reqInfo.hasOwnProperty('xingbie')) {
        updateUserInfo.gender = reqInfo.xingbie;
    }
    if(reqInfo.hasOwnProperty('hospitalName')) {
        updateDoctorInfo.hospital_name = reqInfo.hospitalName;
        needUpdateDoctor = 1;
    }
    if(reqInfo.hasOwnProperty('keshi')) {
        updateDoctorInfo.department = reqInfo.keshi;
        needUpdateDoctor = 1;
    }
    if(reqInfo.hasOwnProperty('zhicheng')) {
        updateDoctorInfo.rank = reqInfo.zhicheng;
        needUpdateDoctor = 1;
    }
    if(reqInfo.hasOwnProperty('age')) {
        updateDoctorInfo.age = reqInfo.age;
        needUpdateDoctor = 1;
    }
    if(reqInfo.hasOwnProperty('workYears')) {
        updateDoctorInfo.work_years = reqInfo.workYears;
        needUpdateDoctor = 1;
    }
    if(reqInfo.hasOwnProperty('description')) {
        updateDoctorInfo.description = reqInfo.description;
        needUpdateDoctor = 1;
    }
    if(reqInfo.hasOwnProperty('avatar')) {
        updateDoctorInfo.avatar = reqInfo.avatar;
        needUpdateDoctor = 1;
    }
    if(req.body.userId === '') {
        query = {'_id': req.idinToken};
    } else if(req.permissionInToken == 'admin') {
        query = {'_id': req.body.userId};
    } else {
        res.status(403).send({ status: false, message: "无更新权限" });
        return;
    }
    
    User.findOneAndUpdate(query, updateUserInfo, null, (err, user) => {
        if(err) {
            res.status(500).send({ status: false, message: err });
            return;
        }
        if(needUpdateDoctor) {
            Doctor.findOneAndUpdate({ _id: user.doctor_id._id }, updateDoctorInfo, null, (err, user) => {
                if(err) {
                    res.status(500).send({ status: false, message: err });
                    return;
                }
                res.status(200).send({ status: true, message: "更新成功" });
            });
        } else {
            res.status(200).send({ status: true, message: "更新成功" });
        }
    });
}

exports.updatePassword = (req, res) => {
    User.findOne({
        _id: req.body.userId
    })
    .exec((err, user) => {
        if (err) {
            res.status(500).send({ status: false, message: err });
            return;
        }
        if(!user) {
            res.status(404).send({ status: false, message: "用户不存在" });
            return;
        }
        var isPasswordTrue = user.authenticate(req.body.oldPassword);
        if(!isPasswordTrue) {
            res.status(401).send({ status: false, message: "密码错误" });
            return;
        }
        user.encrypted_password = user.encryptPassword(req.body.newPassword);
        user.save((err) => {
            if(err) {
                res.status(500).send({ status: false, message: err });
                return;
            }
            res.status(500).send({ status: true, message: "更新成功" });
        });
    });
}

exports.queryNewDoctor = (req, res) => {
    if(req.permissionInToken != 'admin') {
        res.status(403).send({ status: false, message: "无查询权限" });
        return;
    }
    User.find({
        status: false
    })
    .populate('doctor_id')
    .exec((err, users) => {
        if (err) {
            res.status(500).send({ status: false, message: err });
            return;
        }
        var doctors = [];
        for(var i = 0; i < users.length; i++) {
            var tmp = users[i];
            var tmpDoctor = {
                userId: tmp._id,
                userName: tmp.username,
                userInfo: {
                    xingbie: tmp.gender,
                    hospitalName: tmp.doctor_id.hospital_name,
                    keshi: tmp.doctor_id.department,
                    zhicheng: tmp.doctor_id.rank,
                    age: tmp.doctor_id.age,
                    workYears: tmp.doctor_id.work_years,
                    description: tmp.doctor_id.description,
                    avatar: tmp.doctor_id.avatar
                }
            }
            doctors.push(tmpDoctor);
        }
        var resObj = {
            status: true,
            message: '查询成功',
            doctorInfo: doctors
        }
        res.status(200).send(resObj);
    });
}

exports.approveNewDoctor = (req, res) => {
    if(req.permissionInToken != 'admin') {
        res.status(403).send({ status: false, message: "无更新权限" });
        return;
    }
    User.updateMany(
        { _id: { $in: req.body.userId }},
        { $set: { status: true }},
        (err) => {
            if(err) {
                res.status(500).send({ status: false, message: err });
                return;
            }
            res.status(200).send({ status: true, message: "审核成功" })
        }
    )
}

exports.queryDoctor = (req, res) => {
    AvailableDoctor.find({
        department: req.body.keshi,
        date: req.body.date,
        period: req.body.wubie,
        is_specialist: req.body.isSpecialist
    })
    .populate({
        path: 'user_id',
        populate: {
            path: 'doctor_id'
        }})
    .exec((err, users) => {
        if (err) {
            res.status(500).send({ queryData: {queryStatus: false, message: err }});
            return;
        }
        //console.log(users);
        var doctors = [];
        for(var i = 0; i < users.length; i++) {
            var tmp = users[i];
            var tmpDoctor = {
                id: tmp.user_id._id,
                name: tmp.user_id.username,
                keshi: req.body.keshi,
                zhicheng: tmp.user_id.doctor_id.rank,
                xingbie: tmp.user_id.gender,
                age: tmp.user_id.doctor_id.age,
                workYears: tmp.user_id.doctor_id.work_years,
                description: tmp.user_id.doctor_id.description,
                avatar: tmp.user_id.doctor_id.avatar,
                hospitalName: tmp.user_id.doctor_id.hospital_name
            }
            doctors.push(tmpDoctor);
        }
        var resObj = {
            status: true,
            message: '查询成功',
            doctorInfo: doctors 
        }
        res.status(200).send(resObj);
    });
}

exports.addAvailableDoctor = (req, res) => {
    const available = new AvailableDoctor({
        user_id: req.body.userId,
        department: req.body.keshi,
        date: req.body.date,
        period: req.body.wubie,
        left_count: req.body.number,
        price: req.body.price,
        is_specialist: req.body.isSpecialist
    });
    available.save((err, ava) => {
        if(err) {
            res.status(500).send({ status: false, message: err });
            return;
        }
        res.status(200).send({ status: true, message: "添加成功" });
    });
}

exports.queryTime = (req, res) => {
    if(req.permissionInToken != 'doctor') {
        res.status(403).send({ status: false, message: "无查询权限" });
        return;
    }
    AvailableDoctor.find({user_id: req.idinToken})
    .exec((err, docs) => {
        if(err) {
            res.status(500).send({satus: false, message: err });
            return;
        }
        var times = [];
        for(var i = 0; i < docs.length; i++) {
            var tmp = docs[i];
            var tmpdoc = {
                keshi: tmp.department,
                date: tmp.date,
                wubie: tmp.period,
                number: tmp.left_count,
                price: tmp.price,
                isSpecialist: tmp.is_specialist
            }
            times.push(tmpdoc);
        }
        var resObj = {
            status: true,
		    message: "查询成功",
		    timeInfo: times
        }
        res.status(200).send(resObj);
    });
}
