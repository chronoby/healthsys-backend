var express = require('express');
var userController = require('../controllers/user');
var checkDuplicatePhong = require('../middleware/verifySignup')

var router = express.Router();

router.post(
    '/',
    userController.register);

module.exports = router;