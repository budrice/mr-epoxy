(function () {

    'use strict';

    angular.module('app').factory('ProductService', ProductService);

    ProductService.$inject = ['$http'];
    function ProductService($http) {

        return {
            GetProducts: getProducts,
            GetCart: getCart
        };

        function getProducts() {
            return new Promise((resolve, reject) => {
                $http.get('/api/database/getproducts').then((result) => {
                    resolve(result);
                }, (error) => {
                    reject(error);
                });
            });
        }

        function getCart(id, token) {
            return new Promise((resolve, reject) => {
                $http({
                    url: '/api/database/getcart/' + id,
                    method: 'GET',
                    headers: {
                        'x-access-token': token
                    }
                }).then((result) => {
                    resolve(result);
                }, (error) => {
                    reject(error);
                })
            });
        }

    }
})();
