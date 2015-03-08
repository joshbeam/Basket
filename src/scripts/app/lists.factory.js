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
				update: update
			};
		
		return exports;

		/////////////////////
		
		function populate() {
			var deferred = $q.defer();

			lists = localStore.get('lists') || [];

			deferred.resolve(lists);

			return deferred.promise;			
		}

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
			lists.push(new List(props));

			this.update();			
		}
							
		function update() {
			localStore.set('lists',lists);	
		}
	}
})();