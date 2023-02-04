angular.module('app').controller('TransactionCtrl', TransactionCtrl);

TransactionCtrl.$inject = ['$scope', '$ocLazyLoad', '$injector', '$filter'];

function TransactionCtrl($scope, $ocLazyLoad, $injector, filter) {
    var vm = this;
    $ocLazyLoad.load([APPURL + 'app.service.js?v=' + VERSION]).then(function (d) {
        AccountDetailSvc = $injector.get('AccountDetailSvc');
        TransactionSvc = $injector.get('TransactionSvc');
        vm.getAccounts({account_status: 'approved'});
    });
    vm.list = [];
    vm.filtered = [];
    vm.listTransaction = [];
    vm.filteredTransaction = [];
    vm.search = '';
    vm.optionList = 'pending';
    vm.variables = {};
    var lastYear = new Date().getFullYear() - 1;
    var month = new Date().getMonth() + 1;
    var day = new Date().getDate();
    vm.variables.dateFrom = new Date('' + lastYear + '-' + month + '-' + day + '');
    vm.variables.dateTo = new Date();
	vm.userGrid = {
		enableRowSelection: true,
		enableCellEdit: false,
		enableColumnMenus: false,
		modifierKeysToMultiSelect: true,
		enableRowHeaderSelection: false,
		columnDefs: [
			{ name: 'Account', displayName: 'Account No', field: 'account_no' },
			{ name: 'Name', field: 'name'},
			{ name: 'Email', field: 'email'},
		],
		data: 'vm.filtered',
        onRegisterApi: function (gridApi) {
            gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                vm.variables.id = row.entity.id;
                vm.getTransaction();
            });
        }
	};
    vm.transactionGrid = {
        enableRowSelection: false,
		enableCellEdit: false,
		enableColumnMenus: false,
		modifierKeysToMultiSelect: true,
		enableRowHeaderSelection: false,
		columnDefs: [
			{ name: 'Transaction Type', displayName: 'Transaction Type', field: 'transaction_type' },
			{ name: 'Amount', field: 'amount'},
			{ name: 'Date Approved', field: 'date_approved'},
		],
		data: 'vm.filteredTransaction',
        
    }
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
    vm.getTransaction = function () {
        vm.listTransaction = [];
        vm.filteredTransaction = [];
        let data = angular.copy(vm.variables);
        data.dateFrom = TransactionSvc.getDate(vm.variables.dateFrom);
        data.dateTo = TransactionSvc.getDate(vm.variables.dateTo);
        console.log(data);
        // TransactionSvc.get({}).then(function(response) {
        //     if(!response){
        //         vm.listTransaction = [];
        //     }else{
        //         vm.listTransaction = response;
        //     }
        //     vm.filteredTransaction = vm.listTransaction;
        // });
    }
    vm.searching = function (type) {
        vm.filtered = filter('filter')(vm.list, { searchList: vm.search });
	};
    vm.getList = function () {
        vm.getAccounts({account_status: vm.optionList});
    }
    vm.update = function(data){
        vm.variables = angular.copy(data);
    }
    vm.delete = function(data){
        AccountSvc.delete(data.id).then(function (response) {
            console.log(response);
            if (response) {
                AccountSvc.showAlert('Success!', response.message, 'success');
            } else {
                AccountSvc.showAlert('Failed!', 'Something went wrong', 'error');
            }
        })
    }
}