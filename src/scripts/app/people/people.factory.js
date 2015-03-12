(function() {
	'use strict';
	
	angular.module('Basket')
		.factory('people',people);
	
	people.$inject = ['Person'];
	
	function people(Person) {
		var people = [],
			exports = {
				populate: populate,
				add: add,
				remove: remove,
				update: update
			};
		
		return exports;
		
		/////////////////
		
		function populate() {
			people = localStore.recreate(localStore.get('people'),Person.prototype) || [];
			
			return people;
		}

		function add(name) {
			list.push(new Person(name));

			this.update();			
		}
		
		function remove(name) {
			var i = people.length;
			
			while(i--) {
				if(people[i].get('name') === name) {
					people.splice(i,1);	
				}
			}

			this.update();					
		}
							
		function update() {
			localStore.set('people',people);	
		}
	}
})();