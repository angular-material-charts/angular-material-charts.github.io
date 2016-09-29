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
