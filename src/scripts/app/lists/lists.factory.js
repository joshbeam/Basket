(function() {
	'use strict';
	
	angular.module('Basket')
		.factory('lists',lists);
	
	lists.$inject = ['List','$q','localStore'];
	
	function lists(List,$q,localStore) {
		var lists = [],
			exports = {
				populate: populate,
				get: get,
				add: add,
				remove: remove,
				update: update
			};
		
		return exports;

		/////////////////////
		
		function populate() {

			lists = localStore.recreate(localStore.get('lists'),List.prototype) || [];

			return lists;
		}
		
		// probably don't need this...
		function get(type) {
			/*
			type
			- can be the string 'all' to get all lists
			- can be a number that is the id of a specific lists
			*/

			if(type === 'all') {
				return lists;
			} else if(!isNaN(type)) {
				//return helpers.where(list,'id',type);
			}			
		}

		function add(props) {
			var exists = false;
			
			angular.forEach(lists,function(list) {
				if(props.name === list.name) {
					exists = true;
				}
			});
			
			if(exists === false) {
				lists.push(new List(props));

				this.update();		
			} else {
				alert('Choose a unique name');
			}
		}
		
		function remove(listName) {
			angular.forEach(lists,function(list) {
				if(list.name === listName) {
					lists.splice(lists.indexOf(list),1);	
				}
			});
			
			// BUG: also needs to remove all items that were a part of that list
			
			this.update();
		}
							
		function update() {
			localStore.set('lists',lists);	
		}
	}
})();