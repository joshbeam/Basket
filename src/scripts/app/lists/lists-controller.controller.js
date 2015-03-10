(function() {
	'use strict';
	
	angular.module('Basket')
		.controller('ListsController', ListsController);
	
	ListsController.$inject = ['lists'];
	
	function ListsController(lists) {
		var vm = this;
		
		vm.lists = lists.populate();
		vm.newListName = '';
		vm.creatingNewList = false;
		vm.listsFunctions = {
			startCreating: startCreating,
			create: create,
			cancel: cancel
		};
		
		function startCreating() {
			vm.creatingNewList = true;	
		}
		
		//bug:
		//need to make sure there is something in the text field
		function create() {
			lists.add({
				name: vm.newListName
			});
			
			vm.newListName = '';
		}		
		
		function cancel() {
			vm.creatingNewList = false;	
		}
	}
})();