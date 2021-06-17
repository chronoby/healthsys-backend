const mongoose = require('mongoose');
const Message = mongoose.model('message');

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
        var resObj = {
            status: true,
            message: "查询成功",
            messageData: docs.message
        };
        res.status(200).send(resObj);
    })
};