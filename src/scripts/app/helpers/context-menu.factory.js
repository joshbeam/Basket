(function() {
	'use strict';
	
	angular.module('Basket')
		.factory('ContextMenu',ContextMenu);
	
	ContextMenu.$inject = ['ContextMenuItem'];
	
	function ContextMenu(ContextMenuItem) {
		Service.prototype = {
			get: get
		};
		
		function Service() {
			this.menuItems = [];
						
			angular.forEach(arguments, forEachFn.bind(this));
			
			return this.menuItems;
						
			function forEachFn(menuItem) {
				this.menuItems.push(new ContextMenuItem(menuItem));
			}
		}
		
		return Service;
		
		////////////////
		
		function get() {
			return this.menuItems;	
		}
	}
})();