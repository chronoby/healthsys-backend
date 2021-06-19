var express = require('express');
var messageController = require('../controllers/message');
var authJwt = require('../middleware/authJwt');

var router = express.Router();

router.get('/', authJwt.verifyTokenValidation, authJwt.verifyToken, messageController.getMessage);
router.get('/doctor', authJwt.verifyTokenValidation, authJwt.verifyToken, messageController.queryAllDoctor);
router.get('/user', authJwt.verifyTokenValidation, authJwt.verifyToken, messageController.queryAllPatient);

module.exports = router;
