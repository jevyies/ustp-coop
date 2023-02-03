angular.module('app').controller('ClientCtrl', ClientCtrl);

ClientCtrl.$inject = ['$scope', '$ocLazyLoad', '$injector'];

function ClientCtrl($scope, $ocLazyLoad, $injector) {
    var vm = this;
    $ocLazyLoad.load([APPURL + 'app.service.js?v=' + VERSION]).then(function (d) {
        AccountSvc = $injector.get('AccountSvc');
        AccountDetailSvc = $injector.get('AccountDetailSvc');
        vm.getAccounts({account_no: ''});
    });
    vm.list = [];
    var cellTemplate1 =
		'<div class="text-center cursor-pointer ui-grid-icons-and-icons" ng-click="grid.appScope.vm.addPayment(row.entity)"><span class="fa fa-edit text-success font-size-16"></span></div>';
	var cellTemplate2 =
		'<div class="text-center cursor-pointer ui-grid-icons-and-icons" ng-click="grid.appScope.vm.deleteDetails(row.entity)"><span class="fa fa-trash text-danger font-size-16"></span></div>';
    var cellTemplate3 =
		`<div class="ui-grid-icons-and-icons" ng-if="row.entity.account_no === ''">
            <a href="javascript:void(0)" class="text-success mr-2 font-size-16" title="Accept" ng-click="grid.appScope.vm.acceptUser(row.entity)">Accept</a>
            <a href="javascript:void(0)" class="text-danger font-size-16" title="Accept" ng-click="grid.appScope.vm.addPayment(row.entity)">Decline</a>
        </div>`;
	vm.defaultGrid = {
		enableRowSelection: false,
		enableCellEdit: false,
		enableColumnMenus: false,
		modifierKeysToMultiSelect: true,
		enableRowHeaderSelection: false,
		columnDefs: [
			{ name: '  ', cellTemplate: cellTemplate1, width: 20 },
			{ name: ' ', cellTemplate: cellTemplate2, width: 20 },
			{ name: 'Account', displayName: 'Account No', field: 'account_no' },
			{ name: 'Name', field: 'name'},
			{ name: 'Email', field: 'email'},
			{ name: 'User Type', displayName: 'User Type', field: 'account_type'},
			{ name: 'Date Applied', field: 'date_registered', cellFilter: "date: 'MMM dd, yyyy'" },
			{ name: 'Action', cellTemplate: cellTemplate3},
		],
		data: 'vm.list',
	};
    vm.getAccounts = function (data) {
        AccountSvc.get(data).then(function(response) {
			vm.list = response;
		});
    }
}