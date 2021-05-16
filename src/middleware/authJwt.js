const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('../../config/config')

const User = mongoose.model('user');
const Doctor = mongoose.model('doctor');
//const Admin = mongoose.model('admin');

verifyToken = (req, res, next) => {
    var token = req.headers['token'];
    if(!token) {
        res.status(403).send({ message: 'No token privided'});
        return;
    }
    jwt.verify(token, config.token_secret_key, (err, decoded) => {
        if(err) {
            res.status(401).send({message: "Unauthorized!"});
            return;
        }
        req.idinToken = decoded.id;
        next();
    });
}

getPermission = (req, res, next) => {
    User.findById(req.idinToken).exec((err, user) => {
        if(err) {
            res.status(500).send({ message: err});
            return;
        }
        req.permissionInToken = user.type;
        next();
    });
}

const authJwt = {
    verifyToken,
    getPermission
};

module.exports = authJwt;
