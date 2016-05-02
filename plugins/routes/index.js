"use strict";
var contentstack = require('contentstack-express');
var Built = require('built.io')
var Stack = contentstack.Stack()
var util = require('util')
var built = require(process.cwd() + '/lib/built-interact')

module.exports = function Routes() {


    var options = Routes.options;
    Routes.templateExtends = function(engine) {};
    Routes.serverExtends = function(app) {
        app.get('*', function(req, res, next) {
            console.log('============================================')
            console.log('===========', req.session.user, '===========')
            console.log('============================================')
            next()
        })
        app.extends().get('/', function(req, res, next) {
            if (req && req.session && req.session.authtoken && req.session.user) {
                res.redirect('/courses')
            } else {
                next()
            }
        })

        app.extends().get('/courses', function(req, res, next) {
            var Query = Stack.ContentType('courses').Query();
            Query
                .find()
                .then(function success(result) {
                    req.getViewContext().set('courses', result)
                    next()
                }, function error(err) {
                    res.send(err)
                });

        })

        app.post('/login', function(req, res) {
            built.login(req.body)
                .then(function(user) {
                    req.session.user = user.email
                    req.session.authtoken = user.authtoken
                    req.session.user_id = user.uid
                    res.cookie('lmsauthtoken', user.authtoken)
                    res.redirect('/courses')
                })
        })

        app.get('/logout', function(req, res) {
            req.session.destroy(function() {
                res.redirect('/')
            })
        })

        app.get('/get-notification', function(req, res) {
            built.getusernotifications(req.session.user_id)
                .then(function(notifications) {
                    console.log(notifications)
                    res.send(notifications[0])
                })
        })

        app.get('/inbox', function(req, res) {
            console.log('------------------ req.session.user_uid', req.session.user_id)
            built.getusernotifications(req.session.user_id)
                .then(function(notifications) {
                    // console.log('notifications',JSON.stringify(notifications[0]))
                    res.render('pages/temp/inbox', {
                        notifications: notifications[0]
                    })
                })
        })
        app.get('/user', function(req, res) {
            res.render('pages/temp/homepage', {
                user: req.session
            })
        })
        app.get('/inbox/:notid', function(req, res) {
            var notid = req.params.notid
            built.getSingleNotification(notid)
                .then(function(notification) {
                    console.log('completed')
                    res.render('pages/temp/singlenotification', {
                        notification: notification[0]
                    })
                })
            built.setread(req.session.user_uid, notid)
        })
    };
    Routes.beforePublish = function(data, next) {
        next();
    };
    Routes.beforeUnpublish = function(data, next) {
        next();
    };
};