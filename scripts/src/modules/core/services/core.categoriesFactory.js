(function () {
    'use strict';

    angular
      .module('la.core')
      .factory('categoriesService', categoriesService);

    categoriesService.$inject = ['$http','$q'];

    function categoriesService($http,$q) {
        var categories = [];
        var defer = $q.defer();

        var service = {
            getCategories : getCategories
        };

        return service;

        function getCategories() {
            $http.get("/dummydata/categories.json")
            .then(getCategoriesSuccess)
            .catch(getCategoriesFailure);
            return defer.promise;
        }


        function getCategoriesSuccess(response) {
            categories = response.data.categories;
            defer.resolve(categories);
        }

        function getCategoriesFailure(error) {
            defer.reject(error);
        }
    }
})();
