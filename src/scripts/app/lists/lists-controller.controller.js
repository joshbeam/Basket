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
			create: create
		};
		
		function create() {
			lists.add({
				name: vm.newListName
			});
			
			vm.newListName = '';
			vm.creatingNewList = false;
		}
		
		console.log(vm.lists);
	}
})();