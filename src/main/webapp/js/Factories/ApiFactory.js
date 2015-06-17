function ApiFactory($http) {

    var authenticationToken = 'nada';

    //var apiSettings = {
    //    baseApiUrl: 'http://api.test.mobileresponse.se/',
    //    method: 'POST'
    //};

    var apiSettings = {
        baseApiUrl: 'https://api.mobileresponse.se/',
        method: 'POST'
    };

    function authenticate(userCredentials, callback) {
        var request = { data: userCredentials };
        call('authenticate', request, function (response) {
            if (response.data != null) {
                authenticationToken = response.data.id;
                callback(response.data.id);
            } else {
                callback();
            }
        });
    }

    function call(url, request, callback) {
        //console.log(request);
        $http({
            url: apiSettings.baseApiUrl + url,
            method: apiSettings.method,
            data: request
        }).then(function (response) {
            //console.log(response);
            callback(response.data);
        });
    }

    function callReturnId(url, request, callback) {
        call(url, request, function (response) {
            callback(response.data.id);
        });
    }

    return {
        apiSettings: apiSettings,
        authenticationToken: authenticationToken,
        functions: {
            authenticate: authenticate,
            call: call,
            callReturnId: callReturnId
        }
    };

}