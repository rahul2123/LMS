var Built = require('built.io')
var builtApp = Built.App('blt3a3868b97db0c4e9').setMasterKey('blte3fc8b51f4021245')
var query = builtApp.Class('super_admin').Query();
var query1 = query.where('username','admin');
var query2 = query.where('password','admin');
var queryArray = [query1,query2];
var andQuery = query.and(queryArray);

andQuery.toJSON().exec().then(function  (uses) {
	 console.log(uses)
})