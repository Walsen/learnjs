var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res) {
   res.redirect('/user/login');
});

router.get('/logout', function(req, res) {
    res.redirect('/user/logout');
});

module.exports = router;
