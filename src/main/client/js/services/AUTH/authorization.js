'use strict';

angular.module('logicline.services').factory('appAuthorizationService', [
    'appAuthenticationService',

function(appAuthenticationService) {
    var enums = {
            authorised: {
                authorised: 0,
                loginRequired: 1,
                notAuthorised: 2
            },
            permissionCheckType: {
                atLeastOne: 'AtLeastOne',
                combinationRequired: 'CombinationRequired'
            }
        };

    function authorize(loginRequired, requiredPermissions, permissionCheckType) {
        var result = enums.authorised.authorised,
            user = appAuthenticationService.getCurrentUser(),
            hasPermission = true;
        permissionCheckType = permissionCheckType || enums.permissionCheckType.atLeastOne;

        if (loginRequired === true && !user) {
            result = enums.authorised.loginRequired;
        }
        else if ((loginRequired === true && !!user) &&
                    (requiredPermissions === undefined || requiredPermissions.length === 0)) {
            result = enums.authorised.authorised;
        }
        else if (user && requiredPermissions) {
            var loweredPermissions = [];
            angular.forEach(user.permissions, function (permission) {
                loweredPermissions.push(permission.toLowerCase());
            });

            for (var i = 0; i < requiredPermissions.length; i++) {
                var permission = requiredPermissions[i].toLowerCase();

                if (permissionCheckType === enums.permissionCheckType.combinationRequired) {
                    hasPermission = hasPermission && loweredPermissions.indexOf(permission) > -1;
                    // if all the permissions are required and hasPermission is false there is no point carrying on
                    if (hasPermission === false) {
                        break;
                    }
                } else if (permissionCheckType === enums.permissionCheckType.atLeastOne) {
                    hasPermission = loweredPermissions.indexOf(permission) > -1;
                    // if we only need one of the permissions and we have it there is no point carrying on
                    if (hasPermission) {
                        break;
                    }
                }
            }
            result = hasPermission ? enums.authorised.authorised : enums.authorised.notAuthorised;
        }
        return result;
    };

    function isAuthorized() {
        return appAuthenticationService.getCurrentUser() !== null;
    };

    function addUserToScope() {
        appAuthenticationService.setCurrentUser();
    };

    return {
        addUserToScope : addUserToScope,
        isAuthorized   : isAuthorized,
        authorize      : authorize,
        enums          : enums
    };
}]);
