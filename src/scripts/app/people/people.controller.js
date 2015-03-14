(function() {
	'use strict';
	
	angular.module('Basket')
		.controller('PeopleController',PeopleController);
	
	PeopleController.$inject = ['Person','people','colorGenerator','shade'];
	
	function PeopleController(Person,people,colorGenerator,shade) {
		var vm = this;
		
		vm.people = people.populate();
		vm.shade = shade;
		vm.peopleFunctions = {
			add: add	
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
	}
})();