(function() {
//	'use strict'
//	
//	angular.module('Basket')
//	  .controller('ListController',['$scope','items',function($scope,items) {
//		items.populate();
//
//		$scope.$watch(function() {
//		  return items.get('all');
//		}, function(newVal, oldVal) {
//		  $scope.list = newVal;
//		});
//
//		$scope.itemFunctions = {
//		  createNewItem: function() {
//			$scope.newItemInput = true;
//		  },
//		  add: function(desc) {
//			$scope.newItemInput = false;
//
//			items.add({
//			  description: desc,
//			  comments: ''
//			});
//
//			$scope.newItemDescription = '';
//		  },
//		  togglePurchased: function(item) {
//			var purchased = !item.get('purchased');
//			items.purchased(item.$$hashKey,purchased);
//		  },
//		  clearComplete: function() {
//			items.clearComplete();
//		  }
//		};
//
//	  }]);
})();