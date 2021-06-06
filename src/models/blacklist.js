'use strict';

const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const Schema = mongoose.Schema;

// Blacklist 存储所有已被注销且未过期的 token
const BlacklistSchema = new Schema({
    invalid_token: String
}, {timestamps: true});

BlacklistSchema.index({createdAt: 1}, {expireAfterSeconds: 86400});
var BlacklistModel = mongoose.model('blacklist', BlacklistSchema);

module.exports = BlacklistModel;
