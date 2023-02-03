angular.module('app').controller('TransactionCtrl', TransactionCtrl);

TransactionCtrl.$inject = ['$scope', '$ocLazyLoad', '$injector', '$filter'];

function TransactionCtrl($scope, $ocLazyLoad, $injector, filter) {
    var vm = this;
    $ocLazyLoad.load([APPURL + 'app.service.js?v=' + VERSION]).then(function (d) {
        AccountSvc = $injector.get('AccountSvc');
        AccountDetailSvc = $injector.get('AccountDetailSvc');
        vm.getAccounts({account_status: 'pending'});
    });
    vm.list = [];
    vm.filtered = [];
    vm.search = '';
    vm.optionList = 'pending';
    vm.variables = {};
    var cellTemplate1 =
		'<div class="text-center cursor-pointer ui-grid-icons-and-icons" ng-click="grid.appScope.vm.update(row.entity)"><span class="fa fa-edit text-success font-size-16"></span></div>';
	var cellTemplate2 =
		'<div class="text-center cursor-pointer ui-grid-icons-and-icons" ng-click="grid.appScope.vm.delete(row.entity)"><span class="fa fa-trash text-danger font-size-16"></span></div>';
    var cellTemplate3 =
		`<div class="ui-grid-icons-and-icons" ng-if="row.entity.account_no === ''">
            <a href="javascript:void(0)" class="text-success mr-2 font-size-16" title="Accept" ng-click="grid.appScope.vm.acceptUser(row.entity)">Accept</a>
            <a href="javascript:void(0)" class="text-danger font-size-16" title="Accept" ng-click="grid.appScope.vm.addPayment(row.entity)">Decline</a>
        </div>`;
    var cellTemplate4 = `<div class="ui-grid-icons-and-icons"><img src="{{row.entity.image}}" class="img-fluid cursor-pointer" style="width: 20px; height: 20px;"></div>`
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
			{ name: 'Date Applied', field: 'date_registered', cellFilter: "date: 'MMM dd, yyyy'", width: 150 },
			{ name: 'Image',  cellTemplate: cellTemplate4, width: 100},
			{ name: 'Action', cellTemplate: cellTemplate3, width: 200},
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