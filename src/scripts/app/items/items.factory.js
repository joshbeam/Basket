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
				remove: remove,
				update: update
			};
		
		$rootScope.$on('itemSet',exec);
		
		function exec() {
			return exports.update();	
		}
		
		return exports;

		/////////////////////
		
		function populate() {
			list = localStore.recreate(localStore.get('shoppingList'),Item.prototype) || [];
			
			return list;
		}

		// probably don't need this...
		function get() {
			return list;	
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
		
		// should probably combine this with clearPurchased
		function remove(listName) {
			var i = list.length;
			
			while(i--) {
				if(list[i].get('list') === listName) {
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