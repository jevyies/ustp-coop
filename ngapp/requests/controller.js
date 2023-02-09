angular.module('app').controller('RequestCtrl', RequestCtrl);

RequestCtrl.$inject = ['$scope', '$ocLazyLoad', '$injector', '$filter'];

function RequestCtrl($scope, $ocLazyLoad, $injector, filter) {
    var vm = this;
    vm.requestList = [];
    vm.filtered = [];
    vm.variables = {};
    vm.variables.dateFrom = new Date();
    vm.variables.dateTo = new Date();
	vm.options = 'all';
    $ocLazyLoad.load([APPURL + 'app.service.js?v=' + VERSION]).then(function(d) {
		TransactionSvc = $injector.get('TransactionSvc');
		DepositSvc = $injector.get('DepositSvc');
		WithdrawSvc = $injector.get('WithdrawSvc');
		vm.getTransactions({ from: TransactionSvc.getDate(vm.variables.dateFrom), to: TransactionSvc.getDate(vm.variables.dateTo) });
	});
	vm.getTransactions = function(params) {
		params.purpose = 'unite_transaction';
		vm.loading = true;
		vm.requestList = [];
		vm.filtered = [];
		TransactionSvc.get(params).then(function(d) {
			d.map(function(item) {
				item.amount = filter('currency')(item.total_amount, '₱ ');
				item.attachment = APIURL + item.image_path_passed;
				item.searchList = item.account__account_no + ' ' + item.account__name;
			});
			vm.requestList = d;
			vm.filtered = vm.requestList;
			vm.loading = false;
		});
	}
	vm.queryDate = function() {
		vm.search = '';
		vm.options = 'all';
		vm.getTransactions({ from: TransactionSvc.getDate(vm.variables.dateFrom), to: TransactionSvc.getDate(vm.variables.dateTo) });
	};
	vm.searching = function () {
        vm.filtered = filter('filter')(vm.requestList, { searchList: vm.search });
	};
	vm.searchOptions = function (option) {
		vm.search = '';
		if(option === 'all'){
			vm.filtered = vm.requestList;
		}else if(option === 'approved'){
			vm.filtered = filter('filter')(vm.requestList, { status: 'approved' });
		}else if(option === 'denied'){
			vm.filtered = filter('filter')(vm.requestList, { status: 'denied' });
		}else if(option === 'pending'){
			vm.filtered = filter('filter')(vm.requestList, { status: 'pending' });
		}
	};
    var cellTemplate1 = 
    `<div class="ui-grid-icons-and-icons">
		<div ng-if="row.entity.status === 'pending'">
			<a href="javascript:void(0)" class="text-success mr-2 font-size-16" title="Accept" ng-click="grid.appScope.vm.approveRequest(row.entity)">Approve</a>
			<a href="javascript:void(0)" class="text-danger font-size-16" title="Deny" ng-click="grid.appScope.vm.denyRequest(row.entity)">Deny</a>
		</div>
		<div class="font-size-16 text-success" ng-if="row.entity.status === 'approved'">
			Approved
		</div>
		<div class="font-size-16 text-danger" ng-if="row.entity.status === 'denied'">
			Denied
		</div>
	`;
	var cellTemplate2 = 
	`<div class="ui-grid-icons-and-icons">
		<a href="{{row.entity.attachment}}" target="_blank" class="text-center font-size-16" title="Attachment">View attachment</a>
	</div>`

    vm.requestGrid = {
		enableRowSelection: false,
		enableCellEdit: false,
		enableColumnMenus: false,
		modifierKeysToMultiSelect: true,
		enableRowHeaderSelection: false,
		columnDefs: [
			{ name: 'Account', displayName: 'Account No', field: 'account__account_no' },
			{ name: 'Name', field: 'account__name'},
			{ name: 'Transaction Type', field: 'transaction_type'},
			{ name: 'Amount', field: 'amount'},
			{ name: 'Attachment', field: 'attachment', cellTemplate: cellTemplate2, width: 150},
			{ name: 'gcash', field: 'gcash', displayName: 'GCash No.'},
			{ name: 'Date Requested', field: 'date_requested', cellFilter: "date: 'MMM dd, yyyy'", width: 170},
            { name: 'Action', field: 'action', cellTemplate: cellTemplate1, width: 180 },
		],
		data: 'vm.filtered'
	};
	vm.approveRequest = function(row) {
		AccountSvc.confirmation('Are You Sure?', `You want to approve this request?`, 'Yes', 'No', true).then(function (response) {
			if (response) {
				if(row.transaction_type === 'deposit'){
					let data = angular.copy(row);
					data.status = 'approved';
					data.purpose = 'change_status';
					DepositSvc.save(data).then(function(d) {
						if(d.data.success){
							row.status = 'approved';
							AccountSvc.showToaster('Success', 'Request has been approved.', 'success')
						}else{
							AccountSvc.showAlert('Error', 'Something went wrong', 'error')
						}
					});
				}else{
					let data = angular.copy(row);
					data.status = 'approved';
					data.purpose = 'change_status';
					WithdrawSvc.save(data).then(function(d) {
						if(d.data.success){
							row.status = 'approved';
							AccountSvc.showToaster('Success', 'Request has been approved.', 'success')
						}else{
							AccountSvc.showAlert('Error', 'Something went wrong', 'error')
						}
					});
				}
			}
		});
	}
	vm.denyRequest = function(row) {
		AccountSvc.confirmation('Are You Sure?', `You want to deny this request?`, 'Yes', 'No', true).then(function (response) {
			if (response) {
				if(row.transaction_type === 'deposit'){
					let data = angular.copy(row);
					data.status = 'denied';
					data.purpose = 'change_status';
					DepositSvc.save(data).then(function(d) {
						if(d.data.success){
							row.status = 'denied';
							AccountSvc.showToaster('Success', 'Request has been denied.', 'success')
						}else{
							AccountSvc.showAlert('Error', 'Something went wrong', 'error')
						}
					});
				}else{
					let data = angular.copy(row);
					data.status = 'denied';
					data.purpose = 'change_status';
					WithdrawSvc.save(data).then(function(d) {
						if(d.data.success){
							row.status = 'denied';
							AccountSvc.showToaster('Success', 'Request has been denied.', 'success')
						}else{
							AccountSvc.showAlert('Error', 'Something went wrong', 'error')
						}
					});
				}
			}
		});
	}
}