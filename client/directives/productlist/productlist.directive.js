(function () {

    'use strict';

    angular.module('app')
        .directive('appProductlist', appProductlist);

    function appProductlist() {
        controller.$inject = ['$scope', '$rootScope'];
        function controller($scope, $rootScope) {
            $scope.show_obj = {};
            $scope.$watch('products', (val) => {
                if (val.length > 0) {
                    val.forEach((product) => {
                        $scope.show_obj[product.item] = {};
                        $scope.show_obj[product.item] = { item: product.item, show: false };
                    });
                }
            });

            $rootScope.$watch('product', (val) => {
                if (val === undefined || $scope.show_obj[val.item] === undefined) { return; }
                setTimeout(() => {
                    $scope.show_obj[val.item].show = $scope.show_obj[val.item].item == val.item;
                    $scope.$apply();
                }, 0);
            });
        }

        return {
            restrict: 'EA',
            scope: {
                products: '='
            },
            controller: controller,
            templateUrl: 'directives/productlist/productlist.directive.html',
            css: [{ href: 'directives/productlist/productlist.directive.css' }]
        };
    }

})();
