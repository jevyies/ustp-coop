
angular.module('app').controller('MemberDashboardCtrl', MemberDashboardCtrl)

MemberDashboardCtrl.$inject = ['$scope', '$ocLazyLoad', '$injector', '$q', '$filter'];

function MemberDashboardCtrl($scope, $ocLazyLoad, $injector, $q, filter) {
    var vm = this;
    vm.variables = {};
    vm.variables.from = new Date();
    vm.variables.to = new Date();
    vm.listTransaction = [];
    vm.filteredTransaction = [];
    vm.accountBalance = 0;
    $ocLazyLoad.load([APPURL + 'app.service.js?v=' + VERSION]).then(function (d) {
        TransactionSvc = $injector.get('TransactionSvc');
        AccountSvc = $injector.get('AccountSvc');
        vm.getTransactions();
        vm.getAccountBalance();
    });
    vm.transactionGrid = {
        enableRowSelection: false,
		enableCellEdit: false,
		enableColumnMenus: false,
		modifierKeysToMultiSelect: true,
		enableRowHeaderSelection: false,
		columnDefs: [
			{ name: 'Transaction Type', displayName: 'Transaction Type', field: 'type' },
			{ name: 'Amount', field: 'amount'},
			{ name: 'Date Requested', field: 'date_requested', cellFilter: "date: 'MMMM dd, yyyy'"},
			{ name: 'Date Approved', field: 'date_approved', cellFilter: "date: 'MMMM dd, yyyy'"},
			{ name: 'Status', field: 'statusUC', cellClass: 'text-center'},
		],
		data: 'vm.filteredTransaction',
        
    }
    vm.getAccountBalance = function(){
        var account = JSON.parse(localStorage.getItem('credentials'));
        vm.accountBalance = 0;
        LOADING.classList.add('open');
		AccountSvc.get({purpose: 'get_balance', id: account.id}).then(function(response){
			if(response){
				vm.accountBalance = response.balance;
                vm.balance = filter('currency')(vm.accountBalance, '₱ ');
			}
            LOADING.classList.remove('open');
		});
	}
    vm.getTransactions = function () {
        vm.listTransaction = [];
        vm.filteredTransaction = [];
        let account = JSON.parse(localStorage.getItem('credentials'));
        let data = angular.copy(vm.variables);
        data.from = TransactionSvc.getDate(vm.variables.from);
        data.to = TransactionSvc.getDate(vm.variables.to);
        data.purpose = 'get_my_transaction';
        data.id = account.id;
        vm.loading = true;
        TransactionSvc.get(data).then(function(response) {
            if(!response){
                vm.listTransaction = [];
            }else{
                response.map(function (d) {
                    d.amount = filter('currency')(d.total_amount, '₱ ');
                    d.type = d.transaction_type.charAt(0).toUpperCase() + d.transaction_type.slice(1);
                    d.statusUC = d.status.charAt(0).toUpperCase() + d.status.slice(1);
                });
                vm.listTransaction = response;
            }
            vm.filteredTransaction = vm.listTransaction;
            vm.loading = false;
        });
    }
}
