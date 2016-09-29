(function () {
    'use strict';

    angular
      .module('la.admin')
      .controller('ResellerController', ResellerController);

    ResellerController.$inject = [];
    function ResellerController() {
        var vm = this;
        vm.allUsers = [];
        vm.customers = [];
        vm.resellers = [];
        var joinedDate = new Date();

        vm.dummyUsers = [{
            "name" : "R Shashtri",
            "createdAt" : joinedDate,
            "mobileno" : 9825000021,
            "email" : "abcd@gmail.com",
            "address" : "51 - Avenue Street, Near Birkingham Palace, Bhimjipura, Gathkoper - 190061",
            "role" : "customer",
            "resellerRequest" : false
        },{
            "name" : "Binal Patel",
            "createdAt" : joinedDate,
            "mobileno" : 9821234521,
            "email" : "abcd@gmail.com",
            "address" : "51 - Avenue Street, Near Birkingham Palace, Bhimjipura, Gathkoper - 190061",
            "role" : "customer",
            "resellerRequest" : true
        },{
            "name" : "Abhinav Kashyap",
            "createdAt" : joinedDate,
            "mobileno" : 9826783451,
            "email" : "abcd@gmail.com",
            "address" : "51 - Avenue Street, Near Birkingham Palace, Bhimjipura, Gathkoper - 190061",
            "role" : "reseller",
            "resellerRequest" : true
        },{
            "name" : "Bindra Shetty",
            "createdAt" : joinedDate,
            "mobileno" : 9812456790,
            "email" : "abcd@gmail.com",
            "address" : "51 - Avenue Street, Near Birkingham Palace, Bhimjipura, Gathkoper - 190061",
            "role" : "reseller",
            "resellerRequest" : false
        }];

        angular.extend(vm, {
            // makeReseller : makeReseller
        });

        activate();

        function activate() {
            // getUsers();
        }

        // function getUsers() {
        //     adminUsersServices
        //     .getAllUsers()
        //     .then(getUsersSuccess)
        //     .catch(getUsersFailure);
        // }
        //
        // function getUsersSuccess (response) {
        //     vm.users = response.data;
        // }
        //
        // function getUsersFailure (error) {
        //     console.log(error);
        // }

        // function makeReseller(id) {
        //     var role = {
        //         "role" : "reseller"
        //     };
        //     adminUsersServices
        //     .updateUserRole(id,role)
        //     .then(makeResellerSuccess)
        //     .catch(makeResellerFailure);
        // }
        //
        // function makeResellerSuccess(response) {
        //
        // }
        //
        // function makeResellerFailure(error) {
        //     console.log(error);
        // }
        //
        // function removeReseller(id) {
        //
        // }
        //
        // function searchUser(text){
        //
        // }
    }
})();
