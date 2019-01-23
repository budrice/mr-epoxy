(function () {

	'use strict';

	angular.module('app')
		.directive('budNavbar', budNavbar);

	function budNavbar() {

		controller.$inject = ['$scope', '$rootScope', '$location'];
		function controller($scope, $rootScope, $location) {

			$scope.title = 'mr-epoxy';
			$scope.links = [];
			$scope.user = {};
			// boolean to hide if on page login
			$scope.current_location = window.location.hash === '#/login/';

			/**
			 * view
			 * @param {String} hash
			 */
			$scope.view = (hash) => {
				$location.path("/" + hash + "/");
			};

			/**
			 * logout
			 */
			$scope.logout = () => {
				window.sessionStorage.removeItem("USER_OBJ");
				$location.path('/login/');
				window.location.reload();
			};

			$scope.$on('onBeforeUnload', function (e, confirmation) {
				confirmation.message = "All data willl be lost.";
				e.preventDefault();
			});

			let user_object = JSON.parse(window.sessionStorage.getItem('USER_OBJ'));
			$scope.username = (user_object !== null) ? user_object.data.username : '';
			$scope.log_btn = (user_object !== null) ? 'log out' : 'log in';

			$scope.$on('$routeChangeStart', function ($event, next) {
				if (next) {
					$scope.username = (user_object !== null) ? user_object.data.username : '';
					setTimeout(() => {
						$scope.current_location = window.location.hash === '#/login/';
						$scope.$digest();
					}, 0);
				}
			});
			let array = [];
			$scope.links = [];
			$scope.links = angular.copy(array.getDefaultNavLinks());
			$scope.css = {};
			//$scope.css = angular.copy(array.navStyle()[0]);
			$scope.current_location = window.location.hash === '#/login/';

			setTimeout(() => { $scope.$digest(); }, 0);
		}

		return {
			restrict: 'EA',
			scope: {
				navTitle: '@',
				navbarIcon: '@',
				navbarIconAlt: '@',
				linkCss: '=',
				hiddenCss: '@'
			},
			controller: controller,
			templateUrl: 'directives/navbar/bud.navbar.html',
			css: [{ href: 'directives/navbar/bud.navbar.css' }]
		};
	}

})();
