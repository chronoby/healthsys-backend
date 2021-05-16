'use strict'

const mongoose = require('mongoose');
const userModel = mongoose.model('user');

exports.checkDuplicatePhong = (req, res, next) => {
    userModel.findOne({
        _id: req.body.userId
    }).exec((err, user) => {
        if(err) {
            res.status(500).send({message: err});
            return;
        }
        if(user) {
            res.status(400).send({registerData: {registerStatus: false, message: "Error! Phong number duplicated."}});
            return;
        }
        next();
    });
}
