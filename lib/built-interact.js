var Built = require('built.io')
var builtApp = Built.App('blt3a3868b97db0c4e9').setMasterKey('blte3fc8b51f4021245')
var q = require('q')
var _ = require('lodash')
var async = require('async')
var util = require('util')
function login(credentials) {
    var deferred = q.defer()
    builtApp.User().login(credentials.email, credentials.password)
        .then(function(user) {
            console.log('logged in successfully')
            deferred.resolve(user.toJSON())
        }, function(err) {
            console.log('error in login', err)
            deferred.reject(err)
        })
    return deferred.promise
}

function register(details) {
    var deferred = q.defer()
    builtApp.User().register(details.email, details.password, details.password)
        .then(function(user) {
            deferred.resolve(user.toJSON())
        }, function(err) {
            console.log(err)
            console.log(JSON.stringify(err, null, 4))
            deferred.reject(err)
        })
    return deferred.promise
}

function getcourses() {
    var deferred = q.defer()
    builtApp.Class('courses').Query().toJSON()
        .exec().then(function(objs) {
            deferred.resolve(objs)
        }, function(err) {
            deferred.reject(err)
        })
    return deferred.promise
}

function addcourse(token, course) {
    var deferred = q.defer()
    var courses = builtApp.Class('courses').Object(course)
    courses.setHeader('authtoken', token)
        .save()
        .then(function(obj) {
            deferred.resolve(obj.toJSON())
        }, function(err) {
            deferred.resolve(err)
        })

    return deferred.promise

}

function getcoursebyUid(courseid) {
    var deferred = q.defer()
    builtApp.Class('courses').Query().where('uid', courseid).toJSON()
        .exec()
        .then(function(obj) {
            deferred.resolve(obj)
            console.log(obj)
        }, function(err) {
            deferred.reject(err)
            console.log(err)
        })

    return deferred.promise
}

function getlecturebyUid(lectureid) {
    var deferred = q.defer()
    builtApp.Class('lectures').Query().where('uid', lectureid).toJSON()
        .exec()
        .then(function(obj) {
            deferred.resolve(obj)
            console.log(obj)
        }, function(err) {
            deferred.reject(err)
            console.log(err)
        })
    return deferred.promise
}

function upload(path) {
    var deferred = q.defer()
    builtApp.Upload().setFile(path)
        .save()
        .then(function(upload) {
            deferred.resolve(upload.toJSON())
            console.log(upload.toJSON())
        }, function(err) {
            deferred.reject(err)
        });

    return deferred.promise;
}

function updatecourse(token, body) {
    var deferred = q.defer()
    var courses = builtApp.Class('courses').Object(body)
    courses.setHeader('authtoken', token)
        .save()
        .then(function(obj) {
            deferred.resolve(obj.toJSON())
        }, function(err) {
            deferred.resolve(err)
        })

    return deferred.promise
}

function savelecture(obj, token) {
    var deferred = q.defer()
    var courses = builtApp.Class('lectures').Object(obj)
    courses.setHeader('authtoken', token)
        .save()
        .then(function(obj) {
            deferred.resolve(obj.toJSON())
        }, function(err) {
            deferred.resolve(err)
        })
    return deferred.promise
}

function adminlogin(credentials) {
    var deferred = q.defer()
    var query = builtApp.Class('super_admin').Query();
    var username = query.where('username', credentials.email);
    var password = query.where('password', credentials.password);
    var queryArray = [username, password];
    var andQuery = query.and(queryArray);

    andQuery.toJSON().exec().then(function(user) {
        deferred.resolve(user)

    })
    return deferred.promise
}

function createnotification(obj) {
    var deferred = q.defer()
    var notification = builtApp.Class('notifications').Object(obj)
    notification
        .save()
        .then(function(obj) {
            deferred.resolve(obj.toJSON())
        }, function(err) {
            deferred.resolve(err)
        })

    return deferred.promise
}

function getnotifications() {
    var deferred = q.defer()
    builtApp.Class('notifications').Query().toJSON()
        .exec().then(function(notifications) {
            deferred.resolve(notifications)
        }, function(err) {
            deferred.reject(err)
        })
    return deferred.promise
}

function applicationusers() {
    var deferred = q.defer()
    builtApp.Class('built_io_application_user').Query().toJSON()
        .exec().then(function(users) {
            deferred.resolve(users)
        }, function(err) {
            deferred.reject(err)
        })
    return deferred.promise
}

// using promise chaining
function addnotificationtousers(obj) {
    var deferred = q.defer()
    console.log('addnotificationtousers')
    var promise_chain = q.fcall(function() {});
    var notid = obj.notid
    obj.users.forEach(function(el) {
        var promise_link = function() {
            var innerpromise = q.defer()
            logdata(el, notid, function(result) {
                innerpromise.resolve(result)
            })
            return innerpromise.promise
        }

        promise_chain = promise_chain.then(promise_link)
    });


    function logdata(user_uid, notid, cb) {
        console.log('logdata', user_uid)

        builtApp.Class('built_io_application_user').Query().where('uid', user_uid).include(['notifications']).only(['notifications']).toJSON()
            .exec().then(function(user) {
                var user = user[0]
                    // console.log(notid)
                if (user.notifications) {
                    user.notifications = user.notifications.map(function(el) {
                        return el.uid
                    })
                } else {
                    user.notifications = []
                }
                user.notifications.push(notid)
                user.notifications = _.uniq(user.notifications)
                var usernotification = builtApp.Class('built_io_application_user').Object(user)
                usernotification
                    .save()
                    .then(function(obj) {
                        cb()
                    })

            }, function(err) {
                console.log(err)
            })
    }

    promise_chain.then(function() {
        console.log('completed all promises')
        deferred.resolve(true)
    })

    return deferred.promise
}

// using async parallel
// function addnotificationtousers(obj) {
//     var deferred = q.defer()

//     var notid = obj.notid
//     var asyncTasks = [];
//     obj.users.forEach(function(el) {
//         asyncTasks.push(function(callback) {
//             updatenotification(el, notid, function(argument) {
//                 callback();
//             })
//         })
//     });

//     updatenotification = function(user_uid, notid, cb) {

//         builtApp.Class('built_io_application_user').Query().where('uid', user_uid).include(['notifications']).only(['notifications']).toJSON()
//             .exec().then(function(user) {
//                 var user = user[0]
//                 console.log(notid)
//                 if (user.notifications) {
//                     user.notifications = user.notifications.map(function(el) {
//                         return el.uid
//                     })
//                 } else {
//                     user.notifications = []
//                 }
//                 user.notifications.push(notid)
//                 user.notifications = _.uniq(user.notifications)
//                 var usernotification = builtApp.Class('built_io_application_user').Object(user)
//                 usernotification
//                     .save()
//                     .then(function(obj) {
//                         cb()
//                     })

//             }, function(err) {
//                 console.log(err)
//             })
//     }

//     async.parallel(asyncTasks, function() {
//         console.log('updated all users notifications')
//         deferred.resolve(true)
//     })
//     return deferred.promise
// }



function getusernotifications(user_uid) {
    var deferred = q.defer()
    console.log('inside getnotifications')
    builtApp.Class('built_io_application_user').Query().where('uid', user_uid).only(['notification_status']).toJSON()
        .exec().then(function(notifications) {
            // console.log(notifications)
            deferred.resolve(notifications)
        }, function(err) {
            console.log(err)
        })

    return deferred.promise
}

function addnotificationtousersjson(obj) {
    var deferred = q.defer()
    console.log('addnotificationtousers')
    var promise_chain = q.fcall(function() {});
    var notid = obj.notid
    obj.users.forEach(function(el) {
        var promise_link = function() {
            var innerpromise = q.defer()
            logdata(el, notid, function(result) {
                innerpromise.resolve(result)
            })
            return innerpromise.promise
        }

        promise_chain = promise_chain.then(promise_link)
    });


    function logdata(user_uid, notid, cb) {
        console.log('logdata', user_uid)

        builtApp.Class('built_io_application_user').Query().where('uid', user_uid).only(['notification_status']).toJSON()
            .exec().then(function(user) {
                var user = user[0]
                if (_.isPlainObject(user.notification_status)) {
                    user.notification_status = []
                }
                if (_.findIndex(user.notification_status, function(o) {
                    return o.uid == notid.uid
                }) < 0) {
                    console.log('\n======================')
                    console.log('adding notification')
                    console.log('\n======================')
                    user.notification_status.push(notid)
                    var usernotification = builtApp.Class('built_io_application_user').Object(user)
                    usernotification
                        .save()
                        .then(function(obj) {
                            cb()
                        }, function(err) {
                            console.log('err in saving notifications to user', err)
                        })
                } else {
                    console.log('\n======================')
                    console.log('notification already exists not adding')
                    console.log('\n======================')
                    cb()
                }

            }, function(err) {
                console.log('err in retrieving user data', err)
            })
    }

    promise_chain.then(function() {
        console.log('completed all promises')
        deferred.resolve(true)
    })

    return deferred.promise

}

function getSingleNotification(notid) {
    var deferred = q.defer()
    builtApp.Class('notifications').Query().where('uid', notid).toJSON()
        .exec().then(function(notification) {
            console.log(notification)
            deferred.resolve(notification)
        })

    return deferred.promise
}

function setread(user_uid, notid) {
    var deferred = q.defer()

    builtApp.Class('built_io_application_user').Query().where('uid', user_uid).only(['notification_status']).toJSON()
        .exec().then(function(user) {
            var user = user[0]

            user.notification_status.map(function(elem) {
                if (elem.uid === notid) {
                    elem.status = true
                }
            })

            var usernotification = builtApp.Class('built_io_application_user').Object(user)
            usernotification
                .save()
                .then(function(obj) {
                    deferred.resolve('updated read status')
                }, function(err) {
                    console.log('err in saving notifications to user', err)
                })

        })
    return deferred.promise
}
module.exports = {
    login: login,
    getusernotifications: getusernotifications,
    adminlogin: adminlogin,
    createnotification: createnotification,
    getnotifications: getnotifications,
    applicationusers: applicationusers,
    addnotificationtousers: addnotificationtousers,
    addnotificationtousersjson: addnotificationtousersjson,
    getSingleNotification: getSingleNotification,
    setread: setread,
}