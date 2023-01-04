angular.module('app').controller('AppCtrl', AppCtrl);

AppCtrl.$inject = ['$scope', '$ocLazyLoad', '$injector', '$state'];

function AppCtrl($scope, $ocLazyLoad, $injector, $state) {
	var vm = this;
	vm.masterfile = false;
	vm.userName = '';
	vm.showSide = true;
	$ocLazyLoad.load([APPURL + 'app.service.js?v=' + VERSION]).then(function(d) {
		AppSvc = $injector.get('AppSvc');
		vm.getUserCredentials();
	});
	vm.getUserCredentials = function() {
		AppSvc.get().then(function(response) {
			if (response.record) {
				vm.userName = response.record.user;
				vm.level = response.record.level;
				vm.userCredentials = response.record;
			} else {
				console.log('error');
			}
		});
	};
	vm.openSideMenu = function() {
		var body = angular.element(document.querySelector('body'));
		if (vm.showSide) {
			body.addClass('sidebar-mobile-show sidebar-hidden');
			vm.showSide = false;
		} else {
			body.removeClass('sidebar-mobile-show sidebar-hidden');
			vm.showSide = true;
		}
	};
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
	vm.userPane = function(){
		var options = {
			data: vm.userCredentials,
			templateUrl: COMURL + 'user_details/view.html?v=' + VERSION,
			controllerName: 'UserDetailsCtrl',
			viewSize: 'sm',
			animation: true,
			filesToLoad: [
				COMURL + 'user_details/view.html?v=' + VERSION,
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
		window.location.href = PROJURL + '/login/logout';
	};
}
