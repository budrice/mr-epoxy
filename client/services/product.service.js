(function () {

    'use strict';

    angular.module('app')
        .factory('ProductService', ProductService);

    ProductService.$inject = ['$http'];
    function ProductService($http) {

        return {
            GetProducts: getProducts
        };

        function getProducts() {
            console.log('getProducts service...');
            return new Promise((resolve, reject) => {
                $http.get('/api/v1/database/getproducts')
                    .then((result) => {
                        console.log(result);
                        resolve(result);
                    }, (error) => {
                        reject(error);
                    });
            });
        }

    }
})();
