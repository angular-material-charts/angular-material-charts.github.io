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
