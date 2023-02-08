angular.module('app').controller('DepositCtrl', DepositCtrl)

DepositCtrl.$inject = ['$scope', '$ocLazyLoad', '$injector', '$q', '$filter'];

function DepositCtrl($scope, $ocLazyLoad, $injector, $q, filter) {
    var vm = this;
    vm.attachment = '';
    vm.imageUrl = '';
    vm.successfulDeposit = false;
    vm.accountBalance = 0;
    vm.profile = JSON.parse(localStorage.getItem('credentials'));
    $ocLazyLoad.load([APPURL + 'app.service.js?v=' + VERSION]).then(function (d) {
        DepositSvc = $injector.get('DepositSvc');
        AccountSvc = $injector.get('AccountSvc');
        vm.dateNow = filter('date')(new Date(), 'mediumDate');
        vm.getAccountBalance();
    });
    
	vm.getAccountBalance = function(){
        var account = JSON.parse(localStorage.getItem('credentials'));
        vm.accountBalance = 0;
		AccountSvc.get({purpose: 'get_balance', id: account.id}).then(function(response){
			if(response){
				vm.accountBalance = response.balance;
                vm.balance = filter('currency')(vm.accountBalance, '₱ ');
			}
		});
	}
    vm.submit = function(){
        let account = JSON.parse(localStorage.getItem('credentials'));
        let data = angular.copy(vm.variables);
        data.total_amount = DepositSvc.getAmount(vm.variables.totalAmt);
        data.image = vm.imageUrl.replace(/^data:image\/[a-z]+;base64,/, "");
        data.account = account.id;
        data.purpose = 'request_deposit';
        DepositSvc.save(data).then(function (res) {
            if(res.data.id){
                return vm.successfulDeposit = true;
            }
            return WithdrawSvc.showAlert('Error', 'Something went wrong', 'error')
        });
    }
    vm.closeAll = function(){
        vm.successfulDeposit = false;
        vm.variables = {};
        vm.imageUrl = '';
        vm.attachment = '';
        document.getElementById('previewImg').src = '';
    }
    vm.checkAttachment = function () {
        var reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('previewImg').src = e.target.result;
            vm.imageUrl = e.target.result;
        }
        reader.readAsDataURL(vm.attachment);
    }
}