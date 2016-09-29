(function () {
    'use strict';

    angular
      .module('la.settings')
      .controller('SettingsController', SettingsController);

    SettingsController.$inject = [];
    function SettingsController() {
        var vm = this;

        vm.user = {
            name : "Ashish Jain",
            email : "ashishjain@ashishluxure.com",
            mobileno : "9090909090",
            address : ""
        };

        vm.editInfo = false;
        vm.addAddress = false;

        angular.extend(vm, {
            editInformation : editInformation,
            saveInformation : saveInformation,
            addAddressInformation : addAddressInformation
        });

        activate();

        function activate() {

        }

        function editInformation() {
            vm.editInfo = true;
        }

        function saveInformation() {
            vm.editInfo = false;
            if (vm.user.address === "") {
                vm.addAddress = false;
            }
        }

        function addAddressInformation() {
            vm.editInfo = true;
            vm.addAddress = true;
        }


    }
})();
