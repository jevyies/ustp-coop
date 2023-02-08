angular.module('app').controller('AppCtrl', AppCtrl);

AppCtrl.$inject = ['$scope', '$ocLazyLoad', '$injector', '$state'];

function AppCtrl($scope, $ocLazyLoad, $injector, $state) {
	var vm = this;
	vm.masterfile = false;
	vm.userName = '';
	vm.profile = JSON.parse(localStorage.getItem('credentials'));
	vm.profile.image = vm.profile.image_path ? APIURL + vm.profile.image_path : 'assets/images/user.png';
	$ocLazyLoad.load([APPURL + 'app.service.js?v=' + VERSION]).then(function(d) {
		AccountSvc = $injector.get('AccountSvc');
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
			data: vm.profile,
			templateUrl: COMURL + 'user_details/change_password.html?v=' + VERSION,
			controllerName: 'ChangePasswordCtrl',
			viewSize: 'sm',
			animation: true,
			filesToLoad: [
				COMURL + 'user_details/change_password.html?v=' + VERSION,
				COMURL + 'user_details/controller.js?v=' + VERSION,
			],
		};
		AccountSvc.modal(options).then(function(data) {
			if (data) {
				vm.logout();
			}
		});
	}
	vm.userPane = function() {
		var options = {
			data: vm.profile,
			templateUrl: COMURL + 'user_details/view.html?v=' + VERSION,
			controllerName: 'UserDetailsCtrl',
			viewSize: 'md',
			animation: true,
			filesToLoad: [
				COMURL + 'user_details/view.html?v=' + VERSION,
				COMURL + 'user_details/controller.js?v=' + VERSION,
			],
		};
		AccountSvc.modal(options).then(function(data) {
			if (data) {
				vm.logout();
			}
		});
	};
	vm.logout = function() {
		localStorage.clear();
		$state.go('login');
	};
}
