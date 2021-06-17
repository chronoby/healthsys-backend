var express = require('express');
var messageController = require('../controllers/message');
var authJwt = require('../middleware/authJwt');

var router = express.Router();

router.get('/', authJwt.verifyTokenValidation, authJwt.verifyToken, messageController.getMessage);

module.exports = router;
