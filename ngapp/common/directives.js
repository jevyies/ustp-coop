angular
	.module('app')
	.directive('onlyNumbersLessThan100', onlyNumbersLessThan100)
	.directive('onlyNumbers', onlyNumbers)
	.directive('includeReplace', includeReplace)
	.directive('a', preventClickDirective)
	.directive('a', bootstrapCollapseDirective)
	.directive('a', navigationDirective)
	.directive('button', layoutToggleDirective)
	.directive('a', layoutToggleDirective)
	.directive('button', collapseMenuTogglerDirective)
	.directive('div', bootstrapCarouselDirective)
	.directive('toggle', bootstrapTooltipsPopoversDirective)
	.directive('tab', bootstrapTabsDirective)
	.directive('button', cardCollapseDirective)
	.directive('modalMovable', modalMovable)
	.directive('rightClick', rightClick)
	.directive('fileModel', fileModel)
	.directive('customOnChange', customOnChange)
	.directive('focusMe', focusMe)
	.directive('clickOutside', clickOutside)
	.directive('onlyNumbersWoNegative', onlyNumbersWoNegative)
	.directive('onlyNumbersWNegative', onlyNumbersWNegative);

function onlyNumbersWoNegative() {
	return {
		restrict: 'A',
		require: '?ngModel',
		link: function (scope, element, attrs, ngModel) {
			scope.$watch(attrs.ngModel, function (v) {
				if (v) {
					var Num = v.toString();
					Num += '';
					Num = Num.replace(',', ''); Num = Num.replace(',', ''); Num = Num.replace(',', '');
					Num = Num.replace(',', ''); Num = Num.replace(',', ''); Num = Num.replace(',', '');
					Num = Num.replace(',', ''); Num = Num.replace(',', ''); Num = Num.replace(',', '');
					x = Num.split('.');
					x1 = x[0];
					x2 = x.length > 1 ? '.' + x[1] : '';
					var rgx = /(\d+)(\d{3})/;
					while (rgx.test(x1))
						x1 = x1.replace(rgx, '$1' + ',' + '$2');
					var final = x1 + x2;
					var fixedInput = final.replace(/[^0-9.,]+/g, '');
					ngModel.$setViewValue(fixedInput);
					ngModel.$render();
				}
			});
		}
	};
}
function onlyNumbersWNegative() {
	return {
		restrict: 'A',
		require: '?ngModel',
		link: function (scope, element, attrs, ngModel) {
			scope.$watch(attrs.ngModel, function (v) {
				if (v) {
					var fixedInput = v.replace(/[^0-9.,-]+/g, '');

					ngModel.$setViewValue(fixedInput);
					ngModel.$render();
				}
			});
		}
	};
}
function clickOutside($document, $parse, $timeout) {
	return {
		restrict: 'A',
		compile: function(tElement, tAttrs) {
		var fn = $parse(tAttrs.offClick);
		
		return function(scope, iElement, iAttrs) {
			function eventHandler(ev) {
			if (iElement[0].contains(ev.target)) {
				$document.one('click touchend', eventHandler);
			} else {
				scope.$apply(function() {
				fn(scope);
				});
			}
			}
			scope.$watch(iAttrs.offClickActivator, function(activate) {
			if (activate) {
				$timeout(function() {
				// Need to defer adding the click handler, otherwise it would
				// catch the click event from ng-click and trigger handler expression immediately
						$document.one('click touchend', eventHandler);
				});
			} else {
				$document.off('click touchend', eventHandler);
			}
			});
		};
		}
	};
}
focusMe.$inject = ['$timeout', '$parse'];
function focusMe($timeout, $parse) {
	return {
		link: function (scope, element, attrs) {
			var model = $parse(attrs.focusMe);
			scope.$watch(model, function (value) {
				if (value === true) {
					$timeout(function () {
						element[0].focus();
					});
				}
			});
			element.bind('blur', function () {
				scope.$apply(model.assign(scope, false));
			})
		}
	}
}
function onlyNumbers() {
	return {
		restrict: 'A',
		require: '?ngModel',
		link: function (scope, element, attrs, ngModel) {
			scope.$watch(attrs.ngModel, function (v) {
				if (v) {
					var fixedInput = v.replace(/[^0-9.]+/g, '');
					ngModel.$setViewValue(fixedInput);
					ngModel.$render();
				}
			});
		}
	};
}
function onlyNumbersLessThan100() {
	return {
		restrict: 'A',
		require: '?ngModel',
		link: function (scope, element, attrs, ngModel) {
			scope.$watch(attrs.ngModel, function (v) {
				if (v) {
					var fixedInput = v.replace(/[^0-9.]+/g, '');
					if (parseFloat(fixedInput) > 100) {
						fixedInput = 100;
					}
					ngModel.$setViewValue(fixedInput);
					ngModel.$render();
				}
			});
		}
	};
}
function fileModel($parse) {
	return {
		restrict: 'A',
		link: function (scope, element, attrs) {
			var model = $parse(attrs.fileModel);
			var modelSetter = model.assign;

			element.bind('change', function () {
				scope.$apply(function () {
					modelSetter(scope, element[0].files[0]);
				});
			});
		},
	};
}
function customOnChange() {
	return {
		restrict: "A",
		scope: {
			handler: '&'
		},
		link: function (scope, element) {

			element.change(function (event) {
				scope.$apply(function () {
					var params = { event: event, el: element };
					scope.handler({ params: params });
				});
			});
		}

	};
}
function rightClick($parse) {
	return function (scope, element, attrs) {
		var fn = $parse(attrs.rightClick);
		element.bind('contextmenu', function (event) {
			scope.$apply(function () {
				event.preventDefault();
				fn(scope, { $event: event });
			});
		});
	};
}
function includeReplace() {
	var directive = {
		require: 'ngInclude',
		restrict: 'A',
		link: link,
	};
	return directive;

	function link(scope, element, attrs) {
		element.replaceWith(element.children());
	}
}

//Prevent click if href="#"
function preventClickDirective() {
	var directive = {
		restrict: 'E',
		link: link,
	};
	return directive;

	function link(scope, element, attrs) {
		if (attrs.href === '#') {
			element.on('click', function (event) {
				event.preventDefault();
			});
		}
	}
}

//Bootstrap Collapse
function bootstrapCollapseDirective() {
	var directive = {
		restrict: 'E',
		link: link,
	};
	return directive;

	function link(scope, element, attrs) {
		if (attrs.toggle == 'collapse') {
			element.attr('href', 'javascript;;').attr('data-target', attrs.href.replace('dashboard.html', ''));
		}
	}
}

/**
 * @desc Genesis main navigation - Siedebar menu
 * @example <li class="nav-item nav-dropdown"></li>
 */
function navigationDirective() {
	var directive = {
		restrict: 'E',
		link: link,
	};
	return directive;

	function link(scope, element, attrs) {
		if (element.hasClass('nav-dropdown-toggle') && angular.element('body').width() > 782) {
			element.on('click', function () {
				if (!angular.element('body').hasClass('compact-nav')) {
					element
						.parent()
						.toggleClass('open')
						.find('.open')
						.removeClass('open');
				}
			});
		} else if (element.hasClass('nav-dropdown-toggle') && angular.element('body').width() < 783) {
			element.on('click', function () {
				element
					.parent()
					.toggleClass('open')
					.find('.open')
					.removeClass('open');
			});
		}
	}
}

//Dynamic resize .sidebar-nav
sidebarNavDynamicResizeDirective.$inject = ['$window', '$timeout'];
function sidebarNavDynamicResizeDirective($window, $timeout) {
	var directive = {
		restrict: 'E',
		link: link,
	};
	return directive;

	function link(scope, element, attrs) {
		if (element.hasClass('sidebar-nav') && angular.element('body').hasClass('fixed-nav')) {
			var bodyHeight = angular.element(window).height();
			scope.$watch(function () {
				var headerHeight = angular.element('header').outerHeight();

				if (angular.element('body').hasClass('sidebar-off-canvas')) {
					element.css('height', bodyHeight);
				} else {
					element.css('height', bodyHeight - headerHeight);
				}
			});

			angular.element($window).bind('resize', function () {
				var bodyHeight = angular.element(window).height();
				var headerHeight = angular.element('header').outerHeight();
				var sidebarHeaderHeight = angular.element('.sidebar-header').outerHeight();
				var sidebarFooterHeight = angular.element('.sidebar-footer').outerHeight();

				if (angular.element('body').hasClass('sidebar-off-canvas')) {
					element.css('height', bodyHeight - sidebarHeaderHeight - sidebarFooterHeight);
				} else {
					element.css('height', bodyHeight - headerHeight - sidebarHeaderHeight - sidebarFooterHeight);
				}
			});
		}
	}
}

