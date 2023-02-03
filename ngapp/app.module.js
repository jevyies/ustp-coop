const APIURL = 'http://localhost:9000/';
const APPURL = 'ngapp/';
const VERSION = '1.0.0';
const COMURL = APPURL + 'common/';
const REGURL = APPURL + 'registration/';
const LOGURL = APPURL + 'login/';
const LOADING = document.getElementById('loading-screen');
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
		'toastr',
		'ui.grid',
        'ui.grid.cellNav',
        'ui.grid.selection',
        'ui.grid.resizeColumns',
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
			$rootScope.$on("$locationChangeStart", function(event, next, current) {
				let nextSplitUrl = next.split('/');
				var nextUrl = '/'+ nextSplitUrl[nextSplitUrl.length - 1];
				if(localStorage.getItem('credentials')){
					var body = angular.element(document.querySelector('body'));
					body.removeClass('sidebar-mobile-show');
				}
				ROUTES.forEach(item => {
					for(var key in item){
						if(nextUrl === item[key].url){
							if(item[key].requireLogin && !localStorage.getItem('credentials')) {
								event.preventDefault();
							}
							if(!item[key].requireLogin && localStorage.getItem('credentials')) {
								var credentials = JSON.parse(localStorage.getItem('credentials'));
								if(credentials.as === 'admin'){
									$state.go('app.main');
								}else if(credentials.as === 'member'){
									$state.go('member.main');
								}
								event.preventDefault();
							}
							if(item[key].requireLogin && localStorage.getItem('credentials')) {
								var credentials = JSON.parse(localStorage.getItem('credentials'));
								if(credentials.as !== item[key].loginAs){
									event.preventDefault();
								}
							}
						}
					}
				})
				
			})
			$rootScope.$state = $state;
			return ($rootScope.$stateParams = $stateParams);

		},
	])
