'use strict';

angular.module('logicline.services').factory('appAuthenticationService', [
    'localStorageService',
    'apiUserService',
    '$rootScope',

function(localStorageService, apiUserService, $rootScope) {
    var _KEY = 'User',
        currentUser = null,
        username = null,
        rolesMap = {
            'default'           : 'User',
            'ROLE_CUSTOMER'     : 'User',
            'ROLE_ADMIN'        : 'Admin',
            'ROLE_CSC_OPERATOR' : 'CSC Admin'
        };

    function processLoginResults(response) {
        if (!angular.isUndefined(response) && !response.isError) {
            currentUser = createUser(response);
            setCurrentUser();
            return currentUser;
        }
        return response;
    };

    function createUser(user) {
        var User = {
            userId      : user.userId,
            token       : user.token,
            username    : user.firstName || username,
            permissions : [rolesMap[user.role] || rolesMap.default],
            isAdmin     : !!~user.role.indexOf('ROLE_ADMIN'),
            isCSCUser   : !!~user.role.indexOf('ROLE_CSC_OPERATOR') || !!~user.role.indexOf('ROLE_ADMIN'),
            isCustomer  : !!~user.role.indexOf('ROLE_CUSTOMER')
        };

        return User;
    };

    function login(credentials) {
        username  = credentials.username;
        if (credentials.recaptcha_response_field) {
            return apiUserService.clogin(credentials).then(processLoginResults);
        }
        return apiUserService.login(credentials).then(processLoginResults);
    };

    function logout() {
        localStorageService.remove(_KEY);
        $rootScope.User = null;
        currentUser = null;
    };
    
    function getCurrentUser() {
        if (currentUser === null) {
            currentUser = localStorageService.get(_KEY);
        }
        return currentUser;
    };

    function setCurrentUser() {
        if (!currentUser) {
            return;
        }
        $rootScope.User = currentUser;
        localStorageService.add(_KEY, currentUser);
    };

    return {
        login          : login,
        logout         : logout,
        getCurrentUser : getCurrentUser,
        setCurrentUser : setCurrentUser
    };
}]);