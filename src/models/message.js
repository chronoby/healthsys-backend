'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    _id: String,
    message: [{
        content: String,
        opposite: String,
        in_out: String, // in, out
        time: Date,
        sendStatus: Boolean
    }]
});

var messageModel = mongoose.model('message', MessageSchema);

module.exports = messageModel;
