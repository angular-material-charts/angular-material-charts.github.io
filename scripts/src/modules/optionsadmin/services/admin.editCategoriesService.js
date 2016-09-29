(function () {
    'use strict';

    angular
      .module('la.admin')
      .factory('adminCategoryServices', adminCategoryServices);

    adminCategoryServices.$inject = ['$http','_','$rootScope','$q'];
    function adminCategoryServices($http,_,$rootScope,$q){
        var defer = $q.defer();

        var service = {

        };

        function createCategory(category){
            $http.post('/api/admin/categories',category)
                .then(createCategorySuccess)
                .catch(createCategoryFailure);

            return defer.promise;
        }

        function createCategorySuccess(response) {
            defer.resolve(response.data);
        }

        function createCategoryFailure(error) {
            defer.reject(error);
        }


        function addRemoveEditBrand(category,brand){
            var categoryLink = 'api/admin/categories/' + category._id;
            $http.patch(categoryLink,brand)
                .then(addRemoveEditBrandSuccess)
                .catch(addRemoveEditBrandFailure);

            return defer.promise;
        }

        function addRemoveEditBrandSuccess(response) {
            defer.resolve(response);
        }

        function addRemoveEditBrandFailure(error) {
            defer.reject(error);
        }

        function updateCategory(category) {
            var categoryLink = 'api/admin/categories/' + category._id;
            $http.put(category).then(updateCategorySucces).catch(updateCategoryFailure);
            return defer.promise;
        }

        return service;
    }
})();

/*************

    Create Category Body
    {
        "name" : "actual_category_name",
        "brands" : ["brand1","brand2"],
        "filters" : []
    }

    Patch brand
    {
        option : add/remove/edit
        brand : ifnew (camelcase)
        newBrand : ifedit (camelcase)
    }
*************/
