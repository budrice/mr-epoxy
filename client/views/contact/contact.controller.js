(function () {

    'use strict';

    angular.module('app').controller('ContactController', ContactController);

    ContactController.$inject = ['$scope', 'AppService', 'msgbox'];
    function ContactController($scope, AppService, msgbox) {
		
		$scope.contact = {};
        let user_object = JSON.parse(window.sessionStorage.getItem('USER_OBJ'));
		
		/**
		 * send
		 */
		$scope.send = ()=> {
            if (!user_object) {
                msgbox.warning('You must be logged in to use contact form.');
            }
            else {
                if ($scope.contact_form.$dirty) {
                    let email = {
                        to: 'mrepoxyweb@gmail.com',
                        subject: $scope.contact.subject,
                        html: '<h4>Email from: ' + user_object.data.username + '.</h4><br><span>' + user_object.data.email + '</span><br><p>' + $scope.contact.message + '</p>'
                    };
                    AppService.SendEmail(email).then((result)=> {
                        $scope.contact = {};
                        $scope.$digest();
                        msgbox.info(result.data.message);
                    }, (error)=> {
                        msgbox.warning('Something went wrong!');
                        console.log(error);
                    });
                }
            }

		};
        
    }
	
})();