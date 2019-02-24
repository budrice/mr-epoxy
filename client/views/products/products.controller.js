(function () {

    'use strict';

    angular.module('app')
        .controller('ProductsController', ProductsController);

    ProductsController.$inject = ['$scope', 'msgbox', 'ProductService', '$rootScope'];
    function ProductsController($scope, msgbox, ProductService, $rootScope) {
        $scope.products = [];
        ProductService.GetProducts().then((result) => {
            $scope.products = result.data;
            $scope.$apply();
        }, (error) => {
            console.log(error);
        });

    }
})();
