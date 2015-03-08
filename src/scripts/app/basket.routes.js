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
			controllerAs: 'vm',
			resolve: {
				listsPrep: listsPrep,
			}
		})	
	}
			
	listsPrep.$inject = ['lists'];
	
	function listsPrep(lists) {
		return lists.populate();
	}
})();

