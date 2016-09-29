(function () {
    'use strict';

    angular
      .module('la.products')
      .factory('productsService', productsService);

    productsService.$inject = ['$http','$q'];
    function productsService($http,$q) {
        var products = [];
        var productStateParams = {};
        var service = {
            getProducts: getProducts,
            setProductsStateParams : setProductsStateParams,
            getProductsStateParams : getProductsStateParams
        };



        var defer = $q.defer();

        return service;

        function getProducts() {
            $http.get("/dummydata/products.json")
                .then(getProductsSuccess)
                .catch(getProductsFailure);
                return defer.promise;
        }

        function getProductsSuccess(response) {
            var products = response.data.products;
            defer.resolve(products);
        }

        function getProductsFailure(error) {
            defer.reject(error);
        }

        function getSingleProduct(id) {
            // if()
        }

        function setProductsStateParams(paramObject) {
            productStateParams = paramObject;
        }

        function getProductsStateParams() {
            return productStateParams;
        }
    }
})();
