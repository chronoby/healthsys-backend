const mongoose = require('mongoose');
const userModel = mongoose.model('user');

checkDuplicatePhong = (req, res, next) => {
    userModel.findOne({
        _id: req.body.accountId
    }).exec((err, user) => {
        if(err) {
            res.status(500).send({message: err});
            return;
        }
        if(user) {
            res.status(400).send({message: "Error! Phong number duplicated."});
            return;
        }
    });
}

module.exports = checkDuplicatePhong;