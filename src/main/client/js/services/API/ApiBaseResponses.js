'use strict';

/**
 * Services: Api base responses
 */
angular.module('logicline.services').factory('apiBaseResponses', [
function() {
  function LogiclineAPIError(error) {
    this.error = {};
    this.status = {};
    this.statusText = {};
    this.isError = true;

    if (error) {
      this.error = error;
      this.status = error.status;
      this.statusText = error.statusText;
    } else {
      this.status = 500;
      this.statusText = "Unexpected error";
    }
  };

  var apiBaseResponses = {
    onSuccess: function(response) {
      var res = {};
      if (!angular.isUndefined(response)) {
        res = response.plain()
      }
      return res;
    },
    onError: function(error) {
      return new LogiclineAPIError(error);
    }
  };
  return apiBaseResponses;
}]);