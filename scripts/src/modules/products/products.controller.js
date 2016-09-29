(function () {
    'use strict';

    angular
      .module('la.products')
      .controller('ProductsController', ProductsController);

    ProductsController.$inject = ['productsService','$stateParams'];
    function ProductsController(productsService,$stateParams) {
        var vm = this;

        vm.product = {};
        vm.addedToCart = false;
        vm.addedToWishlist = false;

        angular.extend(vm,{
            productAddToCart : productAddToCart,
            productAddToWishlist : productAddToWishlist
        });

        activate();

        function activate() {
            productsService.setProductsStateParams($stateParams);
            getSingleProduct();
        }

        function getSingleProduct() {
            productsService.getProducts()
                .then(getSingleProductSuccess)
                .catch(getSingleProductFailure);
        }

        function getSingleProductSuccess(response) {
            vm.product = response[0];
        }

        function getSingleProductFailure(error) {
            console.log(error);
        }

        function productAddToCart() {
            vm.addedToCart = !vm.addedToCart;
        }

        function productAddToWishlist() {
            vm.addedToWishlist = !vm.addedToWishlist;
        }
    }
})();
