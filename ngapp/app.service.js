(function() {
	'use strict';
	angular
		.module('app')

		.factory('AppSvc', AppSvc);

	AppSvc.$inject = ['baseService', '$uibModal', '$ocLazyLoad'];

	function AppSvc(baseService, $uibModal, $ocLazyLoad) {
		var service = new baseService();
		service.url = APIURL + 'login/user';
		return service;
	}
})();
