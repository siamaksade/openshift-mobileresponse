function VisitorsFactory($rootScope,apiFactory) {

    $rootScope.isAuthenticated = false;
    $rootScope.authenticationToken = null;
    $rootScope.currentVisitor = null;

    var credentials = {
        'userName': 'username',
        'password': 'password'
    };

    var token = null;

    function dateTimeNow() {
        return moment().format('YYYY-MM-DD HH:mm:ss');
    }

    function formatDateTime(timestamp) {
        return moment(timestamp).format('YYYY-MM-DD HH:mm:ss');
    }

    function formatDate(timestamp) {
        return moment(timestamp).format('YYYY-MM-DD');
    }

    function formatTime(timestamp) {
        return moment(timestamp).format('HH:mm');
    }

    function login(callback) {
        //console.log("before: " + $rootScope.authenticationToken);
        if ($rootScope.authenticationToken == null) {
            apiFactory.functions.authenticate(credentials, function(response) {
                if (response != null) {
                    $rootScope.isAuthenticated = true;
                    $rootScope.authenticationToken = response;
                    token = $rootScope.authenticationToken;
                    //console.log("Authenticated: " + $rootScope.authenticationToken);
                    callback();
                }
            });
        } else {
            token = $rootScope.authenticationToken;
            //console.log("Already authenticated: " + $rootScope.authenticationToken);
            callback();
        }
    }

    function findOrCreateVisitor(code, callback) {
        login(function() {

            var findUnitsRequest = {
                authenticationToken: token,
                data: {
                    pageIndex: 1,
                    pageSize: 5,
                    phoneNumber: code
                }
            };
            apiFactory.functions.call('units/find', findUnitsRequest, function (response) {
                if (response.data.items.length > 0) {
                    $rootScope.currentVisitor = response.data.items[0];
                    var metadata = {
                        'lastvisit': dateTimeNow
                    };
                    setVisitorMetaData($rootScope.currentVisitor.id, metadata, function(response) {
                        
                    });
                    callback(response.data.items[0]);
                } else {
                    // create new unit where phone = code
                    var createUnitRequest = {
                        authenticationToken: token,
                        data: {
                            recipient: 
                                {
                                    'phone': code,
                                    'metaData': {
                                        'lastvisit': dateTimeNow
                                    },
                                    'tags': ["vivr"]
                                }
                        }
                    };
                    apiFactory.functions.call('units/create', createUnitRequest, function (response) {
                        $rootScope.currentVisitor = response.data;
                        callback(response.data);
                    });
                }

            });

        });
    }

    function setVisitorMetaData(id, metaData, callback) {
        login(function () {

            var setUnitMetaDataRequest = {
                authenticationToken: token,
                data: {
                    'unitId': id,
                    'metaData': metaData
                }
            };
            //console.log(setUnitMetaDataRequest);
            apiFactory.functions.call('units/set-meta-data', setUnitMetaDataRequest, function (response) {
                //console.log(response);
                callback(response.data);
            });

        });
    }

    function findVisitor(code, callback) {

        login(function () {
            var findUnitsRequest = {
                authenticationToken: token,
                data: {
                    'pageIndex': 1,
                    'pageSize': 5,
                    'phoneNumber': code
                }
            };
            apiFactory.functions.call('units/find', findUnitsRequest, function (response) {
                if (response.data.items.length == 1) {
                    callback(response.data.items[0]);
                } else {
                    callback(null);
                }
            });
        });

    }

    function tagVisitor(id, tags, callback) {
        login(function () {

            var tagUnitsRequest = {
                authenticationToken: token,
                data: {
                    'unitId': id,
                    'tags': tags
                }
            };

            apiFactory.functions.call('units/tag', tagUnitsRequest, function (response) {
                callback(response.data);
            });

        });
    }

    function sendEmail(fromCode, groupId, subject, message, callback) {
        login(function () {

            var emailMessage = {
                '_type': 'email',
                'from': 'no-reply@bosbec.se',
                'subject': subject,
                'body': message,
                'priority': 'High'
            };

            var sendMessageRequest = {
                authenticationToken: token,
                data: {
                    'messageId': 'd18b37ce-66d5-4745-b2c2-da055d944bd2',
                    'messages': [emailMessage],
                    'groupsIds': [groupId]
                }
            };

            apiFactory.functions.call('messages/send', sendMessageRequest, function (response) {
                callback(response.data);
            });

        });
    }

    return {
        findOrCreateVisitor: findOrCreateVisitor,
        setVisitorMetaData: setVisitorMetaData,
        findVisitor: findVisitor,
        tagVisitor: tagVisitor,
        sendEmail: sendEmail,
        dateTimeNow: dateTimeNow,
        formatDateTime: formatDateTime,
        formatDate: formatDate,
        formatTime: formatTime
    };
}