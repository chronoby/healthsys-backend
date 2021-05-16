var express = require('express');
var userController = require('../controllers/user');
var verifySignup = require('../middleware/verifySignup')

var router = express.Router();

router.post(
    '/',
    verifySignup.checkDuplicatePhong,
    userController.register);
module.exports = router;