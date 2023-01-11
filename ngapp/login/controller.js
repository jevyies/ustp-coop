angular.module('app').controller('LoginCtrl', LoginCtrl);

LoginCtrl.$inject = ['$scope', '$ocLazyLoad', '$injector', '$state'];

function LoginCtrl($scope, $ocLazyLoad, $injector, $state) {
    var vm = this;
    vm.loginInterface = false;
    vm.loginCredentials = {
        email: '',
        password: '',
        as: 'admin'
    }

    vm.openLogin = (type) => {
        vm.loginInterface = true;
        vm.loginCredentials.as = type;
    }
    vm.closeLogin = () => {
        vm.loginInterface = false;
    }

    vm.login = () => {
        localStorage.setItem('credentials', JSON.stringify(vm.loginCredentials));
        if(vm.loginCredentials.as == 'admin'){
            $state.go('app.main');
        }else{
            $state.go('member.main');
        }
    }
}

