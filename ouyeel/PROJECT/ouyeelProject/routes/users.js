var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../model/user');
var mongoose = require('mongoose');
var config = require('../config');
var db = require('../model/datebase');
var CoreDataModel = require('../model/coredatamodel');
var BC = require('../blockchain/bcoperation');
var AccountBalance = require('../model/accountbalance');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.post('/register', function(req, res) {
    console.log("username: " + req.body.username);
    User.register(new User({ username : req.body.username,
            role: req.body.role,
        password: req.body.password}),
        req.body.password, function(err, user) {
            if (err) {
                res.set('Access-Control-Allow-Origin','*');
                return res.status(200).json({err: err});
            }
            passport.authenticate('local')(req, res, function () {
                res.set('Access-Control-Allow-Origin','*');
                var code = new AccountBalance({
                    username: req.body.username,
                    role:req.body.role,
                    rmbBalance: req.body.rmbBalance,
                    balance: req.body.balance
                });
                code.save(function (err, doc) {
                    if(err != null){
                        console.log("save verify code failed");
                    }
                    console.log("/**************** save accountBalance *******************" + doc.status);
                    console.log(doc);
                });

/**
 * modify by wangyi on 17/8/27.
 */

                BC.createCustomerAccount({"username":req.body.username, "role":req.body.role, "balance":req.body.balance}, function (err, data) {
                    console.log(data);
                });
                return res.status(200).json({status: 'Registration Successful!'});
            });
        });
});

router.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            // res.set('Access-Control-Allow-Origin','*');
            return res.status(200).json({
                err: '用户名或密码错误！'
            });
        }
        req.logIn(user, function(err) {
            if (err) {
                // res.set('Access-Control-Allow-Origin','*');
                return res.status(500).json({
                    err: 'Could not log in user'
                });
            }

            console.log(user);
        if (user.role=="1"){
            CoreDataModel.find({'userId': user.username}, function (err, docs) {
                console.log(docs);
                // res.set('Access-Control-Allow-Origin','*');
                AccountBalance.findOne({"username": user.username},function (err, doc) {
                    res.status(200).json({
                        id: user._id,
                        username: user.username,
                        role: doc.role,
                        status: 'Login successful!',
//                        data: docs,
                        rmbBalance: doc.rmbBalance,
                        balance: doc.balance,
                        success: true
                    });
                });
            });}
            else {
            CoreDataModel.find({'userId': user.username}, ['state', 'type', 'userId', 'money'], function (err, docs) {
                console.log(docs);
                // res.set('Access-Control-Allow-Origin','*');
                AccountBalance.findOne({"username": user.username},function (err, doc) {
                    res.status(200).json({
                        id: user._id,
                        username: user.username,
                        role: doc.role,
                        status: 'Login successful!',
//                        data: docs,
                        rmbBalance: doc.rmbBalance,
                        balance: doc.balance,
                        success: true
                    });
                });
            });

            }
        });
    })(req,res,next);
});

// router.post('/changeverifycode', function (req, res, next) {
//    VerifyCode.update({username: req.body.username}, {$set: {verifyCode: req.body.verifyCode}}, function (err, doc) {
//        if(err == null){
//            console.log(doc);
//            BC.addVerifyCode({"id":req.body.username, "verifyCode":req.body.verifyCode}, function (err, data) {
//                console.log("BC_OPERATION: " + "add verify success" + " : " + req.body.username);
//                console.log(data);
//            });
//        }
//        res.json(doc);
//    }) 
// });

router.post('/getaccountBalance', function (req, res, next) {
    AccountBalance.findOne({"username": req.body.username}, function (err, doc) {
        if(err == null)
            res.json(doc);
    })
});

router.get('/logout', function(req, res) {
    req.logout();
    res.status(200).json({
        status: 'Bye!'
    });
});

module.exports = router;