function config($locationProvider, $routeProvider) {
	$locationProvider.hashPrefix('!');
	$routeProvider.otherwise({redirectTo: '/dashboard'});
	$routeProvider.when('/dashboard', {
		templateUrl: 'views/dashboard.html',
		controller: 'DashboardCtrl'
	});
}

function run() {
}

angular
    .module('vroom-vroom')
    .config(config)
    .run(run);
