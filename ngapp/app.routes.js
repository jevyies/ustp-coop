var isLogin = localStorage.getItem('credentials') ? true : false;
// localStorage.setItem('credentials', 'hi');
function isAuthenticated() {
	return [ '$state', '$q',
		function ($state, $q) {
			if (!isLogin) {
				$state.go('main');
			}
		}
	]
}

function isPublic(){
	return [ '$state', '$q',
		function ($state, $q) {
			if (isLogin) {
				$state.go('app.main');
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
			.state('main', {
				url: '/',
				templateUrl: APPURL + 'main.html?v=' + VERSION,
				resolve: {
					authenticate: isPublic(),
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
			.state('login', {
				url: '/login',
				templateUrl: LOGURL + 'view.html?v=' + VERSION,
				resolve: {
					authenticate: isPublic(),
					loadMyCtrl: [
						'$ocLazyLoad',
						function ($ocLazyLoad) {
							return $ocLazyLoad.load({
								files: [LOGURL + 'controller.js?v=' + VERSION],
							});
						},
					],
				},
			})
			.state('register', {
				url: '/register',
				templateUrl: REGURL + 'view.html?v=' + VERSION,
				resolve: {
					authenticate: isPublic(),
					loadMyCtrl: [
						'$ocLazyLoad',
						function ($ocLazyLoad) {
							return $ocLazyLoad.load({
								files: [REGURL + 'controller.js?v=' + VERSION],
							});
						},
					],
				},
			})

			// dashboard
			.state('app', {
				abstract: true,
				templateUrl: COMURL + 'full.html?v=' + VERSION,
			})
			.state('app.main', {
				url: '/dashboard',
				templateUrl: APPURL + 'dashboard/view.html?v=' + VERSION,
				resolve: {
					authenticate: isAuthenticated(),
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
