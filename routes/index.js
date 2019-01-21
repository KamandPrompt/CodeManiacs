var express = require('express');
var router = express.Router();
var request = require('request');
var userService = require('../authenticate');

router.get ("/", function (req, res){
    res.render("index");    
});

router.get('/rankings', function(req, res, next) {
  res.render('rankings', {page:'rankings', menuId:'rankings'});
});

router.get('/problemset', (req,res,next) => {
    res.render('problemset');
})
router.get('/question', (req,res) => {
    res.render('question');
})
router.get('/submit', (req,res)=> {
    res.render('Submit');
})
router.get ("/submitprob", (req, res) => {
    res.render ("submitprob");
})

router.post('/signup', function(req, res){
    var email = req.headers['email'];
    var password = req.headers['password'];
    userService.signUp(email, password,
        function(){
            res.status(201).send('User signed up');
        },function(err){
        if (err) {
            res.status(500).send(err);
        }
    });
});

router.post('/signin', function(req, res){
    var email = req.headers['email'];
    var password = req.headers['password'];
    userService.signIn(email, password,
        function(){
            res.status(200).send('User signed in');
        },function(err){
        if (err) {
            res.status(401).send(err);
        }
    });
});

router.post('/signout', function(req, res){
    userService.signOut(
        function(){
            res.status(200).send('User signed out');
        },function(err){
            if (err) {
                res.status(401).send(err);
            }
        });
});

module.exports = router;
