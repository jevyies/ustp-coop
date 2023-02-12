angular.module('app').controller('SettingsCtrl', SettingsCtrl);

SettingsCtrl.$inject = ['$scope', '$ocLazyLoad', '$injector', '$filter'];

function SettingsCtrl($scope, $ocLazyLoad, $injector, filter) {
    var vm = this;
    vm.initialBalance = 0;
    vm.initialId = 0;

    $ocLazyLoad.load([APPURL + 'app.service.js?v=' + VERSION]).then(function(d) {
		SettingSvc = $injector.get('SettingSvc');
        vm.getInititalSettings();
    });

    vm.getInititalSettings = function() {
        SettingSvc.get().then(function(d) {
            if(d.length == 0) {
                vm.initialBalance = 0;
                vm.initialId = 0;
            }else{
                vm.initialBalance = d[0].initial_balance;
                vm.initialId = d[0].id;
            }
        });
    }

    vm.save = function() {
        var data = {
            initial_balance: SettingSvc.getAmount(vm.initialBalance),
            id: vm.initialId
        }
        SettingSvc.save(data).then(function(d) {
            if(d.status == 200) {
                return SettingSvc.showToaster('Success', 'Settings saved successfully', 'success');
            }
            return SettingSvc.showToaster('Error', 'Something went wrong', 'error');
        });
    }
}