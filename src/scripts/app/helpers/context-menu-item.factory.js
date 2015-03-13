(function() {
	'use strict';
	
	angular.module('Basket')
		.factory('ContextMenuItem',ContextMenuItem);
	
	function ContextMenuItem() {
		Service.prototype = {};
		
		function Service(config) {
			this.title = config.title;
			this.fn = config.fn;
			this.extra = config.extra;
		}
		
		return Service;
	}
})();