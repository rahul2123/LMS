
// function checkadmin(req, res, next) {
//     if (req.session.user==='admin' || req.url == '/login' || req.url=='/super-admin-login')
//         next()
//     else
//         res.redirect('/')
// }

// function checksession(req, res, next) {
//     if (req.url == '/' || req.url == '/login' && req.method == 'POST' || req.url == '/register' || req.url == '/register-user' || req.url == "/admin/login" || req.url =='/admin/super-admin-login') {
//         console.log('called next',req.url)
//         next()
//     } else if (!req.session.user) {
//         res.redirect('/')
//     } else {
//         next()
//     }
// }


// module.exports = {
// 	checksession : checksession,
// 	checkadmin : checkadmin
// }