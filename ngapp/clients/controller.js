angular.module('app')
    .controller('ClientCtrl', ClientCtrl)
    .controller('UpdateClientCtrl', UpdateClientCtrl)

ClientCtrl.$inject = ['$scope', '$ocLazyLoad', '$injector', '$filter'];
UpdateClientCtrl.$inject = ['$scope', '$ocLazyLoad', '$injector', 'data', '$uibModalInstance'];

function ClientCtrl($scope, $ocLazyLoad, $injector, filter) {
    var vm = this;
    $ocLazyLoad.load([APPURL + 'app.service.js?v=' + VERSION]).then(function (d) {
        AccountSvc = $injector.get('AccountSvc');
        AccountDetailSvc = $injector.get('AccountDetailSvc');
        vm.getAccounts({account_status: 'approved'});
    });
    vm.list = [];
    vm.filtered = [];
    vm.search = '';
    vm.variables = {};
    var cellTemplate1 =
		'<div class="text-center cursor-pointer ui-grid-icons-and-icons" ng-click="grid.appScope.vm.update(row.entity)"><span class="fa fa-edit text-success font-size-16"></span></div>';
	var cellTemplate2 =
		'<div class="text-center cursor-pointer ui-grid-icons-and-icons" ng-click="grid.appScope.vm.delete(row.entity)"><span class="fa fa-trash text-danger font-size-16"></span></div>';
	vm.defaultGrid = {
		enableRowSelection: false,
		enableCellEdit: false,
		enableColumnMenus: false,
		modifierKeysToMultiSelect: true,
		enableRowHeaderSelection: false,
		columnDefs: [
			{ name: 'Account', displayName: 'Account No', field: 'account_no' },
			{ name: 'Name', field: 'name'},
			{ name: 'Email', field: 'email'},
			{ name: 'Date Applied', field: 'date_registered', cellFilter: "date: 'MMM dd, yyyy'", width: 150 },
			{ name: 'Date Verified', field: 'date_approved', cellFilter: "date: 'MMM dd, yyyy'", width: 150 },
			{ name: '  ', cellTemplate: cellTemplate1, width: 20 },
			{ name: ' ', cellTemplate: cellTemplate2, width: 20 },
		],
		data: 'vm.filtered',
	};
    vm.getAccounts = function (data) {
        vm.list = [];
        vm.filtered = [];
        AccountDetailSvc.get(data).then(function(response) {
            if(!response){
                vm.list = [];
            }else{
                response.map(function (d) {
                    d.searchList = d.account_no + ' ' + d.name + ' ' + d.email;
                    d.image = APIURL + d.image_path;
                });
                vm.list = response;
            }
            vm.filtered = vm.list;
		});
    }
    vm.searching = function (type) {
        vm.filtered = filter('filter')(vm.list, { searchList: vm.search });
	};
    vm.update = function(data){
        vm.variables = angular.copy(data);
        let index = vm.list.indexOf(data);
        var options = {
            data: vm.variables,
            templateUrl: APPURL + "clients/update-detail.html?v=" + VERSION,
            controllerName: "UpdateClientCtrl",
            controllerAs: 'modal',
            viewSize: 'md',
            animation: true,
            filesToLoad: [
                APPURL + "clients/update-detail.html?v=" + VERSION,
                APPURL + "clients/controller.js?v=" + VERSION
            ]
        };
        AccountSvc.modal(options).then(function (response) {
            if (response) {
                vm.list.splice(index, 1, response);
                vm.filtered = vm.list;
            }
        })
    }
    vm.delete = function(data){
        let index = vm.list.indexOf(data);
        AccountSvc.delete(data.id).then(function (response) {
            console.log(response);
            if (response) {
                vm.list.splice(index, 1);
                vm.filtered = vm.list;
                AccountSvc.showToaster('Success!', response.data.message, 'success');
            } else {
                AccountSvc.showToaster('Failed!', 'Something went wrong', 'error');
            }
        })
    }
}
function UpdateClientCtrl($scope, $ocLazyLoad, $injector, data, $uibModalInstance) {
    var modal = this;
    modal.variables = data;
    modal.update = function(){
        let data = angular.copy(modal.variables);
        data.purpose = 'update_details';
        AccountSvc.save(data).then(function (response) {
            if (response.data) {
                data.searchList = data.account_no + ' ' + data.name + ' ' + data.email;
                $uibModalInstance.close(data);
                AccountSvc.showToaster('Success!', response.data.message, 'success');
            } else {
                AccountSvc.showToaster('Failed!', 'Something went wrong', 'error');
            }
        })
    }
    modal.close = function () {
        $uibModalInstance.dismiss('cancel');
    };
}