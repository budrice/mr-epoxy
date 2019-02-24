(function () {

	'use strict';

	angular.module('app')
		.controller('HomeController', HomeController);

	HomeController.$inject = ['$scope'];
	function HomeController($scope) {
		$scope.title = 'Mr-Epoxy';
		$scope.desc = 'moisture mitigation epoxy';
        $scope.est = '~ est 1986 ~';
	}
})();
