(function() {
	'use strict';
	
	angular
		.module('Basket')
		.config(routeConfig);
	
	routeConfig.$inject = ['$routeProvider'];
	
	function routeConfig($routeProvider) {
		$routeProvider.when('/',{
			templateUrl: 'lists.html',
			controller: 'ListsController',
			controllerAs: 'vm'
		})
		.when('/list/:listName',{
			templateUrl: 'list.html',
			controller: 'ListController',
			controllerAs: 'vm'
		})
		.when('/list/:listName/:personName',{
			templateUrl: 'list.html',
			controller: 'ListController',
			controllerAs: 'vm'
		})
		.otherwise({
			redirectTo: '/'
		});
	}
})();

