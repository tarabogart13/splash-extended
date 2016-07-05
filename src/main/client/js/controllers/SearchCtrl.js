'use strict';

angular
.module('logicline.controllers')
.controller('SearchCtrl', [
'$rootScope',
'$scope',
'$filter',
'SearchService',

function($rootScope, $scope, $filter, SearchService) {
	$scope.lastName = null;
	$scope.searchResult = null;
	$scope.resultsList = null;
	$scope.filteredCustomers = [];
	$scope.isResultList = false;
	$scope.isResultChosen = false;
	$scope.filteredCount = 0;
	
	(function init() {
        // load data, init scope, etc.
		SearchService.getAllCustomer().then(function(response) {
			if (response.isError) {
				return;
			}
			$scope.resultsList = [];
			if (!!response.length) {
				$scope.isResultList = true;
				$scope.resultsList = response;
				$scope.filteredCustomers = response;
			}
		});
    })();
	
	if ($scope.$state.current.name !== 'customer_search') {
		$scope.resultsList = SearchService.getResultsList();
		$scope.searchResult = SearchService.getResult();
		if ($scope.resultsList.length > 0) {
			$scope.isResultList = false;
			$scope.isResultChosen = true;
		}
	} else {
		SearchService.dataReset();
		delete $rootScope.searchUserIdFk;
		delete $rootScope.isSearchActive;
	}
	
	$scope.filterCustomers = function () {
        $scope.filteredCustomers = $filter("customerFilter")($scope.resultsList, $scope.lastName);
		$scope.filteredCount = $scope.filteredCustomers.length;
    };
	
	$scope.searchData = function() {
		
		if((!angular.isString($scope.lastName) || $scope.lastName === '')) {
			SearchService.getAllCustomer().then(function(response) {
				if (response.isError) {
					return;
				}
				$scope.resultsList = [];
				if (!!response.length) {
					$scope.isResultList = true;
					$scope.resultsList = response;
					$scope.filteredCustomers = response;
				}
			});
		}
		
		SearchService.searchData($scope.lastName).then(function(response) {
			if (response.isError) {
				return;
			}
			$scope.resultsList = [];
			console.log("Search by name "+ $scope.lastName+": " + response);
			if (!!response.length) {
				$scope.isResultList = true;
				$scope.resultsList = response;
				$scope.filteredCustomers = response;				
			}
		});
	};

	$scope.chooseResult = function(resultId) {
		$rootScope.searchUserIdFk = resultId;
		$rootScope.isSearchActive = true;

		$scope.isResultList = false;
		$scope.isResultChosen = true;
		$scope.searchResult = SearchService.chooseResult(resultId);
		$scope.$state.go('customer_edit', {'userId': resultId});
	};

	$scope.cancelSearch = function() {
		delete $rootScope.searchUserIdFk;
		delete $rootScope.isSearchActive;		

		$scope.$state.go('dashboard');
	}

	$scope.backToResults = function() {
		$scope.searchResult = null;
		$scope.isResultList = true;
		$scope.isResultChosen = false;

		delete $rootScope.searchUserIdFk;
		delete $rootScope.isSearchActive;
	};

	//TODO: for the current implementation search by Customer ID field only
	/*$scope.searchData = function() {
		if((!angular.isString($scope.customerId) || $scope.customerId === '') && 
			(!angular.isString($scope.contractId) || $scope.contractId === '')) {
			return;
		}
		SearchService.searchContracts($scope.customerId, $scope.contractId).then(function(response) {
			$scope.isResultList = true;
			$scope.resultsList = response;
		});
	};
	$scope.chooseResult = function(resultId) {
		SearchService.chooseResult(resultId).then(function(response) {
			$scope.isResultList = false;
			$scope.isResultChosen = true;
			$scope.searchResult = response;
		});
	};*/
}]);