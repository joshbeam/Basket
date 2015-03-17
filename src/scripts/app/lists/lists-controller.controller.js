(function() {
	'use strict';
	
	angular.module('Basket')
		.controller('ListsController', ListsController);
	
	ListsController.$inject = ['lists','stateManager'];
	
	function ListsController(lists,stateManager) {
		var vm = this;
		
		vm.states = new stateManager.StateGroup({
			name: 'creating',
			done: function(subject,model) {
				if(model.trim() !== '') {
					lists.add({
						name: model
					});
				}
			}
		});
		
		vm.states().config(function() {
			var config = {
				scope: vm	
			};
			
			return config;
		});
		
		vm.lists = lists.populate();
//		vm.newListName = '';
//		vm.creatingNewList = false;
//		vm.listsFunctions = {
//			startCreating: startCreating,
//			create: create,
//			cancel: cancel
//		};
//		
//		function startCreating() {
//			vm.creatingNewList = true;	
//		}
//		
//		function create() {
//			if(vm.newListName.trim() === '') {
//				return;	
//			}
//			
//			lists.add({
//				name: vm.newListName
//			});
//			
//			vm.newListName = '';
//		}
//		
//		function cancel() {
//			vm.creatingNewList = false;	
//		}
	}
})();