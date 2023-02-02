angular.module('app')
    .controller('AlertCtrl', AlertCtrl)

AlertCtrl.$inject = ['$scope', '$ocLazyLoad', '$injector', 'data', '$uibModalInstance'];

function AlertCtrl($scope, $ocLazyLoad, $injector, data, $uibModalInstance) {
    var modal = this;
    modal.variables = angular.copy(data);
    modal.focusButton = true;
    modal.close = function () {
        setTimeout(function () {
            $uibModalInstance.dismiss('cancel');
        }, 100);
    }
}