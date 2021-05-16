'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AvailableDoctorSchema = new Schema({
    user_id: {type: String, ref: 'user'},
    department: String,
    date: String,
    period: String,
    left_count: Number,
    price: Number,
    is_specialist: Boolean
});

var availableDoctorModel = mongoose.model('available_doctor', AvailableDoctorSchema);

module.exports = availableDoctorModel;
