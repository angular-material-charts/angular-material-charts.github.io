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
