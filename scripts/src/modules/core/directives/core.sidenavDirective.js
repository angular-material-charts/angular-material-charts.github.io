(function () {
    'use strict';

    angular
      .module('la.core')
      .directive('alSidenavContainer', alSidenavContainer);

    function alSidenavContainer() {
        var directive = {
            restrict: 'EA',
            templateUrl: '/templates/components/sidenav/sidenavContainer.html',
            link : sidenavContainerLink,
            scope:{
                title : '@',
                icon : '@',
                options : '='
            },
            transclude: true
        };

        function sidenavContainerLink($scope,$element,$attributes) {
            $scope.showOptions = true;
            $scope.caret = 'expand_more';
            $scope.toggleOptions = toggleOptions;

            function toggleOptions() {
                $scope.showOptions = !($scope.showOptions);

                if($scope.showOptions=== true){
                    $scope.caret = 'expand_more';
                }
                else {
                    $scope.caret = 'expand_less';
                }
            }
        }

      return directive;
    }
})();
