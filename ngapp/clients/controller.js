angular.module('app').controller('ClientCtrl', ClientCtrl);

ClientCtrl.$inject = ['$scope', '$ocLazyLoad', '$injector'];

function ClientCtrl($scope, $ocLazyLoad, $injector) {
    var vm = this;
    $ocLazyLoad.load([APPURL + 'app.service.js?v=' + VERSION]).then(function (d) {
        AccountSvc = $injector.get('AccountSvc');
        vm.getAccounts();
    });
    vm.getAccounts = function () {
        AccountSvc.get().then(function(response) {
			console.log(response);
		});
    }
}