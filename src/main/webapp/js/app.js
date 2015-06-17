
var apiFactory = angular.module('ApiFactory', []);
apiFactory.factory('ApiFactory', ['$http', '$timeout', ApiFactory]);

var visitorsFactory = angular.module('VisitorsFactory', []);
visitorsFactory.factory('VisitorsFactory', ['$rootScope','ApiFactory', VisitorsFactory]);

var app = angular.module('app', ['ngRoute', 'ui.bootstrap', 'ApiFactory', 'VisitorsFactory']);

app.config(function($routeProvider) {

    $routeProvider.when('/info', {
        templateUrl: 'Partials/info.html'
    });

    $routeProvider.when('/helpdesk', {
        templateUrl: 'Partials/helpdesk.html',
        controller: 'HelpdeskController'
    });

    $routeProvider.when('/helpdesk/:param1', {
        templateUrl: 'Partials/helpdesk.html',
        controller: 'HelpdeskController'
    });
    
    $routeProvider.when('/navigation/:param1', {
        templateUrl: 'Partials/navigation.html',
        controller: 'NavigationController'
    });

    $routeProvider.when('/:param1', {
        templateUrl: 'Partials/visitor.html',
        controller: 'VisitorController'
    });

    $routeProvider.otherwise({
        redirectTo: '/info'
    });
});

app.controller('VisitorController', [
    'VisitorsFactory',
    '$rootScope',
    '$scope',
    '$routeParams',
    '$location',
    VisitorController
]);

app.controller('NavigationController', [
    'VisitorsFactory',
    '$rootScope',
    '$scope',
    '$routeParams',
    '$location',
    NavigationController]);

app.controller('HelpdeskController', [
    'VisitorsFactory',
    '$rootScope',
    '$scope',
    '$routeParams',
    HelpdeskController]);