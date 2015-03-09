(function() {
	'use strict';
	
	angular
		.module('Basket')
		.controller('ListController',ListController);
	
	ListController.$inject = ['items','$routeParams'];
	
	function ListController(items,$routeParams) {
		var vm = this;

		vm.listName = $routeParams.listName;
		console.log(vm.listName);
		vm.items = items.populate();
		vm.newItemInput = false;
		vm.newItemDescription = '';
		vm.itemFunctions = {
			createNewItem: createNewItem,
			add: add,
			togglePurchased: togglePurchased,
			clearComplete: clearComplete
		};
		
		function filterItems(item) {
			return item.list === vm.listName;
		}
		
		function createNewItem() {
			vm.newItemInput = true;	
		}
		
		function add(desc) {			
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