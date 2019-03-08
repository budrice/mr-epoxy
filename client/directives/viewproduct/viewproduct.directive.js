(function () {

    'use strict';

    angular.module('app').directive('appViewProduct', appViewProduct);

    function appViewProduct() {

        controller.$inject = ['$scope', '$filter', '$rootScope', '$location', 'AppService', 'msgbox'];
        function controller($scope, $filter, $rootScope, $location, AppService, msgbox) {

            let user_object = JSON.parse(window.sessionStorage.getItem('USER_OBJ'));

            !$scope.linkProduct ? 'blank.jpg' : $scope.linkProduct.filename;
            $scope.calulatePriceFromSqft = (sqft, spread) => {
                let gal = 0;
                let total = 0;
                gal = (sqft / spread);
                $scope.linkProduct.gallons =  Math.ceil(gal);
                total = $scope.linkProduct.amount * Math.ceil(gal);
                $scope.linkProduct.total = total;
                $filter('currency')($scope.linkProduct.total, "USD", 2);
            }

            $scope.calulatePriceFromGallons = (gal) => {
                let total = 0;
                total = $scope.linkProduct.amount * gal;
                $scope.linkProduct.total = total;
                $filter('currency')($scope.linkProduct.total, "USD", 2);
            }

            /**
             *  placeOrder
            */
            $scope.placeOrder = () => {
                if (!user_object) {
                    msgbox.warning('You must be logged in to complete that action.')
                    return;
                }
                else {
                    if ($scope.linkProduct.gallons > 0) {
                        let update_obj = {};
                        update_obj.table = 'customer';
                        update_obj.values = {
                            product_name: $scope.linkProduct.name,
                            quantity: $scope.linkProduct.gallons,
                            price: $scope.linkProduct.amount,
                            total: $scope.linkProduct.total,
                            member_id: user_object.data.user_id,
                            key: user_object.data.password
                        };
                        AppService.Insert(update_obj).then((result) => {
                            msgbox.success('Thank you for choosing Mr Epoxy.');
                            $location.path('/cart/' + user_object.data.user_id + '/' + user_object.data.password + '/' + 1 + '/' + 0);
                            $scope.$apply();
                        }, (error) => {
                            console.log(error);
                            msgbox.warning('Unable to place order.')
                        });

                    }
                    else {
                        msgbox.warning('enter a value for amount');
                    }
                }

            };


        }
        
        return {
            restrict: 'EA',
            scope: {
                linkProduct: '='
            },
            controller: controller,
            templateUrl: 'directives/viewproduct/viewproduct.directive.html',
            css: [{ href: 'directives/viewproduct/viewproduct.directive.css' }]
        };

    }
})();
