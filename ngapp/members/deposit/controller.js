angular.module('app').controller('DepositCtrl', DepositCtrl)

DepositCtrl.$inject = ['$scope', '$ocLazyLoad', '$injector', '$q', '$filter'];

function DepositCtrl($scope, $ocLazyLoad, $injector, $q, filter) {
    var vm = this;
    vm.attachments = '';
}