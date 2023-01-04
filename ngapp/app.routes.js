var isLogin = localStorage.getItem('credentials') ? true : false;
function isAuthenticated() {
	return [ '$state', '$q',
		function ($state, $q) {
			if (!isLogin) {
				$state.go('login');
			}
		}
	]
}
angular.module('app').config([
	'$stateProvider',
	'$urlRouterProvider',
	'$ocLazyLoadProvider',
	function ($stateProvider, $urlRouterProvider, $ocLazyLoadProvider) {
		$urlRouterProvider.otherwise(!isLogin ? '/' : '/dashboard');
		$ocLazyLoadProvider.config({
			debug: false,
		});
		$stateProvider
			.state('login', {
				url: '/',
				templateUrl: APPURL + 'login.html?v=' + VERSION,
				resolve: {
					loadMyCtrl: [
						'$ocLazyLoad',
						function ($ocLazyLoad) {
							return $ocLazyLoad.load({
								files: [APPURL + 'app.controller.js?v=' + VERSION],
							});
						},
					],
				},
			})
			.state('main', {
				url: '/main',
				templateUrl: APPURL + 'main.html?v=' + VERSION,
				resolve: {
					authenticate: isAuthenticated(),
					loadMyCtrl: [
						'$ocLazyLoad',
						function ($ocLazyLoad) {
							return $ocLazyLoad.load({
								files: [APPURL + 'app.controller.js?v=' + VERSION],
							});
						},
					],
				},
			})
			.state('app', {
				abstract: true,
				templateUrl: COMURL + 'full.html?v=' + VERSION,
			})
			.state('app.main', {
				url: '/dashboard',
				templateUrl: APPURL + 'dashboard/view.html?v=' + VERSION,
				resolve: {
					loadMyCtrl: [
						'$ocLazyLoad',
						function ($ocLazyLoad) {
							return $ocLazyLoad.load({
								files: [APPURL + 'dashboard/controller.js?v=' + VERSION],
							});
						},
					],
				},
			})
	},
]);
