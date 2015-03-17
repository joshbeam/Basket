(function() {
	'use strict';
	
	angular.module('Basket')
		.controller('ListsController', ListsController);
	
	ListsController.$inject = ['lists','stateManager'];
	
	function ListsController(lists,stateManager) {
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
		
		function create() {
			if(vm.newListName.trim() === '') {
				return;	
			}
			
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