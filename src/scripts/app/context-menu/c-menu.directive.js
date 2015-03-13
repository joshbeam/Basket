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
				subMenu = $('<ul class="sub-context-menu">'),
				li;
			
			angular.forEach(menuItems, forEachFn);
			$el.addClass('unstyled inline-list');
			
			if(subMenu.children().length > 0) {
				li = $('<li>');
				li.html('<button>...</button>');
				li.append(subMenu);
				subMenu = li.children('ul');
				
				subMenu.hide();
				
				li.on('click',function() {
					$(this).children('ul').slideToggle(250);
				});
				
				$('body').on('click', function(e) {
					if(subMenu.is(':visible') && $(e.target).parents('[c-menu]').length === 0) {
						subMenu.hide();
					}
				});

				$el.append(li);
			}
			
			function forEachFn(item) {
				newEl = $compile( [
						'<li>',
						'<button class="'+item.classString+'" ng-click="'+item.fn+'()">',
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