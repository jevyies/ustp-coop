angular.module('app')
    .controller('ApplicationCtrl', ApplicationCtrl)
    .controller('ImageCtrl', ImageCtrl)

ApplicationCtrl.$inject = ['$scope', '$ocLazyLoad', '$injector', '$filter'];
ImageCtrl.$inject = ['$scope', '$ocLazyLoad', '$injector', 'data', '$uibModalInstance'];

function ApplicationCtrl($scope, $ocLazyLoad, $injector, filter) {
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
    var cellTemplate3 =
		`<div class="ui-grid-icons-and-icons">
            <a href="javascript:void(0)" class="text-success mr-2 font-size-16" title="Accept" ng-click="grid.appScope.vm.acceptUser(row.entity)">Accept</a>
            <a href="javascript:void(0)" class="text-danger font-size-16" title="Decline" ng-click="grid.appScope.vm.declineUser(row.entity)">Decline</a>
        </div>`;
    var cellTemplate4 = `<div class="ui-grid-icons-and-icons" ng-click="grid.appScope.vm.showImage(row.entity)"><img src="{{row.entity.image}}" class="img-fluid cursor-pointer" style="width: 20px; height: 20px;"></div>`
	vm.defaultGrid = {
		enableRowSelection: false,
		enableCellEdit: false,
		enableColumnMenus: false,
		modifierKeysToMultiSelect: true,
		enableRowHeaderSelection: false,
		columnDefs: [
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
        vm.loading = true;
        AccountDetailSvc.get(data).then(function(response) {
            if(!response){
                vm.list = [];
            }else{
                response.map(function (d) {
                    d.searchList = d.name + ' ' + d.email;
                    d.image = APIURL + d.image_path;
                });
                vm.list = response;
            }
            vm.filtered = vm.list;
            vm.loading = false;
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
        vm.variables.index = vm.list.indexOf(data);
    }
    vm.delete = function(data){
        AccountSvc.delete(data.id).then(function (response) {
            if (response.data.success) {
                vm.list.splice(vm.list.indexOf(data), 1);
                vm.filtered = vm.list;
                AccountSvc.showAlert('Success!', response.message, 'success');
            } else {
                AccountSvc.showAlert('Failed!', 'Something went wrong', 'error');
            }
        })
    }
    vm.showImage = function (data) {
        var options = {
            data: data,
            templateUrl: APPURL + "applications/image.html?v=" + VERSION,
            controllerName: "ImageCtrl",
            controllerAs: 'modal',
            viewSize: 'md',
            animation: true,
            filesToLoad: [
                APPURL + "applications/image.html?v=" + VERSION,
                APPURL + "applications/controller.js?v=" + VERSION
            ]
        };
        AccountSvc.modal(options);
    }
    vm.acceptUser = function (data) {
        let index = vm.list.indexOf(data);
        AccountSvc.confirmation('Are You Sure?', `You want to accept ${data.name}?`, 'Yes', 'Cancel', false).then(function (modal) {
            if (modal) {
                data.account_status = 'approved';
                data.purpose = 'change_status';
                AccountSvc.save(data).then(function (response) {
                    if (response.data.success) {
                        vm.list.splice(index, 1);
                        vm.filtered = vm.list;
                        AccountSvc.showToaster('Success', response.data.message, 'success');
                    } else {
                        AccountSvc.showToaster('Error', 'Something went wrong', 'error');
                    }
                })
            }
        })
    }
    vm.declineUser = function (data) {
        AccountSvc.confirmation('Are You Sure?', `You want to accept ${data.name}?`, 'Yes', 'Cancel', true).then(function (response) {
            if (response) {
                data.account_status = 'approved';
                data.purpose = 'change_status';
                AccountSvc.save(data).then(function (response) {
                    if (response.success) {
                        vm.lists.splice(index, 1);
                        vm.clearFunction();
                        AppSvc.showToaster('Success', response.message, 'success');
                    } else {
                        AppSvc.showToaster('Error', 'Something went wrong', 'error');
                    }
                })
            }
        })
    }
}
function ImageCtrl($scope, $ocLazyLoad, $injector, data, $uibModalInstance) {
    var vm = this;
    vm.image = data.image;
    vm.close = function () {
        $uibModalInstance.close();
    }
}