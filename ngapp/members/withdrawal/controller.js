angular.module('app').controller('WithdrawalCtrl', WithdrawalCtrl)

WithdrawalCtrl.$inject = ['$scope', '$ocLazyLoad', '$injector', '$q', '$filter'];

function WithdrawalCtrl($scope, $ocLazyLoad, $injector, $q, filter) {
    var vm = this;
    vm.cameraOpened = false;
    vm.localStream = null;
    vm.variables = {};
    var interValId = null;
    vm.successfulWithdrawal = false;
    vm.accountBalance = 0;
    vm.profile = JSON.parse(localStorage.getItem('credentials'));
    $ocLazyLoad.load([APPURL + 'app.service.js?v=' + VERSION]).then(function (d) {
        WithdrawSvc = $injector.get('WithdrawSvc');
        AccountSvc = $injector.get('AccountSvc');
        vm.dateNow = filter('date')(new Date(), 'mediumDate');
        vm.getAccountBalance();
    });
    vm.getAccountBalance = function(){
        var account = JSON.parse(localStorage.getItem('credentials'));
        vm.accountBalance = 0;
        LOADING.classList.add('open');
		AccountSvc.get({purpose: 'get_balance', id: account.id}).then(function(response){
			if(response){
				vm.accountBalance = response.balance;
                vm.balance = filter('currency')(vm.accountBalance, '₱ ');
			}
            LOADING.classList.remove('open');
		});
	}
    vm.openCamera = async function () {
        if(parseFloat(AccountSvc.getAmount(vm.variables.totalAmt)) > parseFloat(vm.accountBalance)){
            return WithdrawSvc.showAlert('Error', 'Insufficient balance', 'error');
        }
        vm.cameraOpened = true;
        Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri('assets/components/models'),
            faceapi.nets.faceLandmark68Net.loadFromUri('assets/components/models'),
            faceapi.nets.faceRecognitionNet.loadFromUri('assets/components/models'),
        ]).then(vm.startVideo());
    }
    const video = document.getElementById('video1');
    vm.startVideo = async function () {
        await navigator.getUserMedia(
            { video: {} },
            stream =>  video.srcObject = stream,
            err => console.error(err)
        )
    }
    video.addEventListener('play', () => {
        const canvas = faceapi.createCanvasFromMedia(video)
        canvas.setAttribute("id", "canvas1");
        document.getElementById("appendHere").appendChild(canvas);
        const displaySize = {width: video.width, height: video.height}
        faceapi.matchDimensions(canvas, displaySize)
        interValId = setInterval(async () => {
            const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
            const resizedDetections = faceapi.resizeResults(detections, displaySize)
            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
            faceapi.draw.drawDetections(canvas, resizedDetections)
            if(resizedDetections.length > 0){
                vm.saveWithdrawal();
            }
        }, 1500)
    });
    vm.saveWithdrawal = function(){
        let canvas = document.querySelector("#capturedImg");
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        video.srcObject.getTracks().forEach(function(track) {
            track.stop();
        });
        let account = JSON.parse(localStorage.getItem('credentials'));
        let data = angular.copy(vm.variables);
        data.account = account.id;
        data.total_amount = WithdrawSvc.getAmount(vm.variables.totalAmt);
        data.image = canvas.toDataURL("image/jpg").replace(/^data:image\/[a-z]+;base64,/, "");
        data.purpose = 'request_withdrawal';
        WithdrawSvc.save(data).then(function (res) {
            if(res.data){
                if(res.data.success){
                    return vm.successfulWithdrawal = true;
                }else{
                    return WithdrawSvc.confirmation('Verification Error!', `You want to retry?`, 'Yes', 'Cancel', false).then(function (modal) {
                        if(modal){
                            return vm.startVideo();
                        }else{
                            return vm.closeAll();
                        }
                    });
                }
            }
            return WithdrawSvc.showAlert('Error', 'Something went wrong', 'error')
        });
    }
    vm.closeAll = function(){
        const modal = document.getElementById('modal1');
        modal.classList.remove('open');
        clearInterval(interValId);
        interValId = null;
        const recanvas = document.getElementById('canvas1');
        recanvas && recanvas.remove();
        vm.variables = {};
        vm.successfulWithdrawal = false;
    }

    vm.closeCamera = function () {
        video.srcObject.getTracks().forEach(function(track) {
            track.stop();
        });
        vm.cameraOpened = false;
        clearInterval(interValId);
        interValId = null;
        const recanvas = document.getElementById('canvas1');
        recanvas && recanvas.remove();
    }
}