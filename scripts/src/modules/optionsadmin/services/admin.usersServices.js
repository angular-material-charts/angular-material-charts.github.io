(function () {
    'use strict';

    angular
      .module('la.admin')
      .factory('adminUsersServices', adminUsersServices);

    function adminUsersServices($http,$q) {
        var defer = $q.defer();

        var service = {
            getAllUser : getAllUsers,
            updateUserRole : updateUserRole
        };

        return service;

        /*********
            params : {
                    "name" : "value"
                or  "role" : "customer / reseller"
            }

        ********/

        function getAllUsers (params) {
            var config = {};
            if(params){
                config = {
                    "params" : params
                };
            }

            $http.get('/api/admin/users',config)
                .then(getDataSucces)
                .catch(getDataFailure);

            return defer.promise;
        }

        function updateUserRole(id,object){
            var userLink = '/api/admin/users/' + id;
            $http.patch(userLink,object)
                .then(getDataSucces)
                .catch(getDataFailure);

            return defer.promise;
        }

        function getDataSucces(response) {
            defer.resolve(response);
        }

        function getDataFailure(error) {
            defer.reject(error);
        }
    }
})();
