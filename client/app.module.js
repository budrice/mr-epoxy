(function () {

	'use strict';

	let app = angular.module('app', [
		'ngAnimate', 'ngRoute', 'ngSanitize', 'angularCSS'
	]);
	app.config(['$locationProvider', ($locationProvider) => {
		$locationProvider.hashPrefix('');
	}]);
	app.run(['$rootScope', 'AppService', '$location', 'msgbox', ($rootScope, AppService, $location, msgbox) => {
		// $rootScope.product = { filename: 'blank.jpg' };
		Array.prototype.getDefaultNavLinks = () => {
			let user_object = JSON.parse(window.sessionStorage.getItem('USER_OBJ'));
			let nav_array = [{
				hash: 'history',
				label: 'History'
			},
			{
				hash: 'products',
				label: 'Products'
			},
			{
				hash: 'contact',
				label: 'Contact'
			}];
			if (user_object !== null) {
				if (user_object.data) {
					if (user_object.data.access_level === 3) {
						nav_array.push({
							hash: 'admin',
							label: 'Admin'
						});
					}
				}
			}
			return nav_array;
		};
		$rootScope.$on('$locationChangeStart', (event, next) => {
            let user_object = JSON.parse(window.sessionStorage.getItem('USER_OBJ'));
			if (user_object !== null) {
				if (user_object.data) {
					if (user_object.data.token) {
                        let key = user_object.data.token.key;
						AppService.BasicSearch('member', 'token', key, key, user_object.data.id).then((result) => {
							if (result.data.length === 0) {
								msgbox.warning('Redirecting to login.');
								window.sessionStorage.removeItem('USER_OBJ');
								$location.reload();
							}
							else {
								if (!user_object.data) {
									msgbox.warning('Redirecting to login.');
									window.sessionStorage.removeItem('USER_OBJ');
									$location.reload();
									if (!user_object.data.token) {
										msgbox.warning('Redirecting to login.');
										window.sessionStorage.removeItem('USER_OBJ');
										$location.reload();
									}
								}
								if ((next.endsWith('admin') || next.endsWith('admin/')) && user_object.data.access_level < 3) {
									msgbox.warning('Redirecting to login.');
									window.sessionStorage.removeItem('USER_OBJ');
									$location.reload();
								}
							}
						}, (error) => {
							console.log(error);
						});
					}
				}
			}
		});
	}]);
})();
