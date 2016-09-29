(function () {
    'use strict';

    angular
      .module('la.orders')
      .directive('cartProductCard', cartProductCard);

    function cartProductCard() {
        var directive = {
            restrict: 'E',
            templateUrl: '/templates/pages/others/cartProductCard.html',
            scope: {
                product: '='
            },
            link: linkFunc
            // controller: 'Controller',
            // controllerAs: 'vm',
        };

        return directive;

        function linkFunc($scope, $element, $attributes) {
            

            $scope.$watch('product.quantity',function () {
                $scope.product.subTotalCost = $scope.product.quantity * $scope.product.product.cost;
            });

        }
    }
})();
