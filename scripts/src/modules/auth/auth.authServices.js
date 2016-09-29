(function () {
    'use strict';

    angular
      .module('la.auth')
      .factory('authService', authService);

    authService.$inject = ['$http', '$window', '$q', '$rootScope'];
    function authService($http, $window, $q, $rootScope) {
        var defer = $q.defer();
        var service = {
            getToken: getToken,
            register: register,
            login : login,
            logout : logout,
            checkLoggedIn : checkLoggedIn,
            getCurrentUserData : getCurrentUserData,
            changePassword : changePassword
        };

        return service;

        function saveToken(token) {
            $window.localStorage['auth-token'] = token;
        }

        function getToken() {
            return $window.localStorage['auth-token'];
        }

        function checkLoggedIn() {
            var token = getToken();
            var payload;

            if(token){
              payload = token.split('.')[1];
              payload = $window.atob(payload);
              payload = JSON.parse(payload);

              return (payload.exp > Date.now() / 1000);
            }

            else {
              return false;
            }
        }

        function getCurrentUserData() {
            if(checkLoggedIn()){
              var token = getToken();
              var payload = token.split('.')[1];
              payload = $window.atob(payload);
              payload = JSON.parse(payload);
              return {
                email : payload.email,
                name : payload.name,
                id : payload._id
              };
            }
            else{
                return null;
            }
        }

        function register(user) {
            $http.post('/api/auth/register', user)
                .then(registerSuccess)
                .catch(registerFailure);
            return defer.promise;
        }

        function registerSuccess(response) {
            saveToken(response.data.token);
            defer.resolve(response.data.token);
        }

        function registerFailure(error) {
            console.log(error);
            defer.reject(error);
        }

        function login(user){
            $http.post('/api/auth/login',user)
                .then(loginSuccess)
                .then(getUserSuccess)
                .catch(loginFailure);
            return defer.promise;
        }

        function loginSuccess(response) {
            saveToken(response.data.token);
            var payload = getCurrentUserData();
            var userLink = '/api/users/' + payload.id;
            return $http.get(userLink);
        }

        function getUserSuccess(response) {
            $rootScope.user = response.data;
            defer.resolve(response.data);
        }

        function loginFailure(error) {
            console.log("in service",error.data.message);
            defer.reject(error);
        }

        function logout() {
            var user = getCurrentUserData();
            var logoutLink = "/api/users/"+user.id+"/logout";
            $http.get(logoutLink)
            .then(logoutSuccess)
            .catch(logoutFailure);
            return defer.promise;
        }

        function logoutSuccess(response) {
            $window.localStorage.removeItem('auth-token');
            defer.resolve(response);
        }

        function logoutFailure(error) {
            defer.reject(error);
        }

        function changePassword(passwordObject) {
            var user = getCurrentUserData();
            var changePasswordLink = "/auth/"+user.id+"/changePassword";
            $http.patch(changePasswordLink,passwordObject)
                .then(changePasswordSuccess)
                .catch(changePasswordFailure);

            return defer.promise;
        }

        function changePasswordSuccess(response) {
            defer.resolve(response);
        }

        function changePasswordFailure(error) {
            defer.reject(error);
        }
    }
})();
