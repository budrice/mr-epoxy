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
            UserSearch: userSearch,
            BasicSearch: basicSearch,
            GetInvoice: getInvoice,
            UpdateUnassignedInvoice: updateUnassignedInvoice,
			IsLoggedIn: isLoggedIn,
			GetUserObject: getUserObject,
            SendEmail: sendEmail,
            RemoveCartItem: removeCartItem
		};

		function search(search_object) {
			return new Promise((resolve, reject) => {
				$http.get('/api/database/search/' + search_object.table + '/' + search_object.column + '/' + search_object.value).then((result) => {
					resolve(result);
				}, (error) => {
					reject(error);
				});
			});
		}

		function insert(insert_object) {
			return new Promise((resolve, reject) => {
				$http({
					url: '/api/database/insert',
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
					url: '/api/database/update',
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
					url: '/api/database/register',
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
					url: '/api/database/login',
					data: dataObj
				}).then((result) => {
					if (!result.error) {
						window.sessionStorage.setItem('USER_OBJ', JSON.stringify(result));
					}
					resolve(result);
				}, (error) => {
					reject(error);
				});

			});
        }
        
        
        function userSearch(key, value) {
			return new Promise((resolve, reject) => {
				$http({
					method: 'GET',
                    url: '/api/database/usersearch/' + key + '/' + value
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

        function basicSearch(table, key, value, token, id) {
			return new Promise((resolve, reject) => {
				$http({
					method: 'GET',
                    url: '/api/database/basicsearch/' + table + '/' + key + '/' + value + '/' + id,
                    headers: {
                        'x-access-token': token
                    }
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
        
        function getInvoice(id, key, invoice) {
			return new Promise((resolve, reject) => {
				$http({
					method: 'GET',
					url: '/api/database/getinvoice/' + id + '/' + key + '/' + invoice
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
        
        function updateUnassignedInvoice(inv, id) {
            return new Promise((resolve, reject) => {
                let data = { inv: inv, id: id };
                $http({
                    method: 'POST',
                    url: '/api/database/updateunassignedinvoice',
                    data: data
                }).then((result) => {
                    if (result.error) {
                        reject(error);
                    }
                    else {
                        resolve(true);
                    }
                }, (error) => {
                    reject(error);
                });
            });
        }

        function removeCartItem(id){ 
            return new Promise((resolve, reject) => {
                let data = { id: id };
                $http({
                    method: 'POST',
                    url: '/api/database/removecartitem',
                    data: data
                }).then((result) => {
                    if (result.error) {
                        reject(error);
                    }
                    else {
                        resolve(true);
                    }
                }, (error) => {
                    reject(error);
                });
            })
        }

		/**
         * isLoggedIn
         * @return {Boolean} is logged in
         */
		function isLoggedIn() {
			let response = true;
			let userObj = getUserObject();
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
            console.log(email_object);
			return new Promise((resolve, reject) => {
				$http({
					method: 'POST',
					url: '/api/emailer/send',
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
