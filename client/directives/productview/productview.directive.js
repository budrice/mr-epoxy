(function () {

    'use strict';

    angular.module('app').directive('appProductview', appProductview);

    function appProductview() {

        controller.$inject = ['$scope', '$rootScope', 'msgbox'];
        function controller($scope, $rootScope, msgbox) {
            
            let user_object = JSON.parse(window.sessionStorage.getItem('USER_OBJ'));
            //$scope.product_to_view = {};
            //$scope.product_to_view.filename = 'blank.jpg';

            $scope.calulateGallons = (x) => {
                let gal = 0;
                gal = (x / 200);
                $scope.product_to_view.gallons = gal;
            }

            /**
             * placeOrder
             * places 
             */
            $scope.placeOrder = () => {

                if (!user_object) {
                    msgbox.warning('You must be logged in to complete that action.')
                    return;
                }
                if ($scope.product_to_view.gallons > 0) {
                    console.log('$' + ($scope.product_to_view.gallons * $scope.product_to_view.amount));
                }
                else {
                    msgbox.warning('enter a value for amount');
                }
            };
            $rootScope.$watch('product', (val) => {
                //$scope.product_to_view = val;
            });
        }

        return {
            restrict: 'EA',
            scope: {},
            controller: controller,
            templateUrl: 'directives/productview/productview.directive.html',
            css: [{ href: 'directives/productview/productview.directive.css' }]
        };

    }
})();
