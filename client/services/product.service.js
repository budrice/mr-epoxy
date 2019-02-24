(function () {

    'use strict';

    angular.module('app').factory('ProductService', ProductService);

    ProductService.$inject = ['$http'];
    function ProductService($http) {

        return {
            GetProducts: getProducts
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

    }
})();
