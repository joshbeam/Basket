(function() {
	'use strict';
	
	angular.module('Basket')
		.factory('localStore',localStore);
	
	function localStore() {
		var exports = {
			get: get,
			set: set,
			recreate: recreate
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
		
			/*
				JSON.stringify doesn't preserve the chain
				http://stackoverflow.com/questions/8779249/how-to-stringify-inherited-objects-to-json
				
				And it can't stringify functions...
				Therefore, we can:
				1) serialize the function and eval it (http://stackoverflow.com/a/6755052/2714730), or
				2) recreate it (http://stackoverflow.com/questions/15472005/setting-prototype-for-object-literal)
				
				I choose to recreate it, here.
			*/
		function recreate(arrOfObjs, objPrototype) {
			if(arrOfObjs && arrOfObjs.length) {
				var newObj, newArr = [], key;

				angular.forEach(arrOfObjs,function(obj) {
					//Object.create in IE9+
					newObj = Object.create(objPrototype);
					for(key in obj) {
						newObj[key] = obj[key];	
					}
					newArr.push(newObj);
				});	

				return newArr;
			} else {
				return;	
			}
		}
	}
})();