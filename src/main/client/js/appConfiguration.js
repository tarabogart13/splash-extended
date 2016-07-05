'use strict';

angular.module('logicline')
/*localStorageServiceProvider */
.config(['localStorageServiceProvider', function(localStorageServiceProvider) {
  localStorageServiceProvider.setPrefix('logicline');
}])
/*
 * Avoid dynamically added field names getting ignored by the form validation
 * https://github.com/angular/angular.js/issues/1404
 */
.config(['$provide', function($provide) {
  $provide.decorator('ngModelDirective', ['$delegate', function($delegate) {
    var ngModel = $delegate[0],
    controller  = ngModel.controller;

    ngModel.controller = ['$scope', '$element', '$attrs', '$injector', function(scope, element, attrs, $injector) {
      var $interpolate = $injector.get('$interpolate');
      attrs.$set('name', $interpolate(attrs.name || '')(scope));
      $injector.invoke(controller, this, {
        '$scope'  : scope,
        '$element': element,
        '$attrs'  : attrs
      });
    }];

    return $delegate;
  }]);

  $provide.decorator('formDirective', ['$delegate', function($delegate) {
    var form   = $delegate[0],
    controller = form.controller;

    form.controller = ['$scope', '$element', '$attrs', '$injector', function(scope, element, attrs, $injector) {
      var $interpolate = $injector.get('$interpolate');
      attrs.$set('name', $interpolate(attrs.name || attrs.ngForm || '')(scope));
      $injector.invoke(controller, this, {
        '$scope'  : scope,
        '$element': element,
        '$attrs'  : attrs
      });
    }];

    return $delegate;
  }]);
}])
/* Translation */
.config(['$translateProvider', '$translatePartialLoaderProvider', function ($translateProvider, $translatePartialLoaderProvider) {
  $translatePartialLoaderProvider.addPart('buttons');
  $translatePartialLoaderProvider.addPart('navigation');
  $translatePartialLoaderProvider.addPart('login');
  $translatePartialLoaderProvider.addPart('dashboard');
  $translatePartialLoaderProvider.addPart('user');

  $translateProvider.useLoader('$translatePartialLoader', {
    urlTemplate: 'js/i18n/logicline/{part}/{lang}.json'
  });

  $translateProvider.preferredLanguage('en_US');
  $translateProvider.fallbackLanguage('en_US');
}]);