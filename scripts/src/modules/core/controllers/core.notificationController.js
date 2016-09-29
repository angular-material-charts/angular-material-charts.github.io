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
