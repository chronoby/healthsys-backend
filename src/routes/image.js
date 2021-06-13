var express = require('express');
var userController = require('../controllers/user');
var authJwt = require('../middleware/authJwt');
var multer  = require('multer');
var path = require('path');
const { v4: uuidv4 } = require('uuid');

var storage = multer.diskStorage({
    destination: 'public/images',
    filename: function (req, file, cb) {
        cb(null, uuidv4() + path.extname(file.originalname));
    }
});
  
var upload = multer({ storage: storage })

var router = express.Router();

router.post('/', upload.single('avatar'), userController.UploadImage);

module.exports = router;
