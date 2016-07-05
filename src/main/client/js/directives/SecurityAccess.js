'use strict';

angular.module('logicline.directives')
.directive('access', [
'appAuthorizationService',

function (appAuthorizationService) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
          var roles = attrs.access.split(',');
          if (roles.length > 0) {
            determineVisibility(true);
          }

          function makeVisible() {
            element.removeClass('display--hidden');
          }

          function makeHidden(isRendered) {
            if (isRendered && isRendered.toLowerCase() === 'true') {
              element.addClass('display--hidden');
            } else {
              element.remove();
            }
          }

          function determineVisibility(resetFirst) {
              if (resetFirst) {
                  makeVisible();
              }
              var result = appAuthorizationService.authorize(true, roles, attrs.accessPermissionType);
              if (result === appAuthorizationService.enums.authorised.authorised) {
                  makeVisible();
              } else {
                  makeHidden(attrs.accessIsRendered);
              }
          }
      }
    };
}]);
