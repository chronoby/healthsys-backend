var express = require('express');
var router = express.Router();

// query doctor, new doctor

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
  next;
});

module.exports = router;
