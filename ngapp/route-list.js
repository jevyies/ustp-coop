const ROUTES = [
	{
		'main': {
			url: '/',
			templateUrl: APPURL + 'main.html?v=' + VERSION,
			requireLogin: false,
			loginAs: 'public',
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
		}
	},
	{
		'login': {
			url: '/login',
			templateUrl: LOGURL + 'view.html?v=' + VERSION,
			requireLogin: false,
			loginAs: 'public',
			resolve: {
				loadMyCtrl: [
					'$ocLazyLoad',
					function ($ocLazyLoad) {
						return $ocLazyLoad.load({
							files: [LOGURL + 'controller.js?v=' + VERSION],
						});
					},
				],
			},
		}
	},
	{
		'register': {
			url: '/register',
			templateUrl: REGURL + 'view.html?v=' + VERSION,
			requireLogin: false,
			loginAs: 'public',
			resolve: {
				loadMyCtrl: [
					'$ocLazyLoad',
					function ($ocLazyLoad) {
						return $ocLazyLoad.load({
							files: [REGURL + 'controller.js?v=' + VERSION],
						});
					},
				],
			},
		}
	},
	{
		'app': {
			abstract: true,
			templateUrl: COMURL + 'full-admin.html?v=' + VERSION,
			requireLogin: true,
			loginAs: 'admin',
		}
	},
	{
		'app.main': {
			url: '/dashboard',
			templateUrl: APPURL + 'dashboard/view.html?v=' + VERSION,
			requireLogin: true,
			loginAs: 'admin',
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
		}
	},
	{
		'app.clients': {
			url: '/clients',
			templateUrl: APPURL + 'clients/view.html?v=' + VERSION,
			requireLogin: true,
			loginAs: 'admin',
			resolve: {
				loadMyCtrl: [
					'$ocLazyLoad',
					function ($ocLazyLoad) {
						return $ocLazyLoad.load({
							files: [APPURL + 'clients/controller.js?v=' + VERSION],
						});
					},
				],
			},
		}
	},
	{
		'app.applications': {
			url: '/applications',
			templateUrl: APPURL + 'applications/view.html?v=' + VERSION,
			requireLogin: true,
			loginAs: 'admin',
			resolve: {
				loadMyCtrl: [
					'$ocLazyLoad',
					function ($ocLazyLoad) {
						return $ocLazyLoad.load({
							files: [APPURL + 'applications/controller.js?v=' + VERSION],
						});
					},
				],
			},
		}
	},
	{
		'app.transactions': {
			url: '/transactions',
			templateUrl: APPURL + 'transactions/view.html?v=' + VERSION,
			requireLogin: true,
			loginAs: 'admin',
			resolve: {
				loadMyCtrl: [
					'$ocLazyLoad',
					function ($ocLazyLoad) {
						return $ocLazyLoad.load({
							files: [APPURL + 'transactions/controller.js?v=' + VERSION],
						});
					},
				],
			},
		}
	},
	{
		'member': {
			abstract: true,
			templateUrl: COMURL + 'full-member.html?v=' + VERSION,
			requireLogin: true,
			loginAs: 'member',
		}
	},
	{
		'member.main': {
			url: '/member-dashboard',
			templateUrl: APPURL + 'members/dashboard/view.html?v=' + VERSION,
			requireLogin: true,
			loginAs: 'member',
			resolve: {
				loadMyCtrl: [
					'$ocLazyLoad',
					function ($ocLazyLoad) {
						return $ocLazyLoad.load({
							files: [APPURL + 'members/dashboard/controller.js?v=' + VERSION],
						});
					},
				],
			},
		}
	},
	{
		'member.loan-application': {
			url: '/loan-application',
			templateUrl: APPURL + 'members/loan/view.html?v=' + VERSION,
			requireLogin: true,
			loginAs: 'member',
			resolve: {
				loadMyCtrl: [
					'$ocLazyLoad',
					function ($ocLazyLoad) {
						return $ocLazyLoad.load({
							files: [APPURL + 'members/loan/controller.js?v=' + VERSION],
						});
					},
				],
			},
		}
	},
	{
		'member.deposit': {
			url: '/member-deposit',
			templateUrl: APPURL + 'members/deposit/view.html?v=' + VERSION,
			requireLogin: true,
			loginAs: 'member',
			resolve: {
				loadMyCtrl: [
					'$ocLazyLoad',
					function ($ocLazyLoad) {
						return $ocLazyLoad.load({
							files: [APPURL + 'members/deposit/controller.js?v=' + VERSION],
						});
					},
				],
			},
		}
	},
	{
		'member.withdrawal': {
			url: '/member-withdrawal',
			templateUrl: APPURL + 'members/withdrawal/view.html?v=' + VERSION,
			requireLogin: true,
			loginAs: 'member',
			resolve: {
				loadMyCtrl: [
					'$ocLazyLoad',
					function ($ocLazyLoad) {
						return $ocLazyLoad.load({
							files: [APPURL + 'members/withdrawal/controller.js?v=' + VERSION],
						});
					},
				],
			},
		}
	},
];