var express = require('express');
var router = express.Router();
var config = require('config');
var fs = require('fs');

router.get('/', function(req, res) {
    res.render('index');
});

module.exports = router;