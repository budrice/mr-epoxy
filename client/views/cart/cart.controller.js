(function () {

    'use strict';

    angular.module('app')
        .controller('CartController', CartController);

    CartController.$inject = ['$scope', '$routeParams', '$location', 'AppService', 'msgbox'];
    function CartController($scope, $routeParams, $location, AppService, msgbox) {

        $scope.customer = {};
        $scope.customer.cart = [];
        let id = $routeParams.id;
        let key = $routeParams.key;
        let page = $routeParams.page;
        let inv = $routeParams.inv;
        $scope.hide_back = (page == '0');

        getMember();
        function getMember() {
            AppService.UserSearch('id', id).then((result) => {
                $scope.customer = result.data[0];
                getInvoice();
            }, (error) => {
                console.log(error);
            })
        }

        function getInvoice() {
            AppService.GetInvoice(id, key, inv).then((result) => {
                $scope.customer.cart = result.data;
                populateTotal(result.data);
                $scope.$apply();
            }, (error) => {
                console.log(error);
            });
        }

        function populateTotal(data) {
            let t = 0;
            data.forEach((item) => {
                t = t + item.total;
            })
            $scope.customer.total = t;
        }

        $scope.goBack = () => {
            $location.path('/products/');
        }

        $scope.invoice = () => {
            updateInvoiceNumber();
        }

        function email_customer() {
            let user_object = JSON.parse(window.sessionStorage.getItem('USER_OBJ'));
            let html =   '<div class="container">';
            html +=          '<div class="row" style="background: rgb(205, 205, 205);">';
            html +=              '<div class="col-xs-1"></div>';
            html +=              '<div class="col-xs-10">';
            html +=                  '<div class="row" style="margin-top: 35px;">';
            html +=                      '<img src="https://mr-epoxy.com/images/mr-epoxy-email.png" alt="mr epoxy" class="img-responsive">';
            html +=                  '</div>';
            html +=                  '<div class="row">';
            html +=                      '<h3 style="text-align: center;">moisture mitigation epoxy</h3>';
            html +=                  '</div>';
            html +=              '</div>';
            html +=              '<div class="col-xs-1"></div>';
            html +=          '</div>';
            html +=          '<div class="row" style="margin-top: 35px;">';
            html +=              '<h3>Thank you ' + user_object.data.username + ',</h3>';
            html +=              '<h5>You have placed an order described below. One of our representatives will be glad to finalize this purchase.</h5>';
            html +=              '<h5>Click link to view invoice.</h5>';
            html +=              'https://mr-epoxy.com/#/cart/' + id + '/' + key + '/' + 0 + '/' + inv;
            html +=          '</div>';
            html +=      '</div>';

            let mail = {};
            mail.to = user_object.data.email;
            mail.subject = 'Mr Epoxy Order for ' + user_object.data.username;
            mail.html = html;
            AppService.SendEmail(mail).then((result) => {
                msgbox.success(result);
                $location.path('/products/');
                $scope.$apply();
                // email_lvl_3();
            });
            
            function email_lvl_3() {
                let html =   '<div class="container">';
                html +=          '<div class="row" style="background: rgb(205, 205, 205);">';
                html +=              '<div class="col-xs-1"></div>';
                html +=              '<div class="col-xs-10">';
                html +=                  '<div class="row" style="margin-top: 35px;">';
                html +=                      '<img src="https://mr-epoxy.com/images/mr-epoxy-email.png" alt="mr epoxy" class="img-responsive">';
                html +=                  '</div>';
                html +=                  '<div class="row">';
                html +=                      '<h3 style="text-align: center;">moisture mitigation epoxy</h3>';
                html +=                  '</div>';
                html +=              '</div>';
                html +=              '<div class="col-xs-1"></div>';
                html +=          '</div>';
                html +=          '<div class="row" style="margin-top: 35px;">';
                html +=              '<h3>An order was made by ' + user_object.data.username + ',</h3>';
                html +=              '<h5>Click link to view invoice.</h5>';
                html +=              'https://mr-epoxy.com/#/cart/' + id + '/' + key + '/' + 0 + '/' + inv;
                html +=          '</div>';
                html +=      '</div>';
    
                let mail = {};
                mail.to = '3eldis@gmail.com';
                mail.subject = 'Mr Epoxy Order for ' + user_object.data.username;
                mail.html = html;
                AppService.SendEmail(mail).then((result) => {
                    msgbox.success(result);
                });
            }
        }

        function updateInvoiceNumber() {
            let d = new Date();
            inv = d.getTime()
            AppService.UpdateUnassignedInvoice(inv, id)
            .then((result)=> {
                if (result.error) {
                    msgbox.warning('Something went wrong. Order was not completed.');
                }
                else {
                    email_customer()
                    msgbox.info('Update succeeded.');
                }
            }, (error)=> {
                msgbox.warning('Something went wrong. Order was not completed.');
            });
        }
        
        $scope.removeItem = (id) => {
            AppService.RemoveCartItem(id).then((result) => {
                getInvoice();
            }, (error) => {
                console.log(error);
            });
        };

    }
})();
