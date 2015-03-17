(function() {
	'use strict';
	
	angular.module('Basket')
		.controller('PeopleController',PeopleController);
	
	PeopleController.$inject = ['$scope','$location','$routeParams','Person','people','items','colorGenerator','shade','stateManager'];
	
	function PeopleController($scope,$location,$routeParams,Person,people,items,colorGenerator,shade,stateManager) {
		var vm = this;
		
		$scope.$watch(function() {
			return $routeParams;
		}, function(n) {
			// or, n.listName || null ?
			vm.listName = $routeParams.listName || null;
		},true);
		
		$scope.$watch(function() {
			return items.get();
		}, function(n) {
			vm.items = items.get();
		},true);
		
		// first we have to initialize the items
		// then, above, we have to watch for changes
		// this is because ListController assigns items to people
		// and this controller needs to be able to see those changes
		// in order to update the counts returned by numberOfItems
		vm.items = items.populate();
		
		vm.states = new stateManager.StateGroup({
			name: 'options',
			auxillary: {
				remove: function(subject) {
					//if we're currently viewing a list...
					if(!!vm.listName) {
						$location.path('/list/'+vm.listName);
					}

					people.remove(subject.name);						
				}
			}
		});
		
		vm.states().config(function() {
			return {
				scope: vm	
			};
		});
		
		vm.people = people.populate();
		vm.shade = shade;
		vm.peopleFunctions = {
			add: add,
			href: href,
			numberOfItems: numberOfItems,
		};
		
		function add(_name_) {
			var name = _name_ || window.prompt("Name of person: "),
				exists;
						
			if(name && name.trim() !== '') {
				exists = people.add({
					name: name,
					color: colorGenerator(255,255,255)
				});
			}
			
			if(exists === true) {
				name = window.prompt("Person already exists! Choose another name: ");
				return add(name);
			}
		}
		
		function href(person) {
			if(vm.listName !== null) {
				if(!!person) {
					$location.path('/list/'+vm.listName+'/'+person.name);
				} else {
					$location.path('/list/'+vm.listName);	
				}
			} else {
				$location.path('/');	
			}
		}
		
		function numberOfItems(person) {
			if(vm.listName !== null) {
				var count = 0;

				angular.forEach(vm.items,function(item) {
					if(item.person === person.name && item.list == vm.listName) {
						count++;	
					}
				});
				
				return count > 0 ? '('+count+')' : '';
			} else {
				return '';	
			}			
		}
	}
})();