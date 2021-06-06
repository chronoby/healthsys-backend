var express = require('express');
var router = express.Router();

var regController = require('../controllers/registration');
var authJwt = require('../middleware/authJwt')

router.get('/', authJwt.verifyTokenValidation, authJwt.verifyToken, authJwt.getPermission, regController.queryRegistrationInfo);
router.post('/', regController.createRegistration);

module.exports = router;
