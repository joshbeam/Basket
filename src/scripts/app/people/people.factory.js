(function() {
	'use strict';
	
	angular.module('Basket')
		.factory('people',people);
	
	people.$inject = ['$rootScope','Person','localStore'];
	
	function people($rootScope,Person,localStore) {
		var people = [],
			exports = {
				populate: populate,
				get: get,
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
		
		function get() {
			if(arguments.length === 0) {
				return people;	
			} else {
				// for things like people.get().get('length');
				if(arguments[0] in this) {
					return this[arguments[0]];	
				}
			}
		}

		function add(config) {
			var exists = false;
			
			angular.forEach(people, forEachFn);
			
			if(exists === false) {
				people.push(new Person(config));
				
				this.update();
				
				// person doesn't already exist
				return false;
			} else {
				
				//person already exists
				return true;	
			}
			
			function forEachFn(person) {
				if(person.name.toLowerCase() === config.name.toLowerCase()) {
					exists = true;
				}
			}
		}
		
		function remove(name) {
			var i = people.length;
			
			while(i--) {
				if(people[i].get('name') === name) {
					people.splice(i,1);	
				}
			}
			
			$rootScope.$broadcast('person.remove',name);

			this.update();					
		}
							
		function update() {
			localStore.set('people',people);	
		}
	}
})();