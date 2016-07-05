'use strict';

angular.module('logicline')
.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $stateProvider
    /* Login */
    .state('login', {
      url          : '/system/login',
      templateUrl  : 'templates/system/login.html',
      controller   : 'LoginCtrl'
    })
    /* Dashboard */
    .state('dashboard', {
      url          : '/system/dashboard',
      templateUrl  : 'templates/system/dashboard.html',
      access: {
          requiresLogin: true,
          requiredPermissions: ['Admin', 'CSC Admin','User'],
          permissionType: 'AtLeastOne'
      }
    })
    /* User */
    .state('user_edit', {
      url          : '/user/edit/:userId',
      templateUrl  : 'templates/user/edit.html',
      controller   : 'UserCtrl',
      access: {
          requiresLogin: true,
          requiredPermissions: ['Admin', 'CSC Admin','User'],
          permissionType: 'AtLeastOne'
      }
    })
    /* customer search */
    .state('customer_search', {
      url          : '/search',
      templateUrl  : 'templates/search/search.html',
      controller   : 'SearchCtrl',
      access: {
          requiresLogin: true,
          requiredPermissions: ['Admin', 'CSC Admin'],
          permissionType: 'AtLeastOne'
      }
    })
    /* customer search */
    .state('customer_search_view', {
      url          : '/search',
      templateUrl  : 'templates/search/search.html',
      controller   : 'SearchCtrl',
      access: {
          requiresLogin: true,
          requiredPermissions: ['Admin', 'CSC Admin'],
          permissionType: 'AtLeastOne'
      }
    })
    /* customer edit */
    .state('customer_edit', {
      url          : '/user/edit/:userId',
      templateUrl  : 'templates/user/edit.html',
      controller   : 'UserCtrl',
      access: {
          requiresLogin: true,
          requiredPermissions: ['Admin', 'CSC Admin','User'],
          permissionType: 'AtLeastOne'
      }
    })

    /* customer create */
    .state('customer_create', {
      url          : '/customer/create',
      templateUrl  : 'templates/customer/create.html',
      controller   : 'CustomerCtrl',
      access: {
          requiresLogin: true,
          requiredPermissions: ['Admin', 'CSC Admin'],
          permissionType: 'AtLeastOne'
      }
    })
    /* Fallback */
    .state('otherwise', {
      url: '/system/login',
      authenticated: false
    });
    $urlRouterProvider.otherwise('/system/login');
}]);