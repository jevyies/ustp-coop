(function() {
	'use strict';
	angular
		.module('app')

		.factory('AccountSvc', AccountSvc)
		.factory('AccountDetailSvc', AccountDetailSvc)
		.factory('DepositSvc', DepositSvc)
		.factory('WithdrawSvc', WithdrawSvc)
		.factory('TransactionSvc', TransactionSvc)

	AccountSvc.$inject = ['baseService', '$uibModal', '$ocLazyLoad'];
	AccountDetailSvc.$inject = ['baseService', '$uibModal', '$ocLazyLoad'];
	DepositSvc.$inject = ['baseService', '$uibModal', '$ocLazyLoad'];
	WithdrawSvc.$inject = ['baseService', '$uibModal', '$ocLazyLoad'];
	TransactionSvc.$inject = ['baseService', '$uibModal', '$ocLazyLoad'];

	function AccountSvc(baseService, $uibModal, $ocLazyLoad) {
		var service = new baseService();
		service.url = APIURL + 'api/';
		return service;
	}
	function AccountDetailSvc(baseService, $uibModal, $ocLazyLoad) {
		var service = new baseService();
		service.url = APIURL + 'api-detail/';
		return service;
	}
	function DepositSvc(baseService, $uibModal, $ocLazyLoad) {
		var service = new baseService();
		service.url = APIURL + 'deposit/';
		return service;
	}
	function WithdrawSvc(baseService, $uibModal, $ocLazyLoad) {
		var service = new baseService();
		service.url = APIURL + 'widthdraw/';
		return service;
	}
	function TransactionSvc(baseService, $uibModal, $ocLazyLoad) {
		var service = new baseService();
		service.url = APIURL + 'transaction/';
		return service;
	}
})();
