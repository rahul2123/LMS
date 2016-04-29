var cmsapikey = ""
var q = require('q');


function setHeaders(authtoken) {
    return {
        'api_key': 'blt336e58d32212ac05',
        'authtoken': authtoken
    };
};

function getAuthToken() {
    console.log('request for authtoken')
    var deferred = Q.defer();
    var credentials = {
        "user": {
            "email": "rahul.pal@raweng.com",
            "password": "rahulpal"
        }
    };
    request({
        url: 'https://api.contentstack.io:443/v2/user-session',
        method: 'POST',
        json: credentials
    }, function(error, response, body) {
        if (error) console.log(error)
        if (response.statusCode == 200) {
            console.log("Login StatusCode : " + response.statusCode)
            deferred.resolve(response.body.user.authtoken)
            console.log("Login successfull ");
        } else {
            deferred.reject(error);
        }
    });
    return deferred.promise;
}

function uploadasset (filepath) {
	 
}
module.exports = {
	uploadasset : uploadasset
}