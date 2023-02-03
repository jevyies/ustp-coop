angular.module('app').controller('WithdrawalCtrl', WithdrawalCtrl)

WithdrawalCtrl.$inject = ['$scope', '$ocLazyLoad', '$injector', '$q', '$filter'];

function WithdrawalCtrl($scope, $ocLazyLoad, $injector, $q, filter) {
    var vm = this;
    vm.cameraOpened = false;
    vm.localStream = null;
    vm.variables = {};
    var interValId = null;
    vm.openCamera = async function () {
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
                vm.variables.image = canvas.toDataURL("image/png");
                vm.saveWithdrawal();
            }
        }, 3000)
    });
    vm.saveWithdrawal = function(){
        console.log(vm.variables);
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