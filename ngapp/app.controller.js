angular.module('app').controller('AppCtrl', AppCtrl);

AppCtrl.$inject = ['$scope', '$ocLazyLoad', '$injector', '$state'];

function AppCtrl($scope, $ocLazyLoad, $injector, $state) {
	var vm = this;
	vm.masterfile = false;
	vm.userName = '';
	$ocLazyLoad.load([APPURL + 'app.service.js?v=' + VERSION]).then(function(d) {
		AppSvc = $injector.get('AppSvc');
	});
	vm.openSideMenu = function() {
		var body = angular.element(document.querySelector('body'));
		if (body.hasClass('sidebar-mobile-show')) {
			body.removeClass('sidebar-mobile-show');
		} else {
			body.addClass('sidebar-mobile-show');
		}
	};
	vm.hideSideBar = function(){
		var body = angular.element(document.querySelector('body'));
		body.removeClass('sidebar-mobile-show');
	}
	vm.changePassword = function(){
		var options = {
			data: vm.userCredentials,
			templateUrl: COMURL + 'user_details/change_password.html?v=' + VERSION,
			controllerName: 'ChangePasswordCtrl',
			viewSize: 'sm',
			animation: true,
			filesToLoad: [
				COMURL + 'user_details/change_password.html?v=' + VERSION,
				COMURL + 'user_details/controller.js?v=' + VERSION,
			],
		};
		AppSvc.modal(options).then(function(data) {
			if (data) {
				vm.logout();
			}
		});
	}
	vm.logout = function() {
		localStorage.removeItem('credentials');
		$state.go('login');
	};
}
