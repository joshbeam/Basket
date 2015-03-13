/*
	focus on an input element when ng-show is triggered
*/

//similar to: https://coderwall.com/p/a41lwa/angularjs-auto-focus-into-input-field-when-ng-show-event-is-triggered

(function() {
	angular.module('Basket')
		.directive('focusWhen',focusWhen);
		
	focusWhen.$inject = ['$timeout'];
	
	function focusWhen($timeout) {
		var d = {
			restrict: 'A',
			link: link
		}
			
		return d;
		
		//FIX THIS!!
		function link(scope, element, attrs) {
			scope.$watch(attrs.focusWhen, watchFn, true);		

			function watchFn(newVal) {
				var bool;

				if(attrs.focusWhen.constructor === Array) {
					angular.forEach(attrs.focusWhen,forEachFn);
					
					function forEachFn(b) {
						if(b === false) {
							bool = false;	
						}						
					}
				} else {
					bool = newVal;
				}
				
				$timeout(timeout);
				
				function timeout() {
					bool && element[0].focus();
				}				
			}
		}
	}

})();