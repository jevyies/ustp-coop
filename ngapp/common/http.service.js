(function () {
	'use strict';
	angular
		.module('sharedMod', ['oc.lazyLoad'])
		.factory('httpService', httpService)
		.factory('baseService', baseService);

	httpService.$inject = ['$http', '$q', '$httpParamSerializerJQLike', '$ocLazyLoad', '$uibModal'];
	baseService.$inject = ['httpService', '$q', '$ocLazyLoad', '$uibModal', '$filter', 'toastr'];

	function httpService($http, $q, $httpParamSerializerJQLike, $ocLazyLoad, $uibModal) {
		var service = {
			getData: getData,
			postData: postData,
			putData: putData,
			deleteData: deleteData,
			uploadData: uploadData,
		};
		return service;

		function getData(data, urldata) {
			var url = this.baseURL;
			if (urldata) {
				url = urldata;
			}
			if (data && data != {}) {
				var params = '?';
				angular.forEach(data, function (v, k) {
					params += k + '=' + v + '&';
				});
				url += params;
			}
			return $http({
				method: 'GET',
				url: url,
			}).then(
				function (results) {
					return results;
				},
				function (error) {
					if (error.status == 403) {
						window.location.href = BASE_URL + 'auth/login';
					}
				}
			);
		}
		async function postData(data) {
			LOADING.classList.add('open');
			return await $http({
				method: 'POST',
				url: this.baseURL,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
				data: $.param(data), //$httpParamSerializerJQLike(data)
			}).then(
				function (response) {
					LOADING.classList.remove('open');
					console.log(response);
					return response;
				},
				function (error) {
					LOADING.classList.remove('open');
					return error;
				}
			);
		}
		async function putData(data) {
			LOADING.classList.add('open');
			return await $http({
				method: 'PUT',
				url: this.baseURL,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				data: $.param(data),
			}).then(
				function (response) {
					LOADING.classList.remove('open');
					return response;
				},
				function (error) {
					LOADING.classList.remove('open');
					return false;
				}
			);
		}
		function deleteData() {
			var baseURL = this.baseURL;
			var deferred = $q.defer();
			var templateUrl = COMURL + 'confirmation/view.html?v=' + VERSION;
			var filesToLoad = [
				COMURL + 'confirmation/view.html?v=' + VERSION,
				COMURL + 'confirmation/controller.js?v=' + VERSION,
			]
			var controllerName = 'ConfirmationCtrl';
			var dataFromMainCtrl = {
				title: 'Confirm Deletion?',
				message: 'Are you sure you want to delete this record?',
				buttonTruthyName: 'Delete',
				buttonFalsyName: 'Cancel',
				danger: true
			};
			$ocLazyLoad.load(filesToLoad).then(function () {
				var modalInstance = $uibModal.open({
					animation: false,
					templateUrl: templateUrl,
					controller: controllerName,
					controllerAs: 'modal',
					windowClass: 'confirmation-window',
					backdrop: 'static',
					resolve: {
						data: function () {
							return dataFromMainCtrl;
						},
					},
				});
				modalInstance.result.then(
					 	async function (data) {
						if (data) {
							LOADING.classList.add('open');
							return await $http({
								method: 'DELETE',
								url: baseURL,
								headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
							}).then(
								function (results) {
									LOADING.classList.remove('open');
									deferred.resolve(results);
								},
								function (error) {
									LOADING.classList.remove('open');
									deferred.resolve(false);
								}
							);
						}
					},
				);
			});
			return deferred.promise;
		}
		function uploadData(data) {
			LOADING.classList.add('open');
			return $http({
				method: 'POST',
				url: this.baseURL,
				withCredentials: true,
				headers: { 'Content-Type': undefined },
				transformRequest: angular.identity,
				data: data,
			}).then(
				function (results) {
					LOADING.classList.remove('open');
					return results;
				},
				function (error) {
					LOADING.classList.remove('open');
					return false;
				}
			);
		}
	}

	function baseService(httpService, $q, $ocLazyLoad, $uibModal, $filter, toastr) {
		var baseService = function () {
			var service = {
				modal: modal,
				get: get,
				save: save,
				update: update,
				delete: remove,
				showAlert: showSweetAlert,
				showToaster: showToaster,
				http: angular.copy(httpService),
				records: [],
				upload: upload,
				has_get: false,
				getDate: getDate,
				confirmation: confirmation
			};

			return service;

			function showToaster(title, message, icon) {
                if (icon === 'success') {
                    toastr.success(message, title);
                } else if (icon === 'warning') {
                    toastr.warning(message, title);
                } else {
                    toastr.error(message, title);
                }
            }

			function modal(options) {
				var templateUrl = options.templateUrl;
				var filesToLoad = options.filesToLoad;
				var controllerName = options.controllerName;
				var windowClass = options.windowClass;
				var viewSize = 'lg';
				var controllerAs = 'modal';
				var animation = options.animation;
				if (options.viewSize && options.viewSize.length > 0) {
					viewSize = options.viewSize;
				}
				var dataFromMainCtrl = options.data;
				if (options.controllerAs) {
					controllerAs = options.controllerAs;
				}
				return $ocLazyLoad.load(filesToLoad).then(function () {
					var modalInstance = $uibModal.open({
						animation: animation,
						templateUrl: templateUrl,
						controller: controllerName,
						controllerAs: controllerAs,
						size: viewSize,
						windowClass: windowClass,
						backdrop: 'static',
						resolve: {
							data: function () {
								return dataFromMainCtrl;
							},
						},
					});
					return modalInstance.result.then(
						function (data) {
							return data;
						},
						function () {
							console.log('Modal Closed');
						}
					);
				});
			}
			function confirmation(title, message, trueButton, falseButton, danger) {
				var data = { title: title, message: message, buttonTruthyName: trueButton, buttonFalsyName: falseButton, danger: danger };
				var templateUrl = COMURL + 'confirmation/view.html?v=' + VERSION;
				var filesToLoad = [
					COMURL + 'confirmation/view.html?v=' + VERSION,
					COMURL + 'confirmation/controller.js?v=' + VERSION,
				]
				var controllerName = 'ConfirmationCtrl';
				return $ocLazyLoad.load(filesToLoad).then(function () {
					var modalInstance = $uibModal.open({
						animation: false,
						templateUrl: templateUrl,
						controller: controllerName,
						controllerAs: 'modal',
						windowClass: 'confirmation-window',
						backdrop: 'static',
						resolve: {
							data: function () {
								return data;
							},
						},
					});
					return modalInstance.result.then(
						function (data) {
							return data;
						},
						function () {
							console.log('Modal Closed');
						}
					);
				});
			}
			function showSweetAlert(title, message, icon) {
				var showSwal = { title: title, text: message, icon: icon, };
				var templateUrl = COMURL + 'alerts/view.html?v=' + VERSION;
				var filesToLoad = [
					COMURL + 'alerts/view.html?v=' + VERSION,
					COMURL + 'alerts/controller.js?v=' + VERSION,
					COMURL + 'alerts/sweetalert.css',
				]
				var controllerName = 'AlertCtrl';
				return $ocLazyLoad.load(filesToLoad).then(function () {
					var modalInstance = $uibModal.open({
						animation: false,
						templateUrl: templateUrl,
						controller: controllerName,
						controllerAs: 'modal',
						windowClass: 'confirmation-window',
						backdrop: 'static',
						resolve: {
							data: function () {
								return showSwal;
							},
						},
					});
					return modalInstance.result.then(
						function (data) {
							return data;
						},
						function () {
							console.log('Modal Closed');
						}
					);
				});
			}
			function getDate(inputDate) {
				var dt = new Date(inputDate);
				var dtString = dt.getFullYear() + '-' + pad(dt.getMonth() + 1) + '-' + pad(dt.getDate());
				return dtString;
			}
			function pad(number, length) {
				var str = '' + number;
				while (str.length < length) {
					str = '0' + str;
				}
				return str;
			}
			function get(data) {
				httpService.baseURL = this.url;
				return httpService.getData(data).then(function (response) {
					return response.data;
				});
			}
			async function save(data) {
				httpService.baseURL = this.url;
				return await httpService.postData(data).then(function (response) {
					return response;
				})
			}
			async function update(data) {
				httpService.baseURL = this.url;
				return await httpService.putData(data).then(function (response) {
					return response;
				})
			}
			async function upload(data) {
				httpService.baseURL = this.url;
				return await httpService.uploadData(data).then(function (response) {
					return response.data;
				})
			}
			function remove(id) {
				httpService.baseURL = this.url+id;
				return httpService.deleteData().then(function (response) {
					return response;
				});
			}
		};
		return baseService;
	}
})();
