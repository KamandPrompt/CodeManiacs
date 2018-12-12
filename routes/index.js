var express = require('express');
var router = express.Router();
var request = require('request');

router.get('/', (req, res, next) => {
    res.send('Welcome CodeManiacs');
});


module.exports = router;