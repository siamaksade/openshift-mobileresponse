function VisitorController(visitorsFactory, $rootScope, $scope, $routeParams, $location) {
    
    $rootScope.visitorNumber = $routeParams.param1;

    $scope.loginAlert = {};
    
    $scope.Login = function (code) {
        $scope.loginAlert = {
            type: 'alert-info',
            msg: 'Vänta lite, loggar in ' + $rootScope.visitorNumber
        };

        // find or create unit from visitor number
        visitorsFactory.findOrCreateVisitor(code, function(response) {
            $scope.loginAlert = {
                type: 'alert-success',
                msg: 'Hittade: ' + response.phone
            };
            $rootScope.currentVisitor = response;
            $location.path('/navigation/' + $rootScope.currentVisitor.phone);
        });

    };

}