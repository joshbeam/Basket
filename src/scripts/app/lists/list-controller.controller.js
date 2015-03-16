(function() {
	'use strict';
	
	angular
		.module('Basket')
		.controller('ListController',ListController);
	
	ListController.$inject = ['$scope','items','lists','$routeParams','$location','ContextMenu','people','shade','stateManager'];
	
	function ListController($scope,items,lists,$routeParams,$location,ContextMenu,people,shade,stateManager) {
		var vm = this;
		
		// people are already populated in PeopleController
		// therefore, only need to call the 'get' method
		vm.people = people.get();
		vm.listName = $routeParams.listName;
		vm.personName = $routeParams.personName || null;
		vm.filters = {
			filterItems: filterItems
		};
		vm.items = items.populate();
		
		var editing = {
			name: 'editing'
		};
		
		var creating = {
			name: 'creating',
			done: function(subject,model) {
				var description = model;

				if(description.trim() === '') {
					return;	
				}

				items.add({
					description: description,
					comments: '',
					list: vm.listName,
					person: ''
				});
			}
		};
		
		var addingComments = {
			name: 'addingComments',
			start: function(subject) {
				var comments = subject.get('comments');
				// set the model
				if(comments.trim() === '') {
					this.model('');
				} else {
					this.model(comments);
				}
			},
			// should probably use an object of parameters instead
			done: function(subject) {
				subject.set('comments',vm.models.commentsForItemBeingEdited);
			},
			auxillary: {
				remove: function(subject) {
					subject.set('comments','');	
				}
			}
		};
		
		var editingDescription = {
			name: 'editingDescription',
			done: function(subject,model) {
				subject.set('description',vm.models.editedDescription);
			}
		};
		
		// need to be able to remove currently assigned person
		var assigning = {
			name: 'assigning',
			done: function(subject) {
				subject.set('person',vm.models.assignedTo);

				// change path to newly assigned person to see all their items
				$location.path('/list/'+vm.listName+'/'+vm.models.assignedTo);
			}
		};		
		
		// maybe try to be able to use this syntax: vm.states('editing').subject()
		// etc...
		vm.states = new stateManager.StateGroup(editing,creating,addingComments,editingDescription,assigning);
		
		// need to be able to group these in a config method
		vm.states().exclusive('addingComments','editingDescription','assigning');
		vm.states().exclusive('editing','creating');
		vm.states().scope(this);
		
				
		vm.models = {
			commentsForItemBeingEdited: '',
			editedDescription: '',
			assignedTo: '',
			newItemDescription: ''
		};

		vm.itemFunctions = {
			togglePurchased: togglePurchased,
			clearPurchased: clearPurchased,
			removeList: removeList
		};
		
		vm.peopleFunctions = {
			personColor: personColor	
		};
		
		vm.listViewContextMenu = new ContextMenu(
			{
				title: '+',
				fn: "vm.states('creating').start(null,'vm.models.newItemDescription')",
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
				fn: "vm.states('editing').stop()",
				extra: false,
				classString: ''
			},
			{
				title: "Mark as {{vm.states('editing').subject().get('purchased') === false ? 'purchased' : 'not purchased'}}",
				fn: 'vm.itemFunctions.togglePurchased',
				extra: false,
				classString: ''
			},
			{
				title: 'Edit Description',
				fn: "vm.states('editingDescription').start(vm.states('editing').subject())",
				extra: true,
				classString: ''
			},
			{
				title: "{{vm.states('editing').subject().get('comments').trim() === '' ? 'Add' : 'Edit'}} comments",
				fn: "vm.states('addingComments').start(vm.states('editing').subject(),'vm.models.commentsForItemBeingEdited')",
				extra: true,
				classString: ''
			},
			{
				title: 'Assign to...',
				fn: "vm.states('assigning').start(vm.states('editing').subject())",
				extra: true,
				classString: ''
			}
		);
		
		///////////////////////////////
				
		function filterItems(item) {
			return item.list === vm.listName;
		}
		
		function togglePurchased() {
			var item = vm.states('editing').subject(),
				purchased = item.get('purchased');
			
			item.set('purchased',!purchased);
		}
		
		function clearPurchased() {
			items.clearPurchased();	
		}
		
		function removeList() {
			if(window.confirm("Do you want to delete this entire shopping list?")) {
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
						'background-color': shade(color,0.75)
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