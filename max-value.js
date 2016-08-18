.directive('mpMaxValue', function () {
	// ********************************************************************
	// * @author:		Teerapong, Singthong
	// * @date:			01/20/2016
	// * @objective: 	Market Power Directive - min value validation
	// *
	// ********************************************************************
	return {
		restrict: 'A',
		require: '?ngModel',
		link: function (scope, elem, attr, ngModelCtrl) {
			scope.$watch(attr.mpMaxValue, function () {
				//ngModelCtrl.$setViewValue(ngModelCtrl.$viewValue);
			});

			function isEmpty(value) {
				return angular.isUndefined(value) || value === '' || value === null;
			}

			var maxValidator = function (value) {
				var max = scope.$eval(attr.mpMaxValue) || Infinity;
				if (!isEmpty(value) && value > max) {
					ngModelCtrl.$setValidity('maxvalue', false);
					return undefined;
				} else {
					ngModelCtrl.$setValidity('maxvalue', true);
					return value;
				}
			};

			// Parsers change how view values will be saved in the model.
			ngModelCtrl.$parsers.push(maxValidator);

			// Formatters change how model values will appear in the view.
			ngModelCtrl.$formatters.push(maxValidator);
		}
	};
});
