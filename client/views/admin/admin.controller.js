(function () {

    'use strict';

    angular.module('app')
    .controller('AdminController', AdminController);

    AdminController.$inject = ['$scope', 'AppService', '$location', '$filter', 'msgbox'];
    function AdminController($scope, AppService, $location, $filter, msgbox) {
        let token = {};
        let user_object = JSON.parse(window.sessionStorage.getItem('USER_OBJ'));
        if (!user_object) {
            $location.path('/login/');
        }
        else {
            token = user_object.data.token;
        }
        
        console.log(token.key);

		$scope.users = [];
		
		function getList() {

			return new Promise((resolve, reject) => {
				AppService.BasicSearch('member', 'all_cols', true, token.key, token.id).then((result) => {
					if (result.error) {
						console.log(result.error);
						msgbox.warning('you broke it, you bought it...');
					}
					else {
						resolve(result.data);
					}
				}, (error)=> { reject(error); });
			});
		}
		
		function formatDates(data_row) {
			return new Promise((resolve) => {
				let date_fields = ['date_join', 'date_last_login'];
				let search_result = angular.copy(data_row);
				date_fields.forEach((field)=> {
					search_result[field] = $filter('date')(new Date(data_row[field]), 'MM/dd/yyyy h:mm a');
				});
                // console.log(data_row.remove);
                data_row.remove = (data_row.remove === 1) ? true : false;
				resolve(search_result);
			});
		}
		
		function populateList(data_row) {
			$scope.users.push(data_row);
			$scope.$apply();
		}
		
		$scope.admin = {};
		$scope.toogle = false;
		$scope.toggleModal = (user)=> {
			$scope.toggle = true;
			$scope.admin = user;
		};
		
		$scope.update = (table, id, updt_obj) => {
            let update_object = {};
            update_object.table = table;
            update_object.id = id;
            update_object.values = {};
            update_object.values = updt_obj;
            AppService.Update(update_object)
            .then((result)=> {
                if (result.error) {
                    console.log(result);
                }
            }, (error)=> {
                console.log(error);
            });
        };
		
		init();
		function init() {
			$scope.users = [];
			getList().then((array) => {
				array.forEach((row)=> {
					formatDates(row)
					.then(populateList);
				});
			});
			
		}
        
    }
	
})();