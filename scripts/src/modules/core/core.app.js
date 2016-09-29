(function () {
    'use strict';

    angular
      .module('la.core', [
        'ngAnimate',
        'ngMessages',
        'ngMaterial',
        'ui.router',
        'underscore',
        'ngFileUpload',
        'validation.match',
        'ngMdIcons',
        'la.auth',
        'string'
      ]);

    angular
        .module('la.core')
        .constant('TweenMax', TweenMax);

    angular
       .module('la.core')
       .run(initializeCore);

    initializeCore.$inject = ['$rootScope','$interval'];
    function initializeCore($rootScope,$interval) {
        active();
        function active() {
            preloader();
        }

        function preloader() {
            $rootScope.$on('$viewContentLoading',startPreloader);
            $rootScope.$on('$viewContentLoaded',stopPreloader);
        }

        function startPreloader() {
            $rootScope.pageTransition = true;
        }


        function stopPreloader() {
            $interval(function() {
                $rootScope.pageTransition = false;
            }, 2000);
        }
    }
})();
