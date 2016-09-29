(function () {
    'use strict';

    angular
      .module('la.api')
      .factory('bagService', bagService);

    bagService.$inject = ['$http','$q'];
    function bagService($http,$q) {
        var defer = $q.defer();

        var service = {
            getBag : getBag,
            productFunctions : productFunctions,
        };
        return service;

        function getBag() {
            $http.get()
            .then()
            .catch();
        }

        function productFunctions() {
            
        }
    }
})();
