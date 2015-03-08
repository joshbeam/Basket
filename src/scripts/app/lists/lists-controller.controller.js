(function() {
	'use strict';
	
	angular.module('Basket')
		.controller('ListsController', ListsController);
	
	ListsController.$inject = ['listsPrep','lists'];
	
	function ListsController(listsPrep,lists) {
		var vm = this;
		
		vm.lists = listsPrep;	
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