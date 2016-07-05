'use strict';

/**
 * Global: Logout
 */
angular.module('logicline.directives')
.directive('logout', [
'$state',
'appAuthenticationService',

function($state, appAuthenticationService) {
  return {
    restrict: 'A',
    link: function(scope, element) {
      $(element).on('click', function() {
        appAuthenticationService.logout();
        $state.go('login');
      });
    }
  };
}]);