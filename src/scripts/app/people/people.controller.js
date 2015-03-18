(function(angular) {
	'use strict';
	
	angular.module('Basket')
		.controller('PeopleController',PeopleController);
	
	PeopleController.$inject = ['$scope','$location','$routeParams','Person','people','items','colorGenerator','shade','stateManager'];
	
	function PeopleController($scope,$location,$routeParams,Person,people,items,colorGenerator,shade,stateManager) {
		var vm = this;
		
		$scope.$watch(function() {
			return $routeParams.listName;
		}, function(n) {
			// or, n.listName || null ?
			vm.listName = n || null;
			
			if($routeParams.personName === undefined) {
				vm.states('options').stop();	
			}
		});
		
		$scope.$watch(function() {
			return $routeParams.personName;
		}, function(n) {
			var config = {
				subject: vm.people.filter(filterSubject)[0]	
			};
			
			vm.states('options').start(config);
			
			function filterSubject(person) {
				return person.get('name') === n;	
			}
		});
		
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

					people.remove(subject.get('name'));						
				}
			}
		},
		{
			name: 'adding',
			done: function(subject,model) {
				var exists = people.add({
					name: model.trim(),
					color: colorGenerator(255,255,255)
				});
				
				if(exists === true) {
					vm.models.prompt.title = 'Person already exists!';
				}

				if(exists === false) {
					this.stop();
				}
			},
			stop: function() {
				vm.models.prompt.title = 'Name:';
			}
		});
		
		vm.states().config(function() {
			return {
				scope: vm	
			};
		});
		
		vm.people = people.populate();
		vm.shade = shade;
		// state manager bug? re-builds model object every time, so if you declare
		// a model like the one below, it will be overwritten by state manager
		// should we just namespace all state manager models separately?
		// e.g. vm.sm.models.whatever
		vm.models = {
			prompt: {
				title: 'Name:'	
			}
		};
		vm.peopleFunctions = {
			href: href,
			numberOfItems: numberOfItems,
		};
		
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
})(angular);