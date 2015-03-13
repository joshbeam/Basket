/*
*
*
*	For use with the context-menu directive
*
*
*/

(function() {
	'use strict';
	
	angular.module('Basket')
		.directive('extraMenuItem',extraMenuItem);
	
	function extraMenuItem() {
		var d = {
			restrict: 'A',
			require: '^contextMenu',
			link: link
		}
		
		return d;
		
		function link(scope, element, attrs, ctrl) {
			var $el = $(element[0]);
			
			$el.addClass('extra-menu-item');
			
			scope.$watch(function() {
				return scope.$eval('ContextMenuCtrl.viewingExtras');
			}, watchFn);
			
			function watchFn(newVal) {
				if(newVal === true) {
					$el.show();	
				} else if (newVal === false) {
					$el.hide();	
				}
			}
		}
	}
})();