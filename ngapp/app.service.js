(function() {
	'use strict';
	angular
		.module('app')

		.factory('AccountSvc', AccountSvc)
		.factory('AccountDetailSvc', AccountDetailSvc)
		.factory('DepositSvc', DepositSvc)
		.factory('WithdrawSvc', WithdrawSvc)
		.factory('TransactionSvc', TransactionSvc)
		.factory('UploadSvc', UploadSvc)
		.factory('SettingSvc', SettingSvc)

	AccountSvc.$inject = ['baseService', '$uibModal', '$ocLazyLoad'];
	AccountDetailSvc.$inject = ['baseService', '$uibModal', '$ocLazyLoad'];
	DepositSvc.$inject = ['baseService', '$uibModal', '$ocLazyLoad'];
	WithdrawSvc.$inject = ['baseService', '$uibModal', '$ocLazyLoad'];
	TransactionSvc.$inject = ['baseService', '$uibModal', '$ocLazyLoad'];
	UploadSvc.$inject = ['baseService', '$uibModal', '$ocLazyLoad'];
	SettingSvc.$inject = ['baseService', '$uibModal', '$ocLazyLoad'];

	function AccountSvc(baseService, $uibModal, $ocLazyLoad) {
		var service = new baseService();
		service.url = APIURL + 'api/';
		return service;
	}
	function AccountDetailSvc(baseService, $uibModal, $ocLazyLoad) {
		var service = new baseService();
		service.url = APIURL + 'api-search/';
		return service;
	}
	function DepositSvc(baseService, $uibModal, $ocLazyLoad) {
		var service = new baseService();
		service.url = APIURL + 'deposit/';
		return service;
	}
	function WithdrawSvc(baseService, $uibModal, $ocLazyLoad) {
		var service = new baseService();
		service.url = APIURL + 'withdrawal/';
		return service;
	}
	function TransactionSvc(baseService, $uibModal, $ocLazyLoad) {
		var service = new baseService();
		service.url = APIURL + 'transaction/';
		return service;
	}
	function UploadSvc(baseService, $uibModal, $ocLazyLoad) {
		var service = new baseService();
		service.url = APIURL + 'upload/';
		return service;
	}
	function SettingSvc(baseService, $uibModal, $ocLazyLoad) {
		var service = new baseService();
		service.url = APIURL + 'setting/';
		return service;
	}
})();
