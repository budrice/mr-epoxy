(function () {

    'use strict';

    angular.module('app')
        .directive('appProductlist', appProductlist);

    function appProductlist() {
        return {
            restrict: 'EA',
            scope: {
                products: '='
            },
            templateUrl: 'directives/productlist/productlist.directive.html',
            css: [{ href: 'directives/productlist/productlist.directive.css' }]
        };
    }

})();
