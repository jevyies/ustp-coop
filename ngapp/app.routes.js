var isLogin = localStorage.getItem('credentials') ? true : false;
var credentials = localStorage.getItem('credentials') ? JSON.parse(localStorage.getItem('credentials')) : {};
// localStorage.setItem('credentials', 'hi');
function isAuthenticated(type) {
	return [ '$state', '$q',
		function ($state, $q) {
			if (!isLogin) {
				$state.go('main');
			}else{
				if(credentials.as === type){
					type === 'member' ? $state.go('member.main') : $state.go('app.main');
				} 
			}
		}
	]
}

function isPublic(){
	return [ '$state', '$q',
		function ($state, $q) {
			if (isLogin) {
				if(credentials.as === 'admin'){
					$state.go('app.main');
				}else{
					$state.go('member.main');
				}
				
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
		ROUTES.forEach(item => {
			for(var key in item){
				$stateProvider.state(key, item[key])
			}
		})
	},
]);
