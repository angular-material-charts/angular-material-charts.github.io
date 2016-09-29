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
