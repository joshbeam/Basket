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
		.when('/list/:listName',{
			templateUrl: 'list.html',
			controller: 'ListController',
			controllerAs: 'vm',
			resolve: {
				itemsPrep: itemsPrep	
			}
		})
		.otherwise({
			redirectTo: '/'
		});
	}
			
	listsPrep.$inject = ['lists'];
	
	function listsPrep(lists) {
		return lists.populate();
	}
	
	itemsPrep.$inject = ['items'];
	
	function itemsPrep(items) {
		return items.populate();	
	}
})();

