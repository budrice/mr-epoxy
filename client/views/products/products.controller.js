(function () {

    'use strict';

    angular.module('app')
        .controller('ProductsController', ProductsController);

    ProductsController.$inject = ['$scope', 'msgbox', 'AppService', 'ProductService', '$rootScope', '$location'];
    function ProductsController($scope, msgbox, AppService, ProductService, $rootScope, $location) {
        $scope.products = [];
        $scope.cart = {};
        $scope.cart.total = 0;
        $scope.cart.items = 0;

        let user_object = JSON.parse(window.sessionStorage.getItem('USER_OBJ'));
        
        getProducts();
        if(user_object) { getCart(); }

        function getProducts() {
            ProductService.GetProducts().then((result) => {
                $scope.products = result.data;
                $scope.$apply();
            }, (error) => {
                console.log(error);
            });
        }

        $scope.cart.show = false;
        function getCart() {
            AppService.GetInvoice(user_object.data.user_id, user_object.data.password, 0).then((result) => {
                parseCart(result.data);

                $scope.cart.show = result.data.length > 0 ? true: false;
            }, (error) => {

            });
        }

        function parseCart(cart_array) {
            cart_array.forEach((item) => {
                $scope.cart.items = $scope.cart.items + 1;
                $scope.cart.total = $scope.cart.total + item.total;
            });
        }

        $scope.goToCart = () => {
            $location.path('/cart/' + user_object.data.user_id + '/' + user_object.data.password + '/' + 1 + '/' + 0);
        }

    }
})();
