(function() {
	'use strict';
	
	angular
		.module('Basket')
		.controller('ListController',ListController);
	
	ListController.$inject = ['$scope','items','$routeParams','itemsPrep'];
	
	function ListController($scope,items,$routeParams,itemsPrep) {
		var vm = this;

		vm.items = itemsPrep;
		vm.listName = $routeParams.listName;
		vm.newItemInput = false;
		vm.newItemDescription = '';
		vm.itemFunctions = {
			createNewItem: createNewItem,
			add: add,
			togglePurchased: togglePurchased,
			clearComplete: clearComplete
		};
		
		function createNewItem() {
			vm.newItemInput = true;	
		}
		
		function add(desc) {
			console.log($routeParams.listName);
			
			items.add({
				description: desc,
				comments: '',
				list: vm.listName
			});
			
			vm.newItemDescription = '';
		}
		
		function togglePurchased(item) {
			var purchased = !item.get('purchased');
			
			items.purchased(item.$$hashKey,purchased);
		}
		
		function clearComplete() {
			items.clearComplete();	
		}
	}
	
	
//		$scope.$watch(function() {
//		  return items.get('all');
//		}, function(newVal, oldVal) {
//		  $scope.list = newVal;
//		});
})();