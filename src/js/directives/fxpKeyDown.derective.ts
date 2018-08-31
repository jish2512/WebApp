export class FxpKeyDownDirective implements angular.IDirective {
	constructor() {

	}
	static fxpEnterKeyPressDirective() {
		return function (scope, elem, attr) {
			elem.bind("keydown keypress", function (evt) {
				if (evt.which === 13) {
					scope.$apply(function () {
						scope.$eval(attr.fxpKeyDown);
					});
					evt.preventDefault();
				}
			})
		};
	}
}