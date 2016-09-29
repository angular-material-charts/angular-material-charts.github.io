(function () {
    'use strict';

    angular
      .module('la.admin')
      .directive('adminUserCard', adminUserCard);

    function adminUserCard() {
      var directive = {
            restrict: 'E',
            templateUrl: '/templates/pages/admin/userCard.html',
            scope: {
                userdata : '='
            },
            link: linkFunc,
            controller: 'UserCardController',
            controllerAs: 'ucc'
        };

        return directive;

        function linkFunc($scope, $element, $attributes) {
            $scope.openCard = false;
            $scope.caret = 'expand_less';
            $scope.toggleCard = toggleCard;
            console.log($scope.userdata);

            function toggleCard() {
                $scope.openCard = !($scope.openCard);

                if($scope.openCard === true){
                    $scope.caret = 'expand_more';
                }
                else {
                    $scope.caret = 'expand_less';
                }
            }
        }
    }

    angular
      .module('la.admin')
      .controller('UserCardController', UserCardController);

    UserCardController.$inject = ['$scope'];
    function UserCardController($scope) {

    }
})();
