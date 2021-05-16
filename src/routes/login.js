var express = require('express');
var userController = require('../controllers/user');
var authJwt = require('../middleware/authJwt');

var router = express.Router();

router.get('/', authJwt.verifyToken, userController.login);
router.post('/', userController.login);

router.get('/status', authJwt.verifyToken, userController.getLoginStatus);

module.exports = router;
