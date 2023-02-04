angular.module('app').controller('RequestCtrl', RequestCtrl);

RequestCtrl.$inject = ['$scope', '$ocLazyLoad', '$injector', '$filter'];

function RequestCtrl($scope, $ocLazyLoad, $injector, filter) {
    var vm = this;
    vm.requestList = [];
    vm.filtered = [];
    vm.variables = {};
    vm.variables.dateFrom = new Date();
    vm.variables.dateTo = new Date();
    
    var cellTemplate1 = 
    `<div class="ui-grid-icons-and-icons">
        <a href="javascript:void(0)" class="text-success mr-2 font-size-16" title="Accept" ng-click="grid.appScope.vm.acceptUser(row.entity)">Accept</a>
        <a href="javascript:void(0)" class="text-danger font-size-16" title="Decline" ng-click="grid.appScope.vm.declineUser(row.entity)">Decline</a>
    </div>`;

    vm.requestGrid = {
		enableRowSelection: false,
		enableCellEdit: false,
		enableColumnMenus: false,
		modifierKeysToMultiSelect: true,
		enableRowHeaderSelection: false,
		columnDefs: [
			{ name: 'Account', displayName: 'Account No', field: 'account_no' },
			{ name: 'Name', field: 'name'},
			{ name: 'Transaction Type', field: 'transaction_type'},
			{ name: 'Amount', field: 'amount'},
			{ name: 'Attachment', field: 'attachment'},
            { name: 'Action', field: 'action', cellTemplate: cellTemplate1, width: 150 },
		],
		data: 'vm.filtered'
	};
}