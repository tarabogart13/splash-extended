'use strict';

angular.module('logicline', [
  'ui.router',
  'logicline.controllers',
  'logicline.directives',
  'logicline.services',
  'logicline.filters',
  'restangular',
  'LocalStorageModule',
  'pascalprecht.translate',
  'angularFileUpload',
]).run([
  '$window',
  '$location',
  '$state',
  '$rootScope',
  '$timeout',
  'Restangular',
  'localStorageService',
  '$translate',
  'appAuthorizationService',

  function($window, $location, $state, $rootScope, $timeout, Restangular, localStorageService, $translate, appAuthorizationService) {
    if ($location.host() !== 'localhost') {
	  $rootScope.origin = $location.protocol() + '://' + $location.host() + ($location.port()? ':' + $location.port(): '');
      if ($location.protocol() !== 'https') {
		$window.location.href = $location.absUrl().replace('http', 'https');
	  }
    } else {
    $rootScope.origin = 'http://localhost:8080/splash-extended';
	}

    if (appAuthorizationService.isAuthorized()) {
      appAuthorizationService.addUserToScope();
    }

    var _stateName = null;
    $rootScope.$on('$stateChangeStart', function(event, toState) {
        if (toState.access) {
            var authorised = appAuthorizationService.authorize(toState.access.requiresLogin,
                                                               toState.access.requiredPermissions,
                                                               toState.access.permissionType);
            if (authorised === appAuthorizationService.enums.authorised.loginRequired) {
              _stateName  = 'login';
            }
            if (authorised === appAuthorizationService.enums.authorised.notAuthorised) {
              _stateName = 'dashboard';
            }
        }
    });

    $rootScope.$on('$stateChangeSuccess', function() {
      if (_stateName) {
        $state.go(_stateName);
        _stateName = null;
        return;
      }
      $rootScope.$state = $state;
    });

    // setup restangular
   Restangular.setBaseUrl($rootScope.origin);
    Restangular.setFullRequestInterceptor(function(element, operation, route, url, headers, params) {
      headers.token = $rootScope.User? $rootScope.User.token: null;
      return {
        element: element,
        params : params,
        headers: headers
      };
    });
    Restangular.addRequestInterceptor(function(data) {
      $('.content__inner').addClass('visibility--hidden');
      $timeout(function() {
        $('.preloader').css({
          'top'    : ($('.content__inner').position().top + $('nav').outerHeight()),
          'height' : ($('.content').outerHeight() - $('nav').outerHeight()),
          'display': 'block'
        });
      }, 800);
      return data;
    });
    Restangular.addResponseInterceptor(function(data) {
      $timeout(function() {
        $('.preloader').css('display', 'none');
        $('.content__inner').removeClass('visibility--hidden');
      }, 900);
      return data;
    });
    Restangular.setErrorInterceptor(function(response, deferred, responseHandler) {
        $timeout(function() {
          $('.preloader').css('display', 'none');
          $('.content__inner').removeClass('visibility--hidden');
        }, 900);
        return true;
    });

    /**
     * Language switch
     * @param  {string}  locale
     */
    if (localStorageService.get('locale')) {
      $translate.use(localStorageService.get('locale'));
    }
    $rootScope.languageSwitch = function(locale) {
      $translate.use(locale);
      localStorageService.add('locale', locale);
    };

    // Go to given state name
    $rootScope.goTo = function(path, params, allowed) {
      if (allowed !== false) {
        $state.go(path, params);
      }
    };
  }
]);