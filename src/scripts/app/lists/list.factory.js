(function() {
	'use strict';
	
	angular.module('Basket')
		.factory('List',List);
		
	function List(localStore) {
		Service.prototype = {
			get: get,
			set: set
		};
		
		function Service(props) {
			this.name = props.name;
			this.items = [];
		}
		
		return Service;
		
		/////////////////
		
		function get(prop) {
			if(prop in this) {
				return this[prop];	
			}
		}
		
		function set(prop,val) {
			if(prop in this) {
				this[prop] = val;	
			}
			
			return this;
		}
		
	}
})();