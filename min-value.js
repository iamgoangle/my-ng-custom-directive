.directive('mpMinValue', function () {
	// ********************************************************************
	// * @author:		Teerapong, Singthong
	// * @date:			01/20/2016
	// * @objective: 	Market Power Directive - max value validation
	// *
	// ********************************************************************
	return {
		restrict: 'A',
		require: "?ngModel",
		link: function (scope, elem, attr, ngModelCtrl) {
			scope.$watch(attr.mpMinValue, function () {
				//ngModelCtrl.$setViewValue(ngModelCtrl.$viewValue);
			});

			function isEmpty(value) {
				return angular.isUndefined(value) || value === '' || value === null;
			}

			var minValidator = function (value) {
				var min = scope.$eval(attr.mpMinValue) || 0;
				if (!isEmpty(value) && value < min) {
					ngModelCtrl.$setValidity('minvalue', false);
					return undefined;
				} else {
					ngModelCtrl.$setValidity('minvalue', true);
					return value;
				}
			};

			// Parsers change how view values will be saved in the model.
			ngModelCtrl.$parsers.push(minValidator);

			// Formatters change how model values will appear in the view.
			ngModelCtrl.$formatters.push(minValidator);
		}
	};
});