//LayoutToggle
layoutToggleDirective.$inject = ['$interval'];
function layoutToggleDirective($interval) {
	var directive = {
		restrict: 'E',
		link: link,
	};
	return directive;

	function link(scope, element, attrs) {
		element.on('click', function () {
			if (element.hasClass('sidebar-toggler')) {
				angular.element('body').toggleClass('sidebar-hidden');
			}

			if (element.hasClass('aside-menu-toggler')) {
				angular.element('body').toggleClass('aside-menu-hidden');
			}
		});
	}
}

//Collapse menu toggler
function collapseMenuTogglerDirective() {
	var directive = {
		restrict: 'E',
		link: link,
	};
	return directive;

	function link(scope, element, attrs) {
		element.on('click', function () {
			if (element.hasClass('navbar-toggler') && !element.hasClass('layout-toggler')) {
				angular.element('body').toggleClass('sidebar-mobile-show');
			}
		});
	}
}

//Bootstrap Carousel
function bootstrapCarouselDirective() {
	var directive = {
		restrict: 'E',
		link: link,
	};
	return directive;

	function link(scope, element, attrs) {
		if (attrs.ride == 'carousel') {
			element.find('a').each(function () {
				$(this)
					.attr(
						'data-target',
						$(this)
							.attr('href')
							.replace('index.html', '')
					)
					.attr('href', 'javascript;;');
			});
		}
	}
}

//Bootstrap Tooltips & Popovers
function bootstrapTooltipsPopoversDirective() {
	var directive = {
		restrict: 'A',
		link: link,
	};
	return directive;

	function link(scope, element, attrs) {
		if (attrs.toggle == 'tooltip') {
			angular.element(element).tooltip();
		}
		if (attrs.toggle == 'popover') {
			angular.element(element).popover();
		}
	}
}

//Bootstrap Tabs
function bootstrapTabsDirective() {
	var directive = {
		restrict: 'A',
		link: link,
	};
	return directive;

	function link(scope, element, attrs) {
		element.click(function (e) {
			e.preventDefault();
			angular.element(element).tab('show');
		});
	}
}

//Card Collapse
function cardCollapseDirective() {
	var directive = {
		restrict: 'E',
		link: link,
	};
	return directive;

	function link(scope, element, attrs) {
		if (attrs.toggle == 'collapse' && element.parent().hasClass('card-actions')) {
			if (
				element
					.parent()
					.parent()
					.parent()
					.find('.card-block')
					.hasClass('in')
			) {
				element.find('i').addClass('r180');
			}

			var id = 'collapse-' + Math.floor(Math.random() * 1000000000 + 1);
			element.attr('data-target', '#' + id);
			element
				.parent()
				.parent()
				.parent()
				.find('.card-block')
				.attr('id', id);

			element.on('click', function () {
				element.find('i').toggleClass('r180');
			});
		}
	}
}
modalMovable.inject = ['$document'];
function modalMovable($document) {
	return {
		restrict: 'AC',
		link: function (scope, iElement, iAttrs) {
			var startX = 0,
				startY = 0,
				x = 0,
				y = 0;

			var dialogWrapper = iElement.parent();

			dialogWrapper.css({
				position: 'relative',
			});

			dialogWrapper.on('mousedown', function (event) {
				// Prevent default dragging of selected content
				event.preventDefault();
				startX = event.pageX - x;
				startY = event.pageY - y;
				$document.on('mousemove', mousemove);
				$document.on('mouseup', mouseup);
			});

			function mousemove(event) {
				y = event.pageY - startY;
				x = event.pageX - startX;
				dialogWrapper.css({
					top: y + 'px',
					left: x + 'px',
				});
			}

			function mouseup() {
				$document.unbind('mousemove', mousemove);
				$document.unbind('mouseup', mouseup);
			}
		},
	};
}
