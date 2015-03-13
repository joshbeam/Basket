/*
BUG: when you delete a list, its items are still in localStorage
*/

(function() {
	'use strict';
	
	angular
		.module('Basket')
		.controller('ListController',ListController);
	
	ListController.$inject = ['items','lists','$routeParams','$location','ContextMenu'];
	
	function ListController(items,lists,$routeParams,$location,ContextMenu) {
		var vm = this;

		vm.listName = $routeParams.listName;
		vm.filters = {
			filterItems: filterItems
		};
		vm.items = items.populate();
		//maybe organize this into 'states' and 'functions'
		vm.creatingNewItem = false;
		vm.editingItem = false;
		vm.commentsForItemBeingEdited = '';
		vm.addingComments = false;
		vm.editingDescription = false;
		vm.editedDescription = '';
		vm.itemBeingEdited = '';
		vm.newItemDescription = '';
		vm.itemFunctions = {
			createNewItem: createNewItem,
			startEditing: startEditing,
			stopEditing: stopEditing,
			add: add,
			cancel: cancel,
			togglePurchased: togglePurchased,
			startAddingComments: startAddingComments,
			stopAddingComments: stopAddingComments,
			comment: comment,
			removeComments: removeComments,
			startEditingDescription: startEditingDescription,
			stopEditingDescription: stopEditingDescription,
			edit: edit,
			//maybe put these in "overall list" object
			clearPurchased: clearPurchased,
			removeList: removeList,
		};
		
		vm.listViewContextMenu = new ContextMenu(
			{
				title: '+',
				fn: 'vm.itemFunctions.createNewItem',
				extra: false
			},
			{
				title: 'Clear Purchased',
				fn: 'vm.itemFunctions.clearPurchased',
				extra: true
			},
			{
				title: 'Delete List',
				fn: 'vm.itemFunctions.removeList',
				extra: true
			}
		);
				
		function filterItems(item) {
			return item.list === vm.listName;
		}
		
		function startEditingDescription() {
			vm.editedDescription = vm.itemBeingEdited.get('description');
			vm.editingDescription = true;
			
			stopAddingComments();
		}
		
		function stopEditingDescription() {
			vm.editingDescription = false;
		}
		
		function edit() {
			var item = vm.itemBeingEdited;
			
			item.set('description',vm.editedDescription);
			
			return stopEditingDescription();
		}
		
		function createNewItem() {
			vm.creatingNewItem = true;	
		}
		
		function cancel() {
			vm.creatingNewItem = false;	
		}
		
		function add(desc) {
			if(desc.trim() === '') {
				return; 	
			}
			
			items.add({
				description: desc,
				comments: '',
				list: vm.listName,
				person: ''
			});
			
			vm.newItemDescription = '';
		}
		
		function togglePurchased() {
			var item = vm.itemBeingEdited,
				purchased = item.get('purchased');
			
			item.set('purchased',!purchased);
			//items.purchased(item.get('$$hashKey'),purchased);
		}
		
		function startAddingComments() {
			vm.addingComments = true;
			if(vm.itemBeingEdited.get('comments').trim() === '') {
				vm.commentsForItemBeingEdited = '';	
			} else {
				vm.commentsForItemBeingEdited = vm.itemBeingEdited.get('comments');	
			}
			
			stopEditingDescription();
		}
		
		function stopAddingComments() {
			vm.addingComments = false;
			
			vm.commentsForItemBeingEdited = '';
		}
		
		function comment() {
			var item = vm.itemBeingEdited;
			
			item.set('comments',vm.commentsForItemBeingEdited);

			return stopAddingComments();
		}
		
		function removeComments() {
			var item = vm.itemBeingEdited;
			
			item.set('comments','');

			return stopAddingComments();	
		}
		
		function clearPurchased() {
			items.clearPurchased();	
		}
		
		function removeList() {
			if(confirm("Do you want to delete this entire shopping list?")) {
				//remove the list and save the array back to localStorage
				lists.remove(vm.listName);
				$location.path('/');
			} else {
				return;	
			}
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