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
