(function() {
	'use strict'
	
	angular.module('Basket')
	  .factory('localStore',localStore);
	
	function localStore() {
		return {
		  get: function(name) {
			if(window.localStorage && name) {
			  return angular.fromJson(localStorage.getItem(name));          
			}
		  },
		  set: function(name,arr) {
			if(window.localStorage && name && arr) {
			  localStorage.setItem(name,angular.toJson(arr));
			}

			// for chaining
			return this;
		  }
		};		
	}
})();