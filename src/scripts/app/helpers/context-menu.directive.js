/*
*
*
*	Uses extra-menu-item directive
*
*
*/

(function() {
	'use strict';
	
	angular.module('Basket')
		.directive('contextMenu',contextMenu);
	
	contextMenu.$inject = ['$timeout','$compile'];
	
	function contextMenu($timeout,$compile) {
		var d = {
			restrict: 'A',
			link: link,
			controller: controller,
			controllerAs: 'ContextMenuCtrl',
		};
		
		return d;
		
		function controller() {
			var ContextMenuCtrl = this;
			
			ContextMenuCtrl.viewingExtras = false;
			ContextMenuCtrl.toggleViewExtras = function() {
				ContextMenuCtrl.viewingExtras = !ContextMenuCtrl.viewingExtras;
			}
		}
		
		function link(scope, element, attrs, ctrl) {			
			var states = scope.$eval(attrs.contextMenu),
				$el = $(element[0]),
				extraMenuItems = $el.children('li[extra-menu-item]'),
				numberOfExtraMenuItems = extraMenuItems.length;
						
			if(numberOfExtraMenuItems > 0) {
				//http://stackoverflow.com/a/28656670/2714730
				var menuEl = $compile([
						'<li>',
						'<button ng-click="ContextMenuCtrl.toggleViewExtras()">{{ContextMenuCtrl.viewingExtras === true ? "x" : "..."}}</button>',
						'</li>'
					].join(''))(scope);
				
				$el.append(menuEl);
			}
			
			scope.$watch(attrs.contextMenu, watchFn, true);	

			function watchFn(newVal) {
				var bool = true;

				if(newVal.constructor === Array) {
					angular.forEach(newVal,forEachFn);

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
					if(bool === true) {
						element[0].style.display = 'block';
					} else {
						element[0].style.display = 'none';
					}
				}				
			}			
		}
	}
	
})();