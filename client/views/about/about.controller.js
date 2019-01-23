(function () {

    'use strict';

    angular.module('app')
	.controller('AboutController', AboutController);

    AboutController.$inject = ['$scope'];
    function AboutController($scope) {
        
        var userObj = {};
        userObj = JSON.parse(window.sessionStorage.getItem('USER_OBJ'));
		
		$scope.imagebox = [{
			icon: '../../images/web-design.png',
			icon_alt: 'VS',
			title: 'Web Developer / Programming',
			image: '../../images/code__.jpg',
			image_alt: 'code',
			img_frame_min: '584px',
			img_panel_min: '326px',
			panel_min: '286px'
		}];
        
    }
})();