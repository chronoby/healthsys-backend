const mongoose = require('mongoose');
const Message = mongoose.model('message');
const User = mongoose.model('user');
const Doctor = mongoose.model('doctor');

exports.getMessage = (req, res) => {
    Message.findOne({
        _id: req.idinToken
    })
    .exec((err, docs) => {
        if (err) {
            // console.log(err);
            res.status(500).send({ status: false, message: err });
            return;
        }
        if(!docs) {
            res.status(200).send({ status: false, message: "用户不存在" });
            return;
        }
        var messs = [];
        for(var i = docs.message.length - 1; i >= 0 && i >= docs.message.length - 30; i--) {
            messs.push(docs.message[i]);
        }
        var resObj = {
            status: true,
            message: "查询成功",
            messageData: messs
        };
        res.status(200).send(resObj);
    })
};

exports.queryAllDoctor = (req, res) => {
    User.find({
        type: "doctor"
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

exports.queryAllPatient = (req, res) => {
    User.find({
        type: "user"
    })
    .exec((err, users) => {
        if (err) {
            res.status(500).send({ status: false, message: err });
            return;
        }
        var patients = [];
        for(var i = 0; i < users.length; i++) {
            var tmp = users[i];
            var tmpPatient = {
                userId: tmp._id,
                userName: tmp.username,
                userInfo: {
                    xingbie: tmp.gender
                }
            }
            patients.push(tmpPatient);
        }
        var resObj = {
            status: true,
            message: '查询成功',
            userInfo: patients
        }
        res.status(200).send(resObj);
    });
}
