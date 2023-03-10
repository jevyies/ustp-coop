angular.module('app').controller('RegistrationCtrl', RegistrationCtrl)

RegistrationCtrl.$inject = ['$scope', '$ocLazyLoad', '$injector', '$q', '$filter'];

function RegistrationCtrl($scope, $ocLazyLoad, $injector, $q, filter) {
    var vm = this;
    vm.cameraOpened = false;
    vm.localStream = null;
    vm.variables = {};
    vm.captured = false;
    vm.variables = {};
    vm.submitted = false;
    vm.passwordNotMatch = false;
    vm.cameraLoaded = false;
    vm.webcamVideo = null;
    $ocLazyLoad.load([APPURL + 'app.service.js?v=' + VERSION]).then(function (d) {
        AccountSvc = $injector.get('AccountSvc');
    });

    vm.openCamera = async function () {
        vm.cameraOpened = true;
        vm.localStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
        });
        vm.webcamVideo = document.getElementById("video1");
        vm.webcamVideo.srcObject = vm.localStream;
        vm.cameraLoaded = true;
    }
    vm.closeCamera = function () {
        vm.localStream.getTracks().forEach(function(track) {
            track.stop();
        });
        vm.cameraOpened = false;
    }
    vm.capture = function () {
        vm.captured = true;
        let canvas = document.querySelector("#canvas");
        let canvas2 = document.querySelector("#capturedImg");
        canvas.getContext('2d').drawImage(vm.webcamVideo, 0, 0, canvas.width, canvas.height);
        canvas2.getContext('2d').drawImage(vm.webcamVideo, 0, 0, canvas2.width, canvas2.height);
        vm.variables.image = canvas2.toDataURL('image/jpeg');
        vm.closeCamera();
    }
    vm.save = function () {
        vm.submitted = true;
        if(vm.variables.password !== vm.variables.confirmPassword) {
            return vm.passwordNotMatch = true;
        }
        if(!vm.variables.image){
            return vm.captured = false;
        }
        let data = angular.copy(vm.variables);
        data.account_no = vm.variables.accountNo;
        data.purpose = 'register';
        data.image = vm.variables.image.replace(/^data:image\/[a-z]+;base64,/, "");
        AccountSvc.save(data).then(function(response) {
            if(!response.data){
                return AccountSvc.showAlert('Error', 'Error occured while saving data', 'error');
            }
            if(response.data.email_exists){
                return AccountSvc.showAlert('Error', 'Email already exists', 'error');
            }
            if(response.data.account_exists){   
                return AccountSvc.showAlert('Error', 'This account number is already registered', 'error');
            }
            vm.successfulRegistration = true;
        });
    }
}