var express = require('express');
var router = express.Router();
var authJwt = require('../middleware/authJwt');
var userController = require('../controllers/user');

router.post('/updateinfo', authJwt.verifyTokenValidation, authJwt.verifyToken, authJwt.getPermission, userController.updateUserInfo);

router.post('/updatepassword', authJwt.verifyTokenValidation, authJwt.verifyToken, userController.updatePassword);

module.exports = router;
