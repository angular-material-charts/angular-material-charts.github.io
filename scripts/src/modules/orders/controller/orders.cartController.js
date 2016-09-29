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
