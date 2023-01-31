angular.module('app').controller('WithdrawalCtrl', WithdrawalCtrl)

WithdrawalCtrl.$inject = ['$scope', '$ocLazyLoad', '$injector', '$q', '$filter'];

function WithdrawalCtrl($scope, $ocLazyLoad, $injector, $q, filter) {
    var vm = this;
    vm.cameraOpened = false;
    vm.localStream = null;
    vm.variables = {};
    
    vm.openCamera = async function () {
        vm.cameraOpened = true;
        vm.localStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
        });
        setTimeout(function () {
            const webcamVideo = document.getElementById("video1");
            webcamVideo.srcObject = vm.localStream;
        }, 1000);
    }
    vm.closeCamera = function () {
        vm.localStream.getTracks().forEach(function(track) {
            track.stop();
        });
        vm.cameraOpened = false;
    }
}