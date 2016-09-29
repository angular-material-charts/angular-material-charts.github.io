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
