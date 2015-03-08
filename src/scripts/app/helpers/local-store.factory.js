(function() {
	'use strict';
	
	angular.module('Basket')
		.factory('localStore',localStore);
	
	function localStore() {
		var exports = {
			get: get,
			set: set
		};
		
		return exports;
		
		function get(name) {
			if(window.localStorage && name) {
				return angular.fromJson(localStorage.getItem(name));          
			}			
		}
		
		function set(name,arr) {
			if(window.localStorage && name && arr) {
				localStorage.setItem(name,angular.toJson(arr));
			}

			// for chaining
			return this;			
		}	
	}
})();