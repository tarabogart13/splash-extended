'use strict';

angular.module('logicline.controllers')
.controller('CustomerCtrl', [
'$state',
'$scope',
'$rootScope',
'$upload',
'apiUserService',

function($state, $scope, $rootScope, $upload, apiUserService) {
  var CustomerService = (
      function customerCreate() {
        $scope.createUser = function(isValid, userInformation) {
          $scope.userInformationSubmitted = true;
          if (isValid === true) {
            apiUserService.postInformation(userInformation).then(function(response) {
              $scope.updated = true;
            });
          };
        };
    

     function customerUpload() {
          $scope.fileUpload = function(files) {
              if (files && files.length) {
                  for (var i = 0; i < files.length; i++) {
                      var file = files[i];
                      $upload.upload({
                          method: 'POST',
                          url: $rootScope.origin + '/uploadFile',
                          file: file,
                          fields: {'name': file.name},
                          headers: {'token': $rootScope.User.token}
                      }).progress(function(evt) {
                          var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                          //console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                      }).success(function(data, status, headers, config) {
                          //console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
                          $scope.updated = true;
                      });
                  }
              }
          };

          $scope.validate = function(file) {
            if (file && /\.csv$/.test(file.name) && parseInt(file.size/1000000) < 50 ) {
              $scope.error = false;
              return true;
            }
            $scope.error = true;
            return false;
          };
     };

    return {
      CustomerCreate: customerCreate,
      CustomerUpload: customerUpload
    }
  }());

    $scope.updated = false;
  if ($state.current.name === 'customer_create') {
    CustomerService.CustomerCreate();
  }
  if ($state.current.name === 'customer_upload') {
    CustomerService.CustomerUpload();
  }
}]);