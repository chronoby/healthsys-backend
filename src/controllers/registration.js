'use strict'

const mongoose = require('mongoose');
const Registration = mongoose.model('registration')
const User = mongoose.model('user');
const Doctor = mongoose.model('doctor');
const AvailableDoctor = mongoose.model('available_doctor');
const config = require('../../config/config')
const jwt = require('jsonwebtoken')

exports.createRegistration = (req, res) => {
    const registration = new Registration({
        doctor_id: req.body.doctorId,
        patient_id: req.body.userId,
        date: req.body.date,
        period: req.body.wubie,
        department: req.body.keshi,
        is_specialist: req.body.isSpecialist,
        is_finished: false
    });
    registration.save((err, doc) => {
        if(err) {
            res.status(500).send({ status: false, message: err });
            return;
        }
        res.status(200).send({ status: true, message: "挂号成功", registerData: { registrationId: doc._id }});
    });
}

exports.queryRegistrationInfo = (req, res) => {
    var query;
    if(req.permissionInToken == "doctor") {
        query = { doctor_id: req.idinToken };
    } else if(req.permissionInToken == "user") {
        query = { patient_id: req.idinToken };
    }
    Registration.find(query)
    .populate({
        path: 'doctor_id',
        populate: {
            path: 'doctor_id'
        }})
    .exec((err, docs) => {
        if(err) {
            res.status(500).send({satus: false, message: err });
            return;
        }
        var regs = [];
        for(var i = 0; i < docs.length; i++) {
            var tmp = docs[i];
            var tmpdoc = {
                registrationId: tmp._id,
                keshi: tmp.department,
                date: tmp.date,
                wubie: tmp.period,
                isSpecialist: tmp.is_specialist,
                doctorId: tmp.doctor_id._id,
                doctorName: tmp.doctor_id.username,
                hospitalName: tmp.doctor_id.doctor_id.hospital_name,
                isFinished: tmp.is_finished
            }
            regs.push(tmpdoc);
        }
        var resObj = {
            status: true,
		    message: "查询成功",
		    registrationInfo: regs
        }
        res.status(200).send(resObj);
    });
}

exports.queryPatientRegistration = (req, res) => {
    if(req.permissionInToken != 'doctor') {
        res.status(403).send({ status: false, message: "无查询权限" });
        return;
    }

    var query = { doctor_id: req.idinToken };
    var reqInfo = req.body;
    if(reqInfo.hasOwnProperty('date')) {
        query.date = reqInfo.date;
    }
    if(reqInfo.hasOwnProperty('wubie')) {
        query.period = reqInfo.wubie;
    }
    if(reqInfo.hasOwnProperty('isSpecialist')) {
        query.is_specialist = reqInfo.isSpecialist;
    }
    if(reqInfo.hasOwnProperty('isFinished')) {
        query.is_finished = reqInfo.isFinished;
    }
    Registration.find(query)
    .populate({
        path: 'doctor_id',
        populate: {
            path: 'doctor_id'
        }})
    .exec((err, docs) => {
        if(err) {
            res.status(500).send({satus: false, message: err });
            return;
        }
        var regs = [];
        for(var i = 0; i < docs.length; i++) {
            var tmp = docs[i];
            var tmpdoc = {
                registrationId: tmp._id,
                keshi: tmp.department,
                date: tmp.date,
                wubie: tmp.period,
                isSpecialist: tmp.is_specialist,
                doctorId: tmp.doctor_id._id,
                doctorName: tmp.doctor_id.username,
                hospitalName: tmp.doctor_id.doctor_id.hospital_name,
                isFinished: tmp.is_finished
            }
            regs.push(tmpdoc);
        }
        var resObj = {
            status: true,
		    message: "查询成功",
		    registrationInfo: regs
        }
        res.status(200).send(resObj);
    });
}
