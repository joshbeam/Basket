(function() {
	'use strict';
	
	items.$inject = ['Item','localStore','$q','$rootScope'];
	
	angular.module('Basket')
	.factory('items',items);
	
	function items(Item,localStore,$q,$rootScope) {
		var list = [],
			exports = {
				populate: populate,
				get: get,
				add: add,
				clearPurchased: clearPurchased,
				update: update
			};
		
		$rootScope.$on('itemSet',exec);
		
		function exec() {
			return exports.update();	
		}
		
		return exports;

		/////////////////////
		
		function populate() {
			//var deferred = $q.defer();

			list = localStore.recreate(localStore.get('shoppingList'),Item.prototype) || [];
			
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

		function clearPurchased() {			
			/* 	must use splice to live update the controller
			
				this won't work:
					list = list.filter(function(item) {
						return item.get('purchased') === false;
					});				
			*/
			
			//solution: http://stackoverflow.com/a/16217435/2714730
			//angular.forEach doesn't work because indices change...
			//therefore, we loop backwards
			
			var i = list.length;
			
			while(i--) {
				if(list[i].get('purchased') === true) {
					list.splice(i,1);	
				}
			}

			this.update();			
		}
							
		function update() {
			localStore.set('shoppingList',list);	
		}	
	}
})();