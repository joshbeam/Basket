(function() {
	'use strict';
	
	angular
		.module('Basket')
		.controller('ListController',ListController);
	
	ListController.$inject = ['items','$routeParams'];
	
	function ListController(items,$routeParams) {
		var vm = this;

		vm.listName = $routeParams.listName;
		vm.filters = {
			filterItems: filterItems
		};
		vm.items = items.populate();
		vm.creatingNewItem = false;
		vm.editingItem = false;
		vm.itemBeingEdited = '';
		vm.newItemDescription = '';
		vm.itemFunctions = {
			createNewItem: createNewItem,
			cancel: cancel,
			add: add,
			togglePurchased: togglePurchased,
			clearComplete: clearComplete,
			startEditing: startEditing,
			stopEditing: stopEditing
		};
		
		function filterItems(item) {
			return item.list === vm.listName;
		}
		
		function createNewItem() {
			vm.creatingNewItem = true;	
		}
		
		function cancel() {
			vm.creatingNewItem = false;	
		}
		
		function add(desc) {			
			items.add({
				description: desc,
				comments: '',
				list: vm.listName
			});
			
			vm.newItemDescription = '';
		}
		
		//bug:
		//can't use 'get' because it doesn't see the item prototype chain
		function togglePurchased(item) {
			var purchased = !item.purchased;
			
			items.purchased(item.$$hashKey,purchased);
		}
		
		//bug:
		//you have to refresh to see the list without cleared items
		function clearComplete() {
			items.clearComplete();	
		}
		
		function startEditing(item) {
			vm.editingItem = true;
			vm.itemBeingEdited = item;
		}
		
		function stopEditing() {
			vm.editingItem = false;
			vm.itemBeingEdited = '';
		}
	}
	
	
//		$scope.$watch(function() {
//		  return items.get('all');
//		}, function(newVal, oldVal) {
//		  $scope.list = newVal;
//		});
})();