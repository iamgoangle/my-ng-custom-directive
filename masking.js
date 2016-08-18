/**
 * Market Power - Masking Directive Plug-in for AngularJS
 * 
 * @author 		Teerapong Singthong Teerapong.Singthong@dstworldwideservices.com
 * 
 * @version 	1.0
 * @date 		08-23-2015
 * @feature		the functionality is completed 100% of the process validate user entered data input,
 *				masking was configured for input element has convert to regular expression string and
 *				validate it via JavaScript and change state validity of AngularJS
 *
 * @feature		completed option useStrict = true/false
 * 
 * @todo		all nice to have that will improve user-experience
 * @todo		cleaning incorrect character if user typing character not matching with current mask
 * @todo		auto-populate (prediction) dash, or parenthesis
 * 
 * @interface 	mpMasking call mp-masking in your element in AngularJS template
 * 
 * @restrict 	this directive options is only typical set to 'A'
 * 
 * @require 	ngModel
 * 
 * @support 	input html element
 * 
 * @masking 	In text fields, ColdFusion automatically inserts literal mask
 *          	characters, such as - characters in telephone numbers. Users type
 *          	only the variable part of the field. You can use the following
 *          	characters to mask data
 * 
 * A = Allows an uppercase or lowercase character: A–Z and a–z 
 * X = Allows an uppercase or lowercase character or number: A–Z, a–z, and 0–9 
 * 9 = Allows a number: 0–9 
 * ? = Allows any character
 * - = Allows a dash character
 * 
 */

var mpMaskingApp = angular.module('mpMasking', [])

mpMaskingApp.directive('mpMasking', function($timeout) {
	/**
	 * @function generateMaskingRefex
	 * 
	 * @param scopeMasking
	 *            string of masking that user passing in element directive
	 * 
	 * @param regexType
	 *            user can be selected type of regular expression that will
	 *            return from this function 1 = simple regular expression 2 =
	 *            standard regular expression
	 * 
	 * @param modifier
	 *            i = Perform case-insensitive matching g = Perform a global
	 *            match (find all matches rather than stopping after the first
	 *            match) m = Perform multiline matching
	 * 
	 * @return Regular expression string
	 */
	function generateMaskingRegex(scopeMasking, regexType) {
		var regex;
		var mask = scopeMasking;
		var regexString = '';
		var regexStandardString = '';
		var sameAsMeCount = 1;
		var retRegex = '';
		var regexArrString = [];

		var standardRegex = {
			'9' : '\\d',
			'A' : '[a-zA-Z]',
			'X' : '[a-zA-Z0-9]',
			'?' : '.',
			'-' : '\\-',
		};

		// generating regular expression string process
		for (var i = 0; i < mask.length; i++) {
			// generate standard regular expression string
			if (mask[i] == mask[i + 1] && typeof mask[i + 1] !== 'undefined') {
				sameAsMeCount += 1;
			} else {
				regexStandardString += mask[i].replace(mask[i],
						standardRegex[mask[i]])
						+ '{' + sameAsMeCount + '}';
				sameAsMeCount = 1;
			}

			// generate simple regular expression string
			regexString += mask[i].replace(mask[i], standardRegex[mask[i]]);

			// generate simple regular expression string to array
			regexArrString.push(mask[i]
					.replace(mask[i], standardRegex[mask[i]]));
		}

		// packing regex string
		switch (regexType) {
		case 1:
			retRegex = '^' + regexString + '$';
			break;
		case 2:
			retRegex = '^' + regexStandardString + '$';
			break;
		case 3:
			retRegex = regexArrString;
			break;
		}

		return retRegex;
	}

	// return true if match all string
	function validateStrictMode(string, pattern) {
		var result = new RegExp(pattern);
		return result.test(string);
	}

	// return true and position for matched string
	var unmatched = 0;
	function validateNonStrictMode(string, pattern) {
		if (string.length > pattern.length) {
			unmatched++;
			return unmatched;
		}
		for (var i = 0; i < string.length; i++) {
			var result = new RegExp(pattern[i]);
			if (result.test(string[i])) {
				unmatched = 0;
			} else {
				unmatched++;
			}
		}
		return unmatched;
	}

	var timeout;
	var promise;

	return {
		restrict : 'A',
		require : 'ngModel',
		link : function(scope, element, attrs, ngModelCtrl) {
			if (angular.isDefined(attrs.setmask)
					&& attrs.setmask.trim().length != 0) {
				var masking = attrs.setmask.trim();
				var patt = generateMaskingRegex(masking, 3);
				var correctString = '';
				scope.correctString = '';
				
				// pre-condition to check attribute is defined and trimmed should not empty
				if (angular.isDefined(attrs.setmask) && attrs.setmask != '') {
					scope.$watch(function() {
						if (attrs.strict == 'true') {
							if (validateStrictMode(ngModelCtrl.$modelValue, patt)) {
								ngModelCtrl.$setValidity('mask', true);

								element.css({
									'color' : '#000000'
								});
							} else {
								ngModelCtrl.$setValidity('mask', false);

								element.css({
									'color' : '#FF3300'
								});
							}
						} else {
							// using $timeout:
							// it should run after the DOM has been manipulated
							// by AngularJS and after the browser renders
							$timeout.cancel(timeout);
							timeout = $timeout(function() {
								if (validateNonStrictMode(ngModelCtrl.$modelValue, patt) == 0) {
									scope.correctString = angular.copy(element.val());
								} else {
									// replace value in input field, do not required set new model
									element.val(scope.correctString);
								}
							});
						}
					});
				}
			}
		}
	}
});
