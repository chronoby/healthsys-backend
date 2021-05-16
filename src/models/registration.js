'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RegistrationSchema = new Schema({
    doctor_id: { type: String, ref: 'user' },
    patient_id: { type: String, ref: 'user' },
    date: String,
    period: String,
    department: String,
    is_specialist: Boolean,
    is_finished: Boolean
});

var registrationModel = mongoose.model('registration', RegistrationSchema);

module.exports = registrationModel;
