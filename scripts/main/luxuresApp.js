(function() {
    'use strict';

    angular
      .module('luxuresApp', [
          'la.core',
          'la.products',
          'la.settings',
          'la.upload',
          'la.admin',
          'la.orders'
      ]);
})();

(function () {
    'use strict';

    angular
      .module('la.api', []);
})();

(function () {
    'use strict';

    angular
      .module('la.api')
      .factory('bagService', bagService);

    bagService.$inject = ['$http','$q'];
    function bagService($http,$q) {
        var defer = $q.defer();

        var service = {
            getBag : getBag,
            productFunctions : productFunctions,
        };
        return service;

        function getBag() {
            $http.get()
            .then()
            .catch();
        }

        function productFunctions() {
            
        }
    }
})();

(function () {
    'use strict';

    angular
      .module('la.auth', []);
})();

(function () {
    'use strict';

    angular
      .module('la.auth')
      .factory('authInterceptor', authInterceptor);

    authInterceptor.$inject = ['$window','$q','$location'];
    function authInterceptor($window,$q,$location) {
        var service = {
            request : request,
            requestError : requestError,
            response : response,
            responseError : responseError
        };

        return service;

        function getToken() {
            if($window.localStorage['auth-token']){
                return $window.localStorage['auth-token'];
            }
            else {
                return null;
            }
        }

        function request(config) {
            var token = getToken();
            if(token !== null){
                var authHead = 'Bearer ' + token;
                config.headers['Authorization'] = authHead;
            }
            // console.log("Request",config);
            return config;
        }

        function requestError(rejection) {
            // console.log("Request Rejection",rejection);
            return $q.reject(rejection);
        }

        function response(response) {
            // console.log("response",response);
            return response || $q.when(response);
        }

        function responseError(rejection) {
            console.log("response rejection",rejection);
            if(rejection.status == 403){
                $location.path('/out');
            }
            return $q.reject(rejection);
        }
    }
})();

(function () {
    'use strict';

    angular
      .module('la.auth')
      .factory('authService', authService);

    authService.$inject = ['$http', '$window', '$q', '$rootScope'];
    function authService($http, $window, $q, $rootScope) {
        var defer = $q.defer();
        var service = {
            getToken: getToken,
            register: register,
            login : login,
            logout : logout,
            checkLoggedIn : checkLoggedIn,
            getCurrentUserData : getCurrentUserData,
            changePassword : changePassword
        };

        return service;

        function saveToken(token) {
            $window.localStorage['auth-token'] = token;
        }

        function getToken() {
            return $window.localStorage['auth-token'];
        }

        function checkLoggedIn() {
            var token = getToken();
            var payload;

            if(token){
              payload = token.split('.')[1];
              payload = $window.atob(payload);
              payload = JSON.parse(payload);

              return (payload.exp > Date.now() / 1000);
            }

            else {
              return false;
            }
        }

        function getCurrentUserData() {
            if(checkLoggedIn()){
              var token = getToken();
              var payload = token.split('.')[1];
              payload = $window.atob(payload);
              payload = JSON.parse(payload);
              return {
                email : payload.email,
                name : payload.name,
                id : payload._id
              };
            }
            else{
                return null;
            }
        }

        function register(user) {
            $http.post('/api/auth/register', user)
                .then(registerSuccess)
                .catch(registerFailure);
            return defer.promise;
        }

        function registerSuccess(response) {
            saveToken(response.data.token);
            defer.resolve(response.data.token);
        }

        function registerFailure(error) {
            console.log(error);
            defer.reject(error);
        }

        function login(user){
            $http.post('/api/auth/login',user)
                .then(loginSuccess)
                .then(getUserSuccess)
                .catch(loginFailure);
            return defer.promise;
        }

        function loginSuccess(response) {
            saveToken(response.data.token);
            var payload = getCurrentUserData();
            var userLink = '/api/users/' + payload.id;
            return $http.get(userLink);
        }

        function getUserSuccess(response) {
            $rootScope.user = response.data;
            defer.resolve(response.data);
        }

        function loginFailure(error) {
            console.log("in service",error.data.message);
            defer.reject(error);
        }

        function logout() {
            var user = getCurrentUserData();
            var logoutLink = "/api/users/"+user.id+"/logout";
            $http.get(logoutLink)
            .then(logoutSuccess)
            .catch(logoutFailure);
            return defer.promise;
        }

        function logoutSuccess(response) {
            $window.localStorage.removeItem('auth-token');
            defer.resolve(response);
        }

        function logoutFailure(error) {
            defer.reject(error);
        }

        function changePassword(passwordObject) {
            var user = getCurrentUserData();
            var changePasswordLink = "/auth/"+user.id+"/changePassword";
            $http.patch(changePasswordLink,passwordObject)
                .then(changePasswordSuccess)
                .catch(changePasswordFailure);

            return defer.promise;
        }

        function changePasswordSuccess(response) {
            defer.resolve(response);
        }

        function changePasswordFailure(error) {
            defer.reject(error);
        }
    }
})();

(function () {
    'use strict';

    angular
      .module('la.core', [
        'ngAnimate',
        'ngMessages',
        'ngMaterial',
        'ui.router',
        'underscore',
        'ngFileUpload',
        'validation.match',
        'ngMdIcons',
        'la.auth',
        'string'
      ]);

    angular
        .module('la.core')
        .constant('TweenMax', TweenMax);

    angular
       .module('la.core')
       .run(initializeCore);

    initializeCore.$inject = ['$rootScope','$interval'];
    function initializeCore($rootScope,$interval) {
        active();
        function active() {
            preloader();
        }

        function preloader() {
            $rootScope.$on('$viewContentLoading',startPreloader);
            $rootScope.$on('$viewContentLoaded',stopPreloader);
        }

        function startPreloader() {
            $rootScope.pageTransition = true;
        }


        function stopPreloader() {
            $interval(function() {
                $rootScope.pageTransition = false;
            }, 2000);
        }
    }
})();

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

(function () {
    'use strict';

    angular
      .module('la.admin', [
        'la.core'
      ]);
})();

(function () {
    'use strict';

    angular
      .module('la.orders', [
        'la.core'
      ]);
})();

(function () {
    'use strict';

    angular
        .module('la.products', [
            'la.core'
        ]);
})();

(function () {
    'use strict';

    angular
      .module('la.products')
      .controller('ProductsController', ProductsController);

    ProductsController.$inject = ['productsService','$stateParams'];
    function ProductsController(productsService,$stateParams) {
        var vm = this;

        vm.product = {};
        vm.addedToCart = false;
        vm.addedToWishlist = false;

        angular.extend(vm,{
            productAddToCart : productAddToCart,
            productAddToWishlist : productAddToWishlist
        });

        activate();

        function activate() {
            productsService.setProductsStateParams($stateParams);
            getSingleProduct();
        }

        function getSingleProduct() {
            productsService.getProducts()
                .then(getSingleProductSuccess)
                .catch(getSingleProductFailure);
        }

        function getSingleProductSuccess(response) {
            vm.product = response[0];
        }

        function getSingleProductFailure(error) {
            console.log(error);
        }

        function productAddToCart() {
            vm.addedToCart = !vm.addedToCart;
        }

        function productAddToWishlist() {
            vm.addedToWishlist = !vm.addedToWishlist;
        }
    }
})();

(function () {
    'use strict';

    angular
      .module('la.products')
      .factory('productsService', productsService);

    productsService.$inject = ['$http','$q'];
    function productsService($http,$q) {
        var products = [];
        var productStateParams = {};
        var service = {
            getProducts: getProducts,
            setProductsStateParams : setProductsStateParams,
            getProductsStateParams : getProductsStateParams
        };



        var defer = $q.defer();

        return service;

        function getProducts() {
            $http.get("/dummydata/products.json")
                .then(getProductsSuccess)
                .catch(getProductsFailure);
                return defer.promise;
        }

        function getProductsSuccess(response) {
            var products = response.data.products;
            defer.resolve(products);
        }

        function getProductsFailure(error) {
            defer.reject(error);
        }

        function getSingleProduct(id) {
            // if()
        }

        function setProductsStateParams(paramObject) {
            productStateParams = paramObject;
        }

        function getProductsStateParams() {
            return productStateParams;
        }
    }
})();

(function () {
    'use strict';

    angular
      .module('la.settings', [
        'la.core'
      ]);
})();

(function () {
    'use strict';

    angular
      .module('la.settings')
      .controller('SettingsController', SettingsController);

    SettingsController.$inject = [];
    function SettingsController() {
        var vm = this;

        vm.user = {
            name : "Ashish Jain",
            email : "ashishjain@ashishluxure.com",
            mobileno : "9090909090",
            address : ""
        };

        vm.editInfo = false;
        vm.addAddress = false;

        angular.extend(vm, {
            editInformation : editInformation,
            saveInformation : saveInformation,
            addAddressInformation : addAddressInformation
        });

        activate();

        function activate() {

        }

        function editInformation() {
            vm.editInfo = true;
        }

        function saveInformation() {
            vm.editInfo = false;
            if (vm.user.address === "") {
                vm.addAddress = false;
            }
        }

        function addAddressInformation() {
            vm.editInfo = true;
            vm.addAddress = true;
        }


    }
})();

(function () {
    'use strict';

    angular
      .module('la.settings')
      .factory('settingsService', settingsService);

    function settingsService() {
      var service = {

      };

      return service;

    
    }
})();

(function () {
    'use strict';

    angular
      .module('la.upload', [
        'la.core'
      ]);
})();

(function () {
    'use strict';

    angular
      .module('la.upload')
      .controller('UploadController', UploadController);

    UploadController.$inject = ['$scope','Upload','$timeout'];
    function UploadController($scope,Upload,$timeout) {
      var vm = this;

      angular.extend(vm, {
        upload: upload
      });

      activate();

      function activate() {

      }

      function upload() {

      }


        $scope.$watch('files', function () {
            $scope.upload($scope.files);
        });

        // $scope.$watch('file', function () {
        //     if ($scope.file !== null) {
        //         $scope.files = [$scope.file];
        //     }
        // });

        $scope.log = '';

        $scope.upload = function (files) {
            console.log("files",files);
            if (files && files.length) {
                for (var i = 0; i < files.length; i++) {
                        var file = files[i];
                        console.log("file:",file);
                        if (!file.$error) {
                        Upload.upload({
                            url: 'http://localhost:8000/api/upload',
                            data: {
                                username: $scope.username,
                                file: file
                            }
                        })
                        .then(resp1, null, evt1);
                    }

                }
            }
        };
        function resp1(resp) {
            $timeout(function() {
                $scope.log = 'file: ' +
                resp.config.data.file.name +
                ', Response: ' + JSON.stringify(resp.data) +
                '\n' + $scope.log;
            });
        }


        function evt1(evt) {
            var progressPercentage = parseInt(100.0 *
            evt.loaded / evt.total);
            $scope.log = 'progress: ' + progressPercentage +
            '% ' + evt.config.data.file.name + '\n' +
            $scope.log;
        }
    }

})();

(function () {
    'use strict';

    // angular
    //   .module('la.user', [
    //     'la.'
    //   ]);
})();

(function () {

})();

(function () {

})();

(function() {

    angular.module('la.core')
    .animation('.slide-horizontal', slideHorizontal);

    slideHorizontal.$inject = ['TweenMax'];

    function slideHorizontal(TweenMax) {
        return {
            addClass: addHideClass,
            removeClass: removeHideClass,
            enter : enter,
            leave : leave,
            move : move
        };
    }

    function addHideClass(element, className, done) {
      if (className == 'ng-hide') {
        TweenMax.set(element, {position:'relative'});
        TweenMax.fromTo(element, 0.5,
            {opacity:1, width:'100%', right:0},
            {opacity:0, width:0, right: -200,  ease: Power2.easeOut, onComplete: done}
        );
      }
      else {
        done();
      }
    }

    function removeHideClass(element, className, done) {
      if (className == 'ng-hide') {
        element.removeClass('ng-hide');
        TweenMax.set(element, {position:'relative'});
        TweenMax.fromTo(element, 0.5,
            {opacity:0, width:0, right: -200},
            {opacity:1, width:'100%',right:0, ease: Power2.easeIn, onComplete: done}
        ).delay(0.3);
      }
      else {
        done();
      }
    }

    function enter(element,done){
        TweenMax.set(element, {position:'relative', opacity:0, width:0, right: -200});
        TweenMax.to(element, 0.5, {opacity:1, width:'100%', right:0, ease: Power2.easeIn, onComplete:done}).delay(0.3);

    }

    function leave(element,done){
        TweenMax.set(element, {position:'relative'});
        TweenMax.to(element, 0.5, {opacity:0, width:0, onComplete:done});
    }

    function move(element,done) {
        TweenMax.to(element, 0.5, {opacity:1, width:'100%', right:0,ease: Power2.easeIn, onComplete:done})
        .delay(0.3);

    }
})();

(function() {

    angular.module('la.core')
    .animation('.slide-vertical', slideVertical);

    slideVertical.$inject = ['TweenMax'];

    function slideVertical(TweenMax) {
        return {
            addClass: addHideClass,
            removeClass: removeHideClass
        };
    }

    function addHideClass(element, className, done) {
      if (className == 'ng-hide') {
        // var timeline = new TimelineMax();
        TweenMax.set(element,{height:"auto", opacity:0});
        TweenMax.from(element, 0.3, {opacity: 1, ease: Power0.easeNone});
        TweenMax.to(element, 0.4, {height:0, ease:  Power2.easeOut, onComplete: done}).delay(0.25);
      }
      else {
        done();
      }

    }

    function removeHideClass(element, className, done) {
      if (className == 'ng-hide') {
        element.removeClass('ng-hide');
        TweenMax.set(element,{height:"auto", opacity:0});
        TweenMax.from(element, 0.4, {height:0, ease: Power2.easeIn});
        TweenMax.to(element, 0.3, {opacity: 1, ease: Power2.easeIn, onComplete:done}).delay(0.35);
      }
      else {
        done();
      }
    }
})();

(function () {
    'use strict';

    angular
      .module('la.core')
      .controller('InappController', InappController);

    InappController.$inject = ['$mdSidenav','authService','$state'];
    function InappController($mdSidenav,authService,$state) {
        var vm = this;

        angular.extend(vm, {
            openRightSidenav : openRightSidenav,
            isOpenRightSidenav : isOpenRightSidenav,
            openLeftSidenav : openLeftSidenav,
            closeRightSidenav : closeRightSidenav,
            logout : logout
        });

    //   activate();
    //   function activate() {
      //
    //   }

        function openRightSidenav() {
            $mdSidenav('right').open();
        }

        function openLeftSidenav() {
            $mdSidenav('left').open();
        }

        function isOpenRightSidenav() {
            return $mdSidenav('right').isOpen();
        }

        function closeRightSidenav() {
            $mdSidenav('right').close();
        }

        function logout() {
            authService.logout()
            .then(function (response) {
                console.log(response);
                $state.go('outapp');
            }).catch(function (error) {
                console.log(error);
            });
        }
    }
})();

(function () {
    'use strict';

    angular
      .module('la.core')
      .controller('NotificationsController', NotificationsController);

    // NotificationsController.$inject = ['$mdSidenav'];
    function NotificationsController() {
        var vm = this;

        angular.extend(vm, {
            // closeRightSidenav: closeRightSidenav
        });

    }
})();

(function () {
    'use strict';

    angular
      .module('la.core')
      .controller('OutappController', OutappController)
      .controller('LoginController',LoginController)
      .controller('RegisterController',RegisterController);

    LoginController.$inject= ['$mdDialog','authService','$rootScope','$state','$scope'];
    RegisterController.$inject= ['$mdDialog','authService','$rootScope','$state','$scope'];
    OutappController.$inject = ['$mdDialog','$mdMedia','$rootScope','$scope'];

    function LoginController($mdDialog, authService, $rootScope, $state, $scope) {
        var vm = this;
        vm.loginError = false;
        $scope.loginForm = {};

        angular.extend(vm, {
            login: login,
            closeDialog : closeDialog
        });


        function login() {
            authService.login(vm.user)
                .then(loginSuccess,loginFailure)
                .finally(resetLogin);
        }

        function loginSuccess(response){
            $mdDialog.hide();
            console.log("in controller success");
            $state.go('inapp.products');
        }

        function loginFailure(error){
            vm.loginError = true;
            vm.errorMessage = error;
            console.log("in controller",error);
        }

        function resetLogin() {
            vm.user = {};
            $scope.loginForm.$setPristine();
            $scope.loginForm.$setUntouched();
        }

        function closeDialog() {
            $mdDialog.cancel();
        }
    }

    function RegisterController($mdDialog, authService, $rootScope, $state, $scope) {
        var vm = this;
        vm.userJoin = 'customer';

        angular.extend(vm, {
            register: register,
            closeDialog : closeDialog
        });

        function register() {
            vm.requestLogin = true;

            authService.register(vm.user)
                .then(registerSuccess)
                .catch(registerFailure);
        }

        function registerSuccess(response){
            $mdDialog.hide();
            $state.go('inapp.dashboard.allProducts');
        }

        function registerFailure(error){
            console.log(error);
        }

        function closeDialog() {
            $mdDialog.cancel();
        }
    }


    function OutappController($mdDialog,$mdMedia, $rootScope, $scope) {
        var vm = this;

        angular.extend(vm, {
            openDialog: openDialog
        });

        $scope.$watch(function() {
            return $mdMedia('xs') || $mdMedia('sm');
        });

        function openDialog(event,query) {

            var useFullScreen = $mdMedia('sm') || $mdMedia('xs');
            var controllerQuery = query.charAt(0).toUpperCase() + query.slice(1) + 'Controller';
            var templateQuery = '/templates/components/dialogs/'+query+'.html';
            var controllerAsQuery = query.charAt(0)+'c';

            $mdDialog.show({
                controller: controllerQuery,
                controllerAs : controllerAsQuery,
                templateUrl : templateQuery,
                parent: angular.element(document.body),
                targetEvent : event,
                closeTo : {bottom:0},
                clickOutsideToClose : true,
                escapeToClose : true,
                fullScreen : useFullScreen
            });
        }



        activate();
        function activate() {

        }
    }
})();

(function () {
    'use strict';

    angular
      .module('la.core')
      .controller('SidenavController', SidenavController);


    function SidenavController() {
      var vm = this;
        vm.categories = [{
            "name" : "watches",
            "state" : ".products({category : 'watches', brand : '', sort : '', filter: ''})"
        },{
            "name" : "sun_glasses",
            "state" : ".products({category : 'sun_glasses', brand : '', sort : '', filter: ''})"
        },{
            "name" : "bags",
            "state" : ".products({category : 'bags', brand : '', sort : '', filter: ''})"
        }];

        vm.accountoptions = [{
            "name" : "wishlist",
            "state" : ".wishlist"
        },{
            "name" : "orders",
            "state" : ".orders"
        }];

        vm.settingoptions = [{
            "name" : "user information",
            "state" : ".profile"
        },{
            "name" : "change password",
            "state" : ".password"
        }];

        vm.adminoptions = [{
            "name" : "add product",
            "state" : ".admin.addproduct"
        },{
            "name" : "orders",
            "state" : ".admin.orders"
        },{
            "name" : "manage resellers",
            "state" : ".admin.users"
        },{
            "name" : "manage categories",
            "state" : ".admin.categories"
        }];
      activate();

      function activate() {

      }
    }
})();

(function () {
    'use strict';

    angular
      .module('la.core')
      .controller('SidenavDashboardController', SidenavDashboardController);

    SidenavDashboardController.$inject = ['_','categoriesService','$state','productsService','$rootScope'];
    function SidenavDashboardController(_,categoriesService,$state,productsService,$rootScope) {
        var vm = this;
        vm.optionSelected = optionSelected;
        vm.categories = [];

        activate();

        function activate() {
            setSidenavCategories();
        }

        function optionSelected($index,optionsList) {
            _.each(optionsList,selectOption);
            function selectOption(element,index,list) {
                if(index == $index){
                    element.selected = true;
                }
                else{
                    element.selected = false;
                }
            }
        }

        function setSidenavCategories() {
            console.log("set");
            categoriesService.getCategories()
            .then(setSidenavCategoriesSuccess)
            .catch(setSidenavCategoriesFailure);
        }

        function setSidenavCategoriesSuccess(response) {
            vm.categories = _.each(response,addSelectedFields);
            // console.log(vm.categories);
        }

        function setSidenavCategoriesFailure(error) {
            console.log(error);
        }

        function addSelectedFields(element,index,list) {
            var stateParams = productsService.getProductsStateParams();
            if(stateParams.category === element.name){
                return _.extend(element,{'selected' : true});
            }
            else{
                return _.extend(element,{'selected' : false});
            }
        }
    }
})();

(function () {
    'use strict';

    angular
      .module('la.core')
      .directive('alSidenavContainer', alSidenavContainer);

    function alSidenavContainer() {
        var directive = {
            restrict: 'EA',
            templateUrl: '/templates/components/sidenav/sidenavContainer.html',
            link : sidenavContainerLink,
            scope:{
                title : '@',
                icon : '@',
                options : '='
            },
            transclude: true
        };

        function sidenavContainerLink($scope,$element,$attributes) {
            $scope.showOptions = true;
            $scope.caret = 'expand_more';
            $scope.toggleOptions = toggleOptions;

            function toggleOptions() {
                $scope.showOptions = !($scope.showOptions);

                if($scope.showOptions=== true){
                    $scope.caret = 'expand_more';
                }
                else {
                    $scope.caret = 'expand_less';
                }
            }
        }

      return directive;
    }
})();

(function () {
    'use strict';

    angular
      .module('la.core')
      .factory('categoriesService', categoriesService);

    categoriesService.$inject = ['$http','$q'];

    function categoriesService($http,$q) {
        var categories = [];
        var defer = $q.defer();

        var service = {
            getCategories : getCategories
        };

        return service;

        function getCategories() {
            $http.get("/dummydata/categories.json")
            .then(getCategoriesSuccess)
            .catch(getCategoriesFailure);
            return defer.promise;
        }


        function getCategoriesSuccess(response) {
            categories = response.data.categories;
            defer.resolve(categories);
        }

        function getCategoriesFailure(error) {
            defer.reject(error);
        }
    }
})();

(function () {
    'use strict';

    angular
      .module('la.core')
      .filter('replaceUnderscore', replaceUnderscore);

    replaceUnderscore.$inject = ['string'];
    function replaceUnderscore(string) {
        return replaceUnderscoreFilter;

        function replaceUnderscoreFilter(input) {
            input = string(input).humanize().s;
            input = string(input).capitalize().s;
            return input;   
        }
    }
})();

(function () {
    'use strict';

    angular
      .module('la.admin')
      .controller('AddProductController', AddProductController);

    AddProductController.$inject = ['Upload','$scope','$http','_'];
    function AddProductController(Upload,$scope,$http,_) {
        var vm = this;
        vm.features = [];
        vm.categories = ['watches','bags','sun_glasses'];
        vm.brands = ['tag_huer','rado','gshock'];

        angular.extend(vm, {
            featureAdd : featureAdd,
            featureRemove : featureRemove,
            featureAddByEnter : featureAddByEnter,
            addCategory : addCategory,
            addCategoryByEnter : addCategoryByEnter,
            addBrand : addBrand,
            addBrandByEnter : addBrandByEnter
        });

        function featureAdd() {
            if(vm.feature.name && vm.feature.value)
            vm.features.push(vm.feature);
            vm.feature = null;
        }

        function featureRemove(feature) {
            vm.features = _.without(vm.features,feature);
        }

        function featureAddByEnter(event) {
            if(event.keyCode == 13){
                featureAdd();
            }
        }

        function addCategory() {
            vm.categories.push(vm.category);
            vm.product.category = vm.category;
            vm.category = null;
        }

        function addCategoryByEnter(event) {
            if(event.keyCode == 13){
                addCategory();
            }
        }

        function addBrand() {
            vm.brands.push(vm.brand);
            vm.product.brand = vm.brand;
            vm.brand = null;
        }

        function addBrandByEnter(event) {
            if(event.keyCode == 13){
                addBrand();
            }
        }

    }
})();

(function () {
    'use strict';

    angular
      .module('la.admin')
      .controller('CategoryController', CategoryController);

    function CategoryController() {
        var vm = this;
        vm.brands = ['tag_huer', "belmonte", "hublot", "hamilton", "casio", "citizen", "rado", "rolex"];
        vm.filters = ['style','belt','color','material'];

        vm.categories = [{
            "name" : "Watches",
            "brands" : ['tag_huer', 'belmonte', 'hublot', 'hamilton', 'casio', 'citizen', 'rado', 'rolex'],
            "filters" : ['style','belt','color','material']
        },{
            "name" : "Bags",
            "brands" : ['gucci','peter_england','zara','vip','fasttrack'],
            "filters" : ['type','color','material']
        }];

        angular.extend(vm, {

        });

        activate();

        function activate() {

        }

    }
})();

(function () {
    'use strict';

    angular
      .module('la.admin')
      .controller('ResellerController', ResellerController);

    ResellerController.$inject = [];
    function ResellerController() {
        var vm = this;
        vm.allUsers = [];
        vm.customers = [];
        vm.resellers = [];
        var joinedDate = new Date();

        vm.dummyUsers = [{
            "name" : "R Shashtri",
            "createdAt" : joinedDate,
            "mobileno" : 9825000021,
            "email" : "abcd@gmail.com",
            "address" : "51 - Avenue Street, Near Birkingham Palace, Bhimjipura, Gathkoper - 190061",
            "role" : "customer",
            "resellerRequest" : false
        },{
            "name" : "Binal Patel",
            "createdAt" : joinedDate,
            "mobileno" : 9821234521,
            "email" : "abcd@gmail.com",
            "address" : "51 - Avenue Street, Near Birkingham Palace, Bhimjipura, Gathkoper - 190061",
            "role" : "customer",
            "resellerRequest" : true
        },{
            "name" : "Abhinav Kashyap",
            "createdAt" : joinedDate,
            "mobileno" : 9826783451,
            "email" : "abcd@gmail.com",
            "address" : "51 - Avenue Street, Near Birkingham Palace, Bhimjipura, Gathkoper - 190061",
            "role" : "reseller",
            "resellerRequest" : true
        },{
            "name" : "Bindra Shetty",
            "createdAt" : joinedDate,
            "mobileno" : 9812456790,
            "email" : "abcd@gmail.com",
            "address" : "51 - Avenue Street, Near Birkingham Palace, Bhimjipura, Gathkoper - 190061",
            "role" : "reseller",
            "resellerRequest" : false
        }];

        angular.extend(vm, {
            // makeReseller : makeReseller
        });

        activate();

        function activate() {
            // getUsers();
        }

        // function getUsers() {
        //     adminUsersServices
        //     .getAllUsers()
        //     .then(getUsersSuccess)
        //     .catch(getUsersFailure);
        // }
        //
        // function getUsersSuccess (response) {
        //     vm.users = response.data;
        // }
        //
        // function getUsersFailure (error) {
        //     console.log(error);
        // }

        // function makeReseller(id) {
        //     var role = {
        //         "role" : "reseller"
        //     };
        //     adminUsersServices
        //     .updateUserRole(id,role)
        //     .then(makeResellerSuccess)
        //     .catch(makeResellerFailure);
        // }
        //
        // function makeResellerSuccess(response) {
        //
        // }
        //
        // function makeResellerFailure(error) {
        //     console.log(error);
        // }
        //
        // function removeReseller(id) {
        //
        // }
        //
        // function searchUser(text){
        //
        // }
    }
})();

(function () {
    'use strict';

    angular
      .module('la.admin')
      .directive('adminCategoryCard', adminCategoryCard);

    function adminCategoryCard() {
      var directive = {
            restrict: 'E',
            templateUrl: '/templates/pages/admin/categoryCard.html',
            scope: {
                category : '='
            },
            link: linkFunc,
            controller: 'CategoryCardController',
            controllerAs: 'ucc'
        };

        return directive;

        function linkFunc($scope, $element, $attributes) {
            $scope.edit = false;
            $scope.saveCategory = function(){
                $scope.edit = false;
            };
            $scope.editCategory = function(){
                $scope.edit = true;
            };
        }
    }

    angular
      .module('la.admin')
      .controller('CategoryCardController', CategoryCardController);

    CategoryCardController.$inject = ['$scope'];
    function CategoryCardController($scope) {

    }
})();

(function () {
    'use strict';

    angular
      .module('la.admin')
      .directive('adminUserCard', adminUserCard);

    function adminUserCard() {
      var directive = {
            restrict: 'E',
            templateUrl: '/templates/pages/admin/userCard.html',
            scope: {
                userdata : '='
            },
            link: linkFunc,
            controller: 'UserCardController',
            controllerAs: 'ucc'
        };

        return directive;

        function linkFunc($scope, $element, $attributes) {
            $scope.openCard = false;
            $scope.caret = 'expand_less';
            $scope.toggleCard = toggleCard;
            console.log($scope.userdata);

            function toggleCard() {
                $scope.openCard = !($scope.openCard);

                if($scope.openCard === true){
                    $scope.caret = 'expand_more';
                }
                else {
                    $scope.caret = 'expand_less';
                }
            }
        }
    }

    angular
      .module('la.admin')
      .controller('UserCardController', UserCardController);

    UserCardController.$inject = ['$scope'];
    function UserCardController($scope) {

    }
})();

(function () {
    'use strict';

    angular
      .module('la.admin')
      .factory('adminCategoryServices', adminCategoryServices);

    adminCategoryServices.$inject = ['$http','_','$rootScope','$q'];
    function adminCategoryServices($http,_,$rootScope,$q){
        var defer = $q.defer();

        var service = {

        };

        function createCategory(category){
            $http.post('/api/admin/categories',category)
                .then(createCategorySuccess)
                .catch(createCategoryFailure);

            return defer.promise;
        }

        function createCategorySuccess(response) {
            defer.resolve(response.data);
        }

        function createCategoryFailure(error) {
            defer.reject(error);
        }


        function addRemoveEditBrand(category,brand){
            var categoryLink = 'api/admin/categories/' + category._id;
            $http.patch(categoryLink,brand)
                .then(addRemoveEditBrandSuccess)
                .catch(addRemoveEditBrandFailure);

            return defer.promise;
        }

        function addRemoveEditBrandSuccess(response) {
            defer.resolve(response);
        }

        function addRemoveEditBrandFailure(error) {
            defer.reject(error);
        }

        function updateCategory(category) {
            var categoryLink = 'api/admin/categories/' + category._id;
            $http.put(category).then(updateCategorySucces).catch(updateCategoryFailure);
            return defer.promise;
        }

        return service;
    }
})();

/*************

    Create Category Body
    {
        "name" : "actual_category_name",
        "brands" : ["brand1","brand2"],
        "filters" : []
    }

    Patch brand
    {
        option : add/remove/edit
        brand : ifnew (camelcase)
        newBrand : ifedit (camelcase)
    }
*************/

(function () {
    'use strict';

    angular
      .module('la.admin')
      .factory('adminUsersServices', adminUsersServices);

    function adminUsersServices($http,$q) {
        var defer = $q.defer();

        var service = {
            getAllUser : getAllUsers,
            updateUserRole : updateUserRole
        };

        return service;

        /*********
            params : {
                    "name" : "value"
                or  "role" : "customer / reseller"
            }

        ********/

        function getAllUsers (params) {
            var config = {};
            if(params){
                config = {
                    "params" : params
                };
            }

            $http.get('/api/admin/users',config)
                .then(getDataSucces)
                .catch(getDataFailure);

            return defer.promise;
        }

        function updateUserRole(id,object){
            var userLink = '/api/admin/users/' + id;
            $http.patch(userLink,object)
                .then(getDataSucces)
                .catch(getDataFailure);

            return defer.promise;
        }

        function getDataSucces(response) {
            defer.resolve(response);
        }

        function getDataFailure(error) {
            defer.reject(error);
        }
    }
})();

(function () {
    'use strict';

    angular
      .module('la.orders')
      .controller('CartController', CartController);

    function CartController() {
      var vm = this;
      vm.product1 = {
        product : {
            name : "Tag Huer Monaco GT115",
            cost : 1200,
            category : "Watches",
            brand : "Tag Huer"
        },
        quantity : 1,
        subTotalCost : 1200
      };

      angular.extend(vm, {
        getOrders: getOrders
      });

      activate();

      function activate() {

      }

      function getOrders() {

      }
    }
})();

(function () {
    'use strict';

    angular
      .module('la.orders')
      .controller('CustomOrderController', CustomOrderController);

    CustomOrderController.$inject = ['Upload','$scope','_'];
    function CustomOrderController(Upload,$scope,_) {
        var vm = this;

        angular.extend(vm, {

        });

        activate();

        function activate() {
            $scope.$watch(vm.productImages);
        }
    }
})();

(function () {
    'use strict';

    angular
      .module('la.orders')
      .directive('cartProductCard', cartProductCard);

    function cartProductCard() {
        var directive = {
            restrict: 'E',
            templateUrl: '/templates/pages/others/cartProductCard.html',
            scope: {
                product: '='
            },
            link: linkFunc
            // controller: 'Controller',
            // controllerAs: 'vm',
        };

        return directive;

        function linkFunc($scope, $element, $attributes) {
            

            $scope.$watch('product.quantity',function () {
                $scope.product.subTotalCost = $scope.product.quantity * $scope.product.product.cost;
            });

        }
    }
})();

(function() {

    angular.module('la.core')
    .animation('.panelAnimation', slideVertical);

    slideVertical.$inject = ['TweenMax'];

    function slideVertical(TweenMax) {
        return {
            addClass: addHideClass,
            removeClass: removeHideClass
        };
    }

    function addHideClass(element, className, done) {
      if (className == 'ng-hide') {
        TweenMax.fromTo(element, 0.4,
            {opacity:1, height:'100%'},
            {opacity:0, height:0,  ease: Power2.easeOut, onComplete: done}
        ).delay(0.2);
      }
      else {
        done();
      }
    }

    function removeHideClass(element, className, done) {
      if (className == 'ng-hide') {
        element.removeClass('ng-hide');
        TweenMax.fromTo(element, 0.5,
            {opacity:0, height:0},
            {opacity:1, height:'100%',  ease: Power2.easeIn, onComplete: done}
        ).delay(0.5);
      }
      else {
        done();
      }
    }
})();
