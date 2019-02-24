(function () {

    'use strict';

    angular.module('app')
        .directive('appProductlink', appProductlink);

    function appProductlink() {

        controller.$inject = ['$scope', '$rootScope', 'ProductService'];
        function controller($scope, $rootScope, ProductService) {

            init();
            function init() {
                if ($scope.linkIndex === 0) {
                    $rootScope.product = $scope.linkProduct;
                }
            }

            $scope.onActivate = () => {
                $rootScope.product = $scope.linkProduct;
            }

        }

        return {
            restrict: 'EA',
            scope: {
                linkProduct: '=',
                linkIndex: '='
            },
            controller: controller,
            templateUrl: 'directives/productlink/productlink.directive.html',
            css: [{ href: 'directives/productlink/productlink.directive.css' }]
        };

    }

})();
