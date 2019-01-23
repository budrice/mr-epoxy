(function () {

    'use strict';

    angular.module('app')
        .controller('HistoryController', HistoryController);

    HistoryController.$inject = ['$scope'];
    function HistoryController($scope) {
        $scope.title = 'mr-epoxy';
        $scope.desc = 'moisture mitigation epoxy';
        $scope.est = '1986';
    }
})();
