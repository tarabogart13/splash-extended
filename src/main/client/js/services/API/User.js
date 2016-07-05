'use strict';

/**
 * Services: API User
  */
angular.module('logicline.services')
.factory('apiUserService', [
'Restangular',
'apiBaseResponses',

function(Restangular, apiBaseResponses) {
  var user = {
    clogin: function(credentials) {
      return Restangular
              .all('user/clogin')
              .post(credentials)
              .then(apiBaseResponses.onSuccess, apiBaseResponses.onError);
    },
    login: function(credentials) {
      return Restangular
              .all('user/login')
              .post(credentials)
              .then(apiBaseResponses.onSuccess, apiBaseResponses.onError);
    },
    passwordReset: function(userId) {
      return Restangular
              .one('user/edit/password', userId)
              .customPOST()
              .then(apiBaseResponses.onSuccess, apiBaseResponses.onError);
    },
    getInformation: function(userId) {
      if (userId) {
        return Restangular
                .one('user/edit', userId)
                .get()
                .then(apiBaseResponses.onSuccess, apiBaseResponses.onError);
      } else {
        return Restangular
                .one('user/edit')
                .get()
                .then(apiBaseResponses.onSuccess, apiBaseResponses.onError);
      }
    },
    putInformation: function(userInformation) {
      return Restangular
              .one('user/edit', userInformation.userIdFk)
              .customPUT(userInformation)
              .then(apiBaseResponses.onSuccess, apiBaseResponses.onError);
    },
    postInformation: function(userInformation) {
      return Restangular
              .one('user/create')
              .customPOST(userInformation)
              .then(apiBaseResponses.onSuccess, apiBaseResponses.onError);
    },
    getList: function() {
      return Restangular
              .one('user/edit')
              .get()
              .then(apiBaseResponses.onSuccess, apiBaseResponses.onError);
    },
    getAllCustomer: function() {
        return Restangular
                .one('user/search')
                .get()
                .then(apiBaseResponses.onSuccess, apiBaseResponses.onError);
    },
    getSearchedListByName: function(name) {
      return Restangular
              .one('user/search', name)
              .get()
              .then(apiBaseResponses.onSuccess, apiBaseResponses.onError);
    }
  };

  return user;
}]);