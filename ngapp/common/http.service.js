(function () {
	'use strict';
	angular
		.module('sharedMod', ['oc.lazyLoad'])
		.factory('httpService', httpService)
		.factory('baseService', baseService);

	httpService.$inject = ['$http', '$q', '$httpParamSerializerJQLike', '$ocLazyLoad', '$uibModal'];
	baseService.$inject = ['httpService', '$q', '$ocLazyLoad', '$uibModal', '$filter'];

	function httpService($http, $q, $httpParamSerializerJQLike, $ocLazyLoad, $uibModal) {
		var baseURL = '';
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
						swal('You are not logged in. Please login again.', '', 'error');
						window.location.href = BASE_URL + 'auth/login';
					}
				}
			);
		}
		function postData(data) {
			return $http({
				method: 'POST',
				url: this.baseURL,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
				data: $.param(data), //$httpParamSerializerJQLike(data)
			}).then(
				function (response) {
					return response;
				},
				function (error) {
					swal(error.data.message, '', 'warning');
					return false;
				}
			);
		}
		function putData(data) {
			return $http({
				method: 'PUT',
				url: this.baseURL,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				data: $.param(data),
			}).then(
				function (response) {
					return response;
				},
				function (error) {
					swal(error.data.message, '', 'warning');
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
					function (data) {
						if (data) {
							return $http({
								method: 'DELETE',
								url: baseURL,
								headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
							}).then(
								function (results) {
									deferred.resolve(results);
								},
								function (error) {
									deferred.resolve(false);
								}
							);
						}
					},
					function () {
						console.log('Modal closed');
					}
				);
			});
			return deferred.promise;
		}
		function uploadData(data) {
			return $http({
				method: 'POST',
				url: this.baseURL,
				withCredentials: true,
				headers: { 'Content-Type': undefined },
				transformRequest: angular.identity,
				data: data,
			}).then(
				function (results) {
					return results;
				},
				function (error) {
					swal(error.data.message, '', 'warning');
					return false;
				}
			);
		}
	}

	function baseService(httpService, $q, $ocLazyLoad, $uibModal, $filter) {
		var baseService = function () {
			var service = {
				modal: modal,
				get: get,
				save: save,
				delete: remove,
				showAlert: showSweetAlert,
				http: angular.copy(httpService),
				records: [],
				upload: upload,
				has_get: false,
				getDate: getDate,
				confirmation: confirmation
			};

			return service;

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
			function save(data) {
				httpService.baseURL = this.url;
				return httpService.postData(data).then(function (response) {
					return response.data;
				});
			}
			function upload(data) {
				httpService.baseURL = this.url;
				return httpService.uploadData(data).then(function (response) {
					return response.data;
				})
			}
			function remove(id) {
				httpService.baseURL = this.url + '?id=' + id;
				return httpService.deleteData().then(function (response) {
					return response.data;
				});
			}
		};
		return baseService;
	}
})();
