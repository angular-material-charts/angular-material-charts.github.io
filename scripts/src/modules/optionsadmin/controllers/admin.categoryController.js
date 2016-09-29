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
