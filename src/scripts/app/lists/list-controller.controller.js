(function() {
	'use strict';
	
	angular
		.module('Basket')
		.controller('ListController',ListController);
	
	ListController.$inject = ['$scope','items','lists','$routeParams','$location','ContextMenu','people','shade'];
	
	function ListController($scope,items,lists,$routeParams,$location,ContextMenu,people,shade) {
		var vm = this;

		// people are already populated in PeopleController
		vm.people = people.get();
		vm.listName = $routeParams.listName;
		vm.personName = $routeParams.personName || null;
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
		vm.assigningItem = false;
		vm.assignedTo = '';
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
			startAssigningTo: startAssigningTo,
			stopAssigningTo: stopAssigningTo,
			assignTo: assignTo,
			//maybe put these in "overall list" object
			clearPurchased: clearPurchased,
			removeList: removeList
		};
		vm.peopleFunctions = {
			personColor: personColor	
		}
		
		vm.listViewContextMenu = new ContextMenu(
			{
				title: '+',
				fn: 'vm.itemFunctions.createNewItem',
				extra: false,
				classString: 'good'
			},
			{
				title: 'Clear Purchased',
				fn: 'vm.itemFunctions.clearPurchased',
				extra: true,
				classString: ''
			},
			{
				title: 'Delete List',
				fn: 'vm.itemFunctions.removeList',
				extra: true,
				classString: ''
			}
		);
		
		vm.itemViewContextMenu = new ContextMenu(
			{
				title: '&laquo;',
				fn: 'vm.itemFunctions.stopEditing',
				extra: false
			},
			{
				title: "Mark as {{vm.itemBeingEdited.get('purchased') === false ? 'purchased' : 'not purchased'}}",
				fn: 'vm.itemFunctions.togglePurchased',
				extra: false,
				classString: ''
			},
			{
				title: 'Edit Description',
				fn: 'vm.itemFunctions.startEditingDescription',
				extra: true,
				classString: ''
			},
			{
				title: "{{vm.itemBeingEdited.get('comments').trim() === '' ? 'Add' : 'Edit'}} comments",
				fn: 'vm.itemFunctions.startAddingComments',
				extra: true,
				classString: ''
			},
			{
				title: 'Assign to...',
				fn: 'vm.itemFunctions.startAssigningTo',
				extra: true,
				classString: ''
			}
		);
		
		///////////////////////////////
				
		function filterItems(item) {
			return item.list === vm.listName;
		}
		
		function createNewItem() {
			vm.creatingNewItem = true;	
		}
		
		function startEditing(item) {
			vm.editingItem = true;
			vm.itemBeingEdited = item;
		}
		
		function stopEditing() {
			vm.editingItem = false;
			vm.itemBeingEdited = '';
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
		
		function cancel() {
			vm.creatingNewItem = false;	
		}
		
		function togglePurchased() {
			var item = vm.itemBeingEdited,
				purchased = item.get('purchased');
			
			item.set('purchased',!purchased);
		}
		
		function startAddingComments() {
			vm.addingComments = true;
			if(vm.itemBeingEdited.get('comments').trim() === '') {
				vm.commentsForItemBeingEdited = '';	
			} else {
				vm.commentsForItemBeingEdited = vm.itemBeingEdited.get('comments');	
			}
			
			stopEditingDescription();
			stopAssigningTo();
		}
		
		function stopAddingComments() {
			vm.addingComments = false;
			
			vm.commentsForItemBeingEdited = '';
		}
		
		function comment() {
			var item = vm.itemBeingEdited;
			
			item.set('comments',vm.commentsForItemBeingEdited);

			stopAddingComments();
		}
		
		
		function removeComments() {
			var item = vm.itemBeingEdited;
			
			item.set('comments','');

			stopAddingComments();	
		}
		
		function startEditingDescription() {
			vm.editedDescription = vm.itemBeingEdited.get('description');
			vm.editingDescription = true;
			
			stopAddingComments();
			stopAssigningTo();
		}
		
		function stopEditingDescription() {
			vm.editingDescription = false;
		}
		
		function edit() {
			var item = vm.itemBeingEdited;
			
			item.set('description',vm.editedDescription);
			
			stopEditingDescription();
		}
		
		function startAssigningTo() {
			vm.assigningItem = true;
			
			stopAddingComments();
			stopEditingDescription();
		}
		
		function stopAssigningTo() {
			vm.assigningItem = false;	
		}
		
		function assignTo() {
			var item = vm.itemBeingEdited;
			
			item.set('person',vm.assignedTo);
			
			// change path to newly assigned person to see all their items
			$location.path('/list/'+vm.listName+'/'+vm.assignedTo);
			
			return stopAssigningTo();
		}
		
		function clearPurchased() {
			items.clearPurchased();	
		}
		
		function removeList() {
			if(confirm("Do you want to delete this entire shopping list?")) {
				//remove the list and save the array back to localStorage
				lists.remove(vm.listName);
				items.remove(vm.listName);
				$location.path('/');
			} else {
				return;	
			}
		}
		
		function personColor(item) {
			var color;
			
			if(vm.personName !== null) {
				angular.forEach(vm.people,function(person) {
					if(person.name === vm.personName) {
						color = person.color;
					}
				});
				
				if(item.person === vm.personName) {
					return {
						'background-color': shade(color,.75)
					};
				} else {
					return '';	
				}
			} else {
				return '';				
			}
		}
	}
})();