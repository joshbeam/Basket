(function() {
	'use strict';
	
	angular.module('Basket')
		.factory('Item',Item);
	
	function Item() {
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

			return this;
		}		
	}
})();