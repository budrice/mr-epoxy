(function () {

    'use strict';

    angular.module('app').controller('VerifyController', VerifyController);

    VerifyController.$inject = ['$scope', '$routeParams', '$location', 'AppService'];
    function VerifyController($scope, $routeParams, $location, AppService) {

        $scope.customer = {};
        
        let reg = $routeParams.reg;
        
        getMember((error) => { reject(error); })
        .then(postVerification, (error) => { reject(error); });

        function getMember() {
            return new Promise((resolve, reject) => {
                try {
                    AppService.UserSearch('reg_code', reg).then((result) => {
                        populateHtml(result.data[0]);
                        resolve(result.data[0]);
                    }, (error) => {
                        console.log(error);
                        reject(error);
                    });
                }
                catch(error) {
                    console.log(error);
                    reject(error);
                }
            });
            
        }

        function postVerification(db_result) {
            let update_object = {
                table: 'member',
                id: db_result.id,
                values: { verified: 1 }
            };
            try {
                AppService.Update(update_object).then((result) => {

                }, (error) => {
                    console.log(error);
                });
            }
            catch(error) {
                console.log(error);
            }
        }

        function populateHtml(db_result) {
            console.log(db_result);
            $scope.customer = db_result;
            $scope.$apply();
        }

        $scope.login = () => {
            $location.path('/login/');
        };
    }

})();
