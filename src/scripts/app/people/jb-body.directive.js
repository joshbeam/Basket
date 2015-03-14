(function() {
	'use strict';
	
	angular.module('Basket')
		.directive('jbBody',jbBody);
	
	jbBody.$inject = ['$location','$routeParams'];
	
	function jbBody($location,$routeParams) {
		var d = {
			restrict: 'A',
			link: link
		};
		
		return d;
		
		function link(scope, element, attrs) {
			scope.$watch(function() {
				return $routeParams;	
			}, function(n) {
					$(element[0]).on('click',onClick);

					function onClick(e) {
						if(!!n.listName) {
							if(!$(e.target).attr('person') && $(e.target).attr('person') !== '')	{
								//$location.path('/'+n.listName);
							}
						}
					}

			},true);
		}
	}
})();