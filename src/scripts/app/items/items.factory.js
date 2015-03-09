(function() {
	'use strict';
	
	items.$inject = ['Item','localStore','$q'];
	
	angular.module('Basket')
	.factory('items',items);
	
	function items(Item,localStore,$q) {
		var list = [],
			exports = {
				populate: populate,
				get: get,
				add: add,
				purchased: purchased,
				clearComplete: clearComplete,
				update: update
			};
		
		return exports;

		/////////////////////
		
		function populate() {
			//var deferred = $q.defer();

			list = localStore.get('shoppingList') || [];

			//deferred.resolve(list);

			//return deferred.promise;	
			return list;
		}

		function get(type) {
			/*
			type
			- can be the string 'all' to get all items in list
			- can be a number that is the id of a specific item
			*/

			if(type === 'all') {
				return list;
			} else if(!isNaN(type)) {
				//return helpers.where(list,'id',type);
			}			
		}

		function add(props) {
			list.push(new Item(props));

			this.update();			
		}
		

		function purchased(id,bool) {
			angular.forEach(list,function(item) {
				if(item.$$hashKey === id) {
					// use setter method
					item.purchased = bool;
				}
			});		
				
			this.update();
		}

		function clearComplete() {
			list = list.filter(function(item) {
				return item.purchased === false;
			});

			this.update();			
		}
							
		function update() {
			localStore.set('shoppingList',list);	
		}	
	}
})();