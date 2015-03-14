(function() {
	'use strict';
	
	angular.module('Basket')
		.factory('colorGenerator',colorGenerator);
	
	function colorGenerator() {
		return factory;
		
		function factory(r,g,b) {
			var red = random(),
				green = random(),
				blue = random();

			red = Math.floor((red + r)/2);
			green = Math.floor((green + g)/2);
			blue = Math.floor((blue + b)/2);

			return rgbToHex(red,green,blue);

			//http://stackoverflow.com/a/5624139/2714730
			function rgbToHex(r, g, b) {
				return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
			}
			
			function random() {
				return Math.random() * (256 - 0) + 0;	
			}
		}
	}
})();