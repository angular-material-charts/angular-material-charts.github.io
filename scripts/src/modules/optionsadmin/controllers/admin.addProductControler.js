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
