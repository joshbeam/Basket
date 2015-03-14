(function() {
	'use strict';
	
	angular.module('Basket')
		.controller('PeopleController',PeopleController);
	
	PeopleController.$inject = ['$scope','$location','$routeParams','Person','people','items','colorGenerator','shade'];
	
	function PeopleController($scope,$location,$routeParams,Person,people,items,colorGenerator,shade) {
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
		
		vm.people = people.populate();
		vm.shade = shade;
		vm.showingPersonOptions = false;
		// wonder if I should change the structure of this...
		// maybe use a filter instead and pass in the person as a param?
		vm.personWithOptionsShowing = '';
		vm.peopleFunctions = {
			add: add,
			href: href,
			numberOfItems: numberOfItems,
			showPersonOptions: showPersonOptions,
			// should i make this function a part of "showPersonOptions" by param?
			stopShowingPersonOptions: stopShowingPersonOptions,
			removePerson: removePerson
		};
		
		function add(_name_) {
			var name = _name_ || prompt("Name of person: "),
				exists;
						
			if(name && name.trim() !== '') {
				exists = people.add({
					name: name,
					color: colorGenerator(255,255,255)
				});
			}
			
			if(exists === true) {
				name = prompt("Person already exists! Choose another name: ");
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
		
		function showPersonOptions(person) {
			vm.showingPersonOptions = true;
			vm.personWithOptionsShowing = person;
		}
		
		function stopShowingPersonOptions() {
			vm.showingPersonOptions = false;
			vm.personWithOptionsShowing = '';
		}
		
		function removePerson() {
			$location.path('/list/'+vm.listName);
			people.remove(vm.personWithOptionsShowing.name);	
		}
	}
})();