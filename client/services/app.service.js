(function () {

	'use strict';

	angular.module('app')
		.factory('AppService', AppService);

	AppService.$inject = ['$http'];
	function AppService($http) {

		return {
			Search: search,
			Insert: insert,
			Update: update,
			Register: register,
			Login: login,
			BasicSearch: basicSearch,
			IsLoggedIn: isLoggedIn,
			GetUserObject: getUserObject,
			SendEmail: sendEmail
		};

		function search(search_object) {
			return new Promise((resolve, reject) => {
				$http.get('/api/v1/database/search/' + search_object.table + '/' + search_object.column + '/' + search_object.value).then((result) => {
					resolve(result);
				}, (error) => {
					reject(error);
				});
			});
		}

		function insert(insert_object) {
			return new Promise((resolve, reject) => {
				$http({
					url: '/api/v1/database/insert',
					method: 'POST',
					data: insert_object
				}).then((result) => {
					resolve(result);
				}, (error) => {
					reject(error);
				});
			});
		}

		function update(update_object) {
			return new Promise((resolve, reject) => {
				$http({
					url: '/api/v1/database/update',
					method: 'PUT',
					data: update_object
				}).then((result) => {
					resolve(result);
				}, (error) => {
					reject(error);
				});
			});
		}


		function register(user_object) {
			return new Promise((resolve, reject) => {
				$http({
					method: 'POST',
					url: '/api/v1/database/register',
					data: user_object
				}).then((result) => {
					resolve(result);
				}, (error) => {
					reject(error);
				});
			});
		}

		function login(dataObj) {
			return new Promise((resolve, reject) => {
				$http({
					method: 'POST',
					url: '/api/v1/database/login',
					data: dataObj
				}).then((result) => {
					if (result.error) {
						console.log(result.error);
					}
					else {
						window.sessionStorage.setItem('USER_OBJ', JSON.stringify(result));
					}
					resolve(result);
				}, (error) => {
					reject(error);
				});

			});
		}

		function basicSearch(table, key, value) {
			return new Promise((resolve, reject) => {
				$http({
					method: 'GET',
					url: '/api/v1/database/basicsearch/' + table + '/' + key + '/' + value
				}).then((result) => {
					if (result.error) {
						reject(result);
					}
					else {
						resolve(result);
					}
				}, (error) => {
					reject(error);
				});
			});
		}

		/**
 * isLoggedIn
 * @return {Boolean} is logged in
 */
		function isLoggedIn() {
			let response = true;
			let userObj = JSON.parse(window.sessionStorage.getItem('USER_OBJ'));
			if (userObj === null) {
				response = false;
			}
			return response;
		}

		/**
		 * getUserObject
		 * @return {Object} user object carries token
		 */
		function getUserObject() {
			return JSON.parse(window.sessionStorage.getItem('USER_OBJ'));
		}


		function sendEmail(email_object) {
			return new Promise((resolve, reject) => {
				$http({
					method: 'POST',
					url: '/api/v1/email/send',
					data: email_object
				}).then((result) => {
					if (result.error) {
						reject(result);
					}
					else {
						resolve(result);
					}
				}, (error) => {
					reject(error);
				});
			});
		}


	}
})();
