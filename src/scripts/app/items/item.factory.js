(function() {
	'use strict';
	
	Item.$inject = ['$rootScope'];
	
	angular.module('Basket')
		.factory('Item',Item);
	
	function Item($rootScope) {
		Service.prototype = {
			get: get,
			set: set
		};
		
		function Service(props) {
			this.description = props.description;
			this.comments = props.comments;
			this.purchased = false;
			this.list = props.list;
		}

		return Service;

		//////////////////////////
		
		function get(prop) {
			if(prop in this) {
				return this[prop];
			}
		}

		function set(prop,val) {
			if(prop in this) {
				this[prop] = val;
			}
			
			$rootScope.$broadcast('itemSet');

			return this;
		}		
	}
})();