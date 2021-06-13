'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const DoctorSchema = new Schema({
    _id: String,
    hospital_name: String,
    department: String,
    rank: String,
    age: Number,
    work_years: Number,
    description: String,
    avatar: String
});

var doctorModel = mongoose.model('doctor', DoctorSchema);

module.exports = doctorModel;
