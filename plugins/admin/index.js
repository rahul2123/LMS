/*!
 * admin
 */

"use strict";

/*!
 * Module dependencies
 */
var contentstack = require('contentstack-express');
var Built = require('built.io')
var util = require('util')


module.exports = function Admin() {
    var options = Admin.options;

    Admin.templateExtends = function(engine) {};
    Admin.serverExtends = function(app) {
        var built = require(process.cwd() + '/lib/built-interact')
        app.get('/admin/super-admin-login', function(req, res, next) {
            if (req && req.session && req.session.user) {
                res.redirect('/courses')
            } else {
                next()
            }
        })
        app.get('/admin/login', function(req, res) {
            res.render('pages/temp/superadmin')
        })
        app.post('/admin/super-admin-login', function(req, res) {
            built.adminlogin(req.body)
                .then(function(user) {
                    req.session.user = "admin"
                    res.send(req.session)
                })
        })
        app.get('/admin/create-notification', function(req, res) {
            res.render('pages/temp/createnotification')
        })
        app.post('/admin/create-notification', function(req, res) {
            built.createnotification(req.body)
                .then(function(notification) {
                    res.send(notification)
                })
        })
        app.get('/admin/notifications', function(req, res) {
            built.getnotifications()
                .then(function(notifications) {
                    res.render('pages/temp/notification', {
                        notifications: notifications
                    })
                })
        })
        app.get('/admin/app-users', function(req, res) {
            console.log('app-users')
            built.applicationusers()
                .then(function(users) {
                    res.send(users)
                })
        })

        app.post('/admin/send-notification', function(req, res) {
            var obj = req.body
            obj.users = JSON.parse(req.body.users)
            obj.notid = JSON.parse(req.body.notid)
            built.addnotificationtousersjson(obj)
                .then(function(added) {
                    res.send(added)
                })
        })

    };
    Admin.beforePublish = function(data, next) {
        next();
    };

    Admin.beforeUnpublish = function(data, next) {
        next();
    };
};