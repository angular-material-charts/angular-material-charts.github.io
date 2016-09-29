(function () {
    'use strict';

    angular
      .module('la.upload')
      .controller('UploadController', UploadController);

    UploadController.$inject = ['$scope','Upload','$timeout'];
    function UploadController($scope,Upload,$timeout) {
      var vm = this;

      angular.extend(vm, {
        upload: upload
      });

      activate();

      function activate() {

      }

      function upload() {

      }


        $scope.$watch('files', function () {
            $scope.upload($scope.files);
        });

        // $scope.$watch('file', function () {
        //     if ($scope.file !== null) {
        //         $scope.files = [$scope.file];
        //     }
        // });

        $scope.log = '';

        $scope.upload = function (files) {
            console.log("files",files);
            if (files && files.length) {
                for (var i = 0; i < files.length; i++) {
                        var file = files[i];
                        console.log("file:",file);
                        if (!file.$error) {
                        Upload.upload({
                            url: 'http://localhost:8000/api/upload',
                            data: {
                                username: $scope.username,
                                file: file
                            }
                        })
                        .then(resp1, null, evt1);
                    }

                }
            }
        };
        function resp1(resp) {
            $timeout(function() {
                $scope.log = 'file: ' +
                resp.config.data.file.name +
                ', Response: ' + JSON.stringify(resp.data) +
                '\n' + $scope.log;
            });
        }


        function evt1(evt) {
            var progressPercentage = parseInt(100.0 *
            evt.loaded / evt.total);
            $scope.log = 'progress: ' + progressPercentage +
            '% ' + evt.config.data.file.name + '\n' +
            $scope.log;
        }
    }

})();
