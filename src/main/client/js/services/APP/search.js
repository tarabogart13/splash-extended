'use strict';

angular.module('logicline.services').factory('SearchService', [
    'apiUserService',

function(apiUserService) {
    var searchResult = {},
        resultsList = [];
    
    function getAllCustomer() {
        return apiUserService.getAllCustomer().then(function(response) {
            if (response.isError) {
                return response;
            }
            setResultsList(response);
            return resultsList;
        });
        /*return apiContractService.getList().then(function(response) {
            //resultsList = response;
            return resultsList;
        });*/
    };

     function searchData(name) {
        return apiUserService.getSearchedListByName(name).then(function(response) {
            if (response.isError) {
                return response;
            }
            setResultsList(response);
            return resultsList;
        });
        /*return apiContractService.getList().then(function(response) {
            //resultsList = response;
            return resultsList;
        });*/
    };

    function chooseResult(resultId) {
        /*return apiUserService.getList().then(function(response) {
            searchResult = {
                contractInfo: {
                    contractId: resultId
                },
                customerInfo: {
                    customerId: response.customerId
                }
            };
            return searchResult;
        });*/

        // created mock respone as we are using only Customer object 
        for (var i = 0; i < resultsList.length; i++) {
        	console.log(resultsList[i]);
             if (resultsList[i].userIdFk === resultId) {
                searchResult = {
                    customerInfo: resultsList[i]
                }
                return searchResult;
            }
        }
    };

    function setResultsList(dataObject) {
        resultsList = [];
        for (var key in dataObject) {
            if (!dataObject.hasOwnProperty(key)) {
                continue;
            }

            resultsList.push({
                userIdFk   : key,
                lastName : dataObject[key]
            });
        }
    };

    function getResultsList() {
        return resultsList;
    };

    function getResult() {
        return searchResult;
    };

    function reset() {
        searchResult = {};
        resultsList = [];
    };

    return {
        searchData     : searchData,
        getAllCustomer : getAllCustomer,
        chooseResult   : chooseResult,
        getResultsList : getResultsList,
        getResult      : getResult,
        dataReset      : reset
    }
}]);