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
                .when("/cart/:id/:key/:page/:inv", {
                    templateUrl: "views/cart/cart.html",
                    controller: "CartController",
                    css: [{ href: "/views/cart/cart.css" }]
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
                })
                .when("/admin/", {
                    templateUrl: "views/admin/admin.html",
                    controller: "AdminController",
                    css: [{ href: "/views/admin/admin.css" }]
                });

        });

})();
