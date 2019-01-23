(function () {

    'use strict';

    angular.module("app")
        .config(($routeProvider) => {

            $routeProvider
                .when("/login/", {
                    templateUrl: "views/login/login.html",
                    controller: "LoginController",
                    css: [{ href: "/views/login/login.css" }]
                })
                .when("/home/", {
                    templateUrl: "views/home/home.html",
                    controller: "HomeController",
                    css: [{ href: "/views/home/home.css" }]
                })
                .when("/", {
                    templateUrl: "views/home/home.html",
                    controller: "HomeController",
                    css: [{ href: "/views/home/home.css" }]
                })
                .when("/products/", {
                    templateUrl: "views/products/products.html",
                    controller: "ProductsController",
                    css: [{ href: "/views/products/products.css" }]
                })
                .when("/history/", {
                    templateUrl: "views/history/history.html",
                    controller: "HistoryController",
                    css: [{ href: "/views/history/history.css" }]
                })
                .when("/contact/", {
                    templateUrl: "views/404.html",
                    controller: "HistoryController",
                    css: [{ href: "/views/history/history.css" }]
                });


        });

})();
