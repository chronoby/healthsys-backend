var express = require('express');
var userController = require('../controllers/user');
var authJwt = require('../middleware/authJwt');

var router = express.Router();

router.get('/', authJwt.verifyToken, userController.logout);

module.exports = router;
