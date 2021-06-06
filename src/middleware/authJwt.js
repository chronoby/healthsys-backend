const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('../../config/config')

const User = mongoose.model('user');
const Blacklist = mongoose.model('blacklist')
// const Doctor = mongoose.model('doctor');
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

verifyTokenValidation = (req, res, next) => {
    var token = req.headers['token'];
    if(!token) {
        res.status(403).send({ message: 'No token privided'});
        return;
    }
    Blacklist.findOne({invalid_token: token}).exec((err, doc) => {
        if(err) {
            res.status(500).send({ message: err});
            return;
        }
        if(doc) {
            res.status(403).send({ message: 'Token invalid' });
            return;
        }
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
    verifyTokenValidation,
    getPermission
};

module.exports = authJwt;
