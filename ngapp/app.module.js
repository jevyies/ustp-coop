const APIURL = '';
const APPURL = 'ngapp/';
const VERSION = '1.0.0';
// Default colors

angular
	.module('app', [
		'ui.router',
		'oc.lazyLoad',
		'angular-loading-bar',
		'ngSanitize',
		'ngAnimate',
		'ui.bootstrap',
		'sharedMod',
		'ngMask',
	])
	.config([
		'cfpLoadingBarProvider',
		function (cfpLoadingBarProvider) {
			cfpLoadingBarProvider.includeSpinner = false;
			cfpLoadingBarProvider.latencyThreshold = 1;
		},
	])
	.run([
		'$rootScope',
		'$state',
		'$stateParams',
		function ($rootScope, $state, $stateParams) {
			$rootScope.$on('$stateChangeSuccess', function () {
				document.body.scrollTop = document.documentElement.scrollTop = 0;
			});
			$rootScope.$state = $state;
			return ($rootScope.$stateParams = $stateParams);

		},
	])
