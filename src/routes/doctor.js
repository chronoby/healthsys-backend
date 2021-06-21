var express = require('express');
var router = express.Router();

var userController = require('../controllers/user');
var authJwt = require('../middleware/authJwt');

router.get('/new', authJwt.verifyTokenValidation, authJwt.verifyToken, authJwt.getPermission, userController.queryNewDoctor);
router.post('/new', authJwt.verifyTokenValidation, authJwt.verifyToken, authJwt.getPermission, userController.approveNewDoctor);
router.post('/addtime', userController.addAvailableDoctor);
router.post('/deletetime', authJwt.verifyTokenValidation, authJwt.verifyToken, authJwt.getPermission, userController.deleteTime);
router.get('/time', authJwt.verifyTokenValidation, authJwt.verifyToken, authJwt.getPermission, userController.queryTime);
router.post('/query', userController.queryDoctor);

module.exports = router;
