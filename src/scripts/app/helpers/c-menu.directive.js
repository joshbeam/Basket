(function() {
	'use strict';
	
	angular.module('Basket')
		.directive('cMenu',cMenu);
	
	cMenu.$inject = ['$timeout','$compile'];
	
	function cMenu($timeout,$compile) {
		var d = {
			restrict: 'A',
			link: link
		};
		
		return d;
		
		function link(scope, element, attrs) {			
			var menuItems = scope.$eval(attrs.cMenu),
				$el = $(element[0]),
				newEl,
				subMenu = $('<ul class="unstyled inline-list">'),
				li;
			
			angular.forEach(menuItems, forEachFn);
			$el.addClass('unstyled inline-list');
			
			if(subMenu.children().length > 0) {
				li = $('<li>');
				
				li.append(subMenu);

				$el.append(li);
			}
			
			function forEachFn(item) {
				console.log(item.fn);
				newEl = $compile( [
						'<li>',
						'<button ng-click="'+item.fn+'()">',
						item.title,
						'</button>',
						'</li>'
					].join('') )(scope);
				
				
				if(item.extra === false) {
					$el.append(newEl);
				} else {
					subMenu.append(newEl);
				}
			}
			
		}
	}
	
})();