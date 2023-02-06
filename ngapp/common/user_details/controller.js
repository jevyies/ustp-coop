angular
	.module('app')
	.controller('UserDetailsCtrl', UserDetailsCtrl)
	.controller('ChangePasswordCtrl', ChangePasswordCtrl);

UserDetailsCtrl.$inject = ['$scope', '$ocLazyLoad', '$injector', 'data', '$uibModalInstance'];
ChangePasswordCtrl.$inject = ['$scope', '$ocLazyLoad', '$injector', 'data', '$uibModalInstance'];

function UserDetailsCtrl($scope, $ocLazyLoad, $injector, data, $uibModalInstance) {
	var modal = this;
    modal.variables = angular.copy(data);
	modal.variables.image = APIURL + data.image_path;
    modal.update = function(){
        let data = angular.copy(modal.variables);
        data.purpose = 'update_details';
        AccountSvc.save(data).then(function (response) {
            if (response.data) {
                AccountSvc.showToaster('Success!', 'Successfully updated', 'success');
                $uibModalInstance.close(data);
            } else {
                AccountSvc.showToaster('Failed!', 'Something went wrong', 'error');
            }
        })
    }
    modal.close = function () {
        $uibModalInstance.dismiss('cancel');
    };
}
function ChangePasswordCtrl($scope, $ocLazyLoad, $injector, data, $uibModalInstance) {
	var modal = this;
	modal.variables = {};
	modal.variables.id = data.id;
	modal.save = function() {
		if (modal.variables.confirm !== modal.variables.new) {
			return AccountSvc.showAlert(
				'Confirmation',
				'New Password does not match to Confirm Password. Try Again',
				'warning'
			);
		}
		var data = angular.copy(modal.variables);
		let account = JSON.parse(localStorage.getItem('credentials'));
		data.changePass = true;
		data.password = modal.variables.new;
		data.purpose = 'update_password';
		data.name = account.name;
		data.email = account.email;
		AccountSvc.save(data).then(function(response) {
			if (response.data.success) {
				AccountSvc.showAlert('Success', response.data.message, 'success');
				$uibModalInstance.close(modal.variables);
			} else {
				AccountSvc.showAlert('Error', 'Something went wrong', 'error');
			}
		});
	};
	modal.close = function() {
		$uibModalInstance.dismiss('cancel');
	};
}
