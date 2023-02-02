angular.module('app').controller('LoginCtrl', LoginCtrl);

LoginCtrl.$inject = ['$scope', '$ocLazyLoad', '$injector', '$state'];

function LoginCtrl($scope, $ocLazyLoad, $injector, $state) {
    var vm = this;
    $ocLazyLoad.load([APPURL + 'app.service.js?v=' + VERSION]).then(function (d) {
        AccountSvc = $injector.get('AccountSvc');
    });
    vm.loginInterface = false;
    vm.loginCredentials = {
        email: '',
        password: '',
        type: 'admin'
    }
    
    
    vm.openLogin = (type) => {
        vm.loginInterface = true;
        vm.loginCredentials.type = type;
    }
    vm.closeLogin = () => {
        vm.loginInterface = false;
    }

    vm.login = () => {
        vm.submitted = true;
        if(!vm.loginCredentials.email || !vm.loginCredentials.password){
            return;
        }
        let data = angular.copy(vm.loginCredentials);
        data.purpose = 'login';
        AccountSvc.save(data).then(function(response) {
            if(response.status == 401){
                return AccountSvc.showAlert('Error', 'Credentials are not valid', 'error');
            }
            if(response.data){
                if(response.data.not_yet_valid){
                    return AccountSvc.showAlert('Error', 'Account is not yet valid', 'error');
                }else{
                    response.as = data.type;
                    localStorage.setItem('credentials', JSON.stringify(response));
                    AccountSvc.showToaster('Success', 'Successfully login', 'success');
                    if(data.type == 'admin'){
                        return $state.go('app.main');
                    }else{
                        return $state.go('member.main');
                    }
                }
            }
            return AccountSvc.showAlert('Error', 'Connection Error', 'error');
        });
    }
}

