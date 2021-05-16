var express = require('express');
var router = express.Router();

var userController = require('../controllers/user');
var authJwt = require('../middleware/authJwt');

router.get('/new', authJwt.verifyToken, authJwt.getPermission, userController.queryNewDoctor);
router.post('/new', authJwt.verifyToken, authJwt.getPermission, userController.approveNewDoctor);
router.post('/addtime', userController.addAvailableDoctor);
router.post('/query', userController.queryDoctor);

module.exports = router;
