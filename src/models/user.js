'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    _id: String,
    doctor_id: {type: Schema.Types.ObjectId, ref: 'doctor'},
    username: String,
    encrypted_password: String,
    type: String,
    gender: Number,
    status: Boolean
});

UserSchema.methods = {
    /**
     * Check if the passwords are the same
     *
     * @param {String} password
     * @return {Boolean}
     * @api public
     */
  
    authenticate: function(password) {
        return bcrypt.compareSync(password, this.encrypted_password);
    },
  
    /**
     * Encrypt password
     *
     * @param {String} password
     * @return {String}
     * @api public
     */
  
    encryptPassword: function(password) {
        if (!password) return '';
        try {
            return bcrypt.hashSync(password, 10);
        } catch (err) {
            return '';
        }
    }
};

var userModel = mongoose.model('user', UserSchema);

module.exports = userModel;
