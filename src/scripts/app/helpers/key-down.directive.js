(function() {
//http://stackoverflow.com/a/17364716/2714730
	
angular.module('Basket')
	.directive('keyDown', keyDown);
	
	function keyDown() {
		var d = {
			restrict: 'A',
			link: link
		};
		
		return d;
		
		function link(scope, element, attrs) {
			element.on('keydown', bindFn);

			function bindFn(event) {
				if(event.which === 13) {
					scope.$apply(applyFn);

					event.preventDefault();
				}

				function applyFn() {
					scope.$eval(attrs.keyDown, {'event': event});
				}
			}
		}
	}
})();