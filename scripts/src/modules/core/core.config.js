(function () {
    'use strict';

    angular.module('la.core')
        .config(config);

    config.$inject = ['$mdThemingProvider','$stateProvider','$urlRouterProvider','$locationProvider','$httpProvider',
    'ngMdIconServiceProvider'];

    function config($mdThemingProvider, $stateProvider, $urlRouterProvider, $locationProvider, $httpProvider,ngMdIconServiceProvider) {
        var themePalette = {
            primary: "light-blue",
            accent: "amber",
            warn: "red"
        };

        activate();

        function activate(){
            setTheme();
            setRoutes();
            addInterceptors();
            addIcons();
        }

        function addInterceptors() {
            $httpProvider.interceptors.push('authInterceptor');
        }

        function addIcons() {
            ngMdIconServiceProvider.addShape('add_favorite','<path d="M17.037,1.729c-1.947,0-3.816,0.907-5.037,2.339c-1.22-1.433-3.089-2.339-5.036-2.339c-3.448,0-6.157,2.708-6.157,6.156 c0,4.231,3.806,7.679,9.571,12.907L12,22.271l1.623-1.467c5.766-5.239,9.57-8.687,9.57-12.918 C23.193,4.438,20.486,1.729,17.037,1.729z M16,13h-3v3h-2v-3H8v-2h3V8h2v3h3V13z"/>');
        }

        function setTheme() {
            $mdThemingProvider.theme('default')
                .primaryPalette(themePalette.primary)
                .accentPalette(themePalette.accent)
                .warnPalette(themePalette.warn);
        }

        function setRoutes(){
            $locationProvider.html5Mode(true);
            $urlRouterProvider.when('/', '/products');
            $urlRouterProvider.otherwise('/products');
            $stateProvider
                .state("inapp",{
                    templateUrl : "/templates/layouts/inapp.html",
                    resolve : {
                        redirectIfNotLoggedIn : redirectIfNotLoggedIn
                    }
                })
                .state("outapp",{
                    url: "/out",
                    templateUrl : "/templates/layouts/outapp.html"
                })
                .state("inapp.products",{
                    url: "/products?category&brand&sort&filter",
                    templateUrl :  "/templates/pages/products/allProductsPage.html",
                    controller : "ProductsController",
                    controllerAs : "pc"
                })
                // .state("inapp.dashboard.products",{
                //     url: "/products?category&subCategory",
                //     templateUrl : "/templates/pages/products/singleProductPage.html",
                //     controller : "ProductsController",
                //     controllerAs : "pc"
                // })
                .state("inapp.product",{
                    url: "/products/:productId",
                    templateUrl : "/templates/pages/products/singleProductPage.html"
                })
                .state("inapp.profile",{
                    url : "/personal",
                    templateUrl : "/templates/pages/settings/personal.html",
                    controller : "SettingsController",
                    controllerAs : "sc"
                })
                // .state("inapp.buy",{
                //     views : {
                //         'sidenav' : {
                //             templateUrl : "/templates/components/sidenav/sidenav.buyOptions.html"
                //         },
                //         'content' : {
                //             templateUrl :  "/templates/layouts/plainView.html"
                //         }
                //     }
                // })
                .state("inapp.cart",{
                    url : "/cart",
                    templateUrl : "/templates/pages/others/cart.html"
                })
                .state("inapp.wishlist",{
                    url : "/wishlist",
                    templateUrl : "/templates/pages/others/wishlist.html"
                })
                .state("inapp.orders",{
                    url : "/orders",
                    templateUrl : "/templates/pages/others/customOrder.html"
                })
                // .state("inapp.settings.personal",{
                //     url : "/personal",
                //     templateUrl : "/templates/pages/settings/personal.html",
                //     controller : "SettingsController",
                //     controllerAs : "sc"
                // })
                .state("inapp.password",{
                    url : "/change_password",
                    templateUrl : "/templates/pages/settings/changePassword.html"
                })
                .state("inapp.admin",{
                    templateUrl : "/templates/layouts/plainView.html"
                })
                .state("inapp.admin.orders",{
                    url : "/admin/orders",
                    templateUrl : "/templates/pages/admin/orders.html"
                })
                .state("inapp.admin.users",{
                    url : "/admin/users",
                    templateUrl : "/templates/pages/admin/resellers.html"
                })
                .state("inapp.admin.categories",{
                    url : "/admin/categories",
                    templateUrl : "/templates/pages/admin/categories.html"
                })
                .state("inapp.admin.addproduct",{
                    url : "/admin/add_product",
                    templateUrl : "/templates/pages/admin/addproduct.html"
                });
        }
    }

    redirectIfNotLoggedIn.$inject = ['authService','$q','$state','$timeout'];
    function redirectIfNotLoggedIn(authService, $q, $state, $timeout){
        var defer = $q.defer();
        var authenticate = authService.checkLoggedIn();
        if(authenticate){
            defer.resolve();
        }
        else{
            console.log("inprocess");
            $timeout(function () {
                $state.go('outapp');
            });
            defer.reject();
        }

        return defer.promise;
    }

})();
