(function() {
	'use strict'
	
	angular.module('Basket')
		.factory('Person',Person);
	
	function Person() {
		Service.prototype = {
			get: get,
			set: set
		}
		
		function Service(config) {
			this.name = config.name;
			this.color = config.color;
		}
		
		return Service;
		
		/////////////////////
		
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