function HelpdeskController(visitorsFactory, $rootScope, $scope, $routeParams) {

    $rootScope.phoneNumber = $routeParams.param1;

    var areas = {
        'booking': 'Bokning av byte eller lagning',
        'price': 'Prisförfrågan',
        'reschedule': 'Ombokning av tid',
        'additionalquestion': 'Ytterligare frågor',
        'invoicequestion': 'Fakturafråga',
        'claimquestion': 'Reklamation',
        'otherquestion': 'Övriga frågor'
    };

    $scope.areas = null;

    $scope.visitor = null;
    $scope.info = null;

    $scope.findVisitor = function(code) {
        if (code === undefined) {
            $rootScope.phoneNumber = '+467';
        } else {
            $scope.info = null;
            $scope.visitor = null;
            visitorsFactory.findVisitor(code, function(response) {
                if (response != null) {
                    $scope.area = areas[response.metaData.lastsubmit];
                    $scope.visitor = response;
                } else {
                    $scope.info = {
                        'type': 'alert-danger',
                        'msg': 'Hittade ingen besökare som matchade ' + code
                    };
                }
            });
        }
    };

}