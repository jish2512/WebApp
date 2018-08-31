/**
 * @application  Fxp
 */
/**
	* Direstive to pull focus to content area
    * @class Fxp.Directives.SkipToMainContent
    * @example 
    * To Use SkipToMainContent
    * angular.module('FxPApp').directive('skipToMainContent', SkipToMainContent.getDirective);
    */
export class SkipToMainContent {
	public restrict: string;

	constructor() {
		this.restrict = 'C';
	}

	link(scope, element, attrs) {
		let onClick = function () {
			let allInteractiveElements = $(".partner-app [ui-view]").find("a:not([disabled]), input:not([disabled]), textbox:not([disabled]), select:not([disabled]), dropdown:not([disabled]), checkbox:not([disabled]), radio:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex=0]:not([disabled])").filter(':visible');
			allInteractiveElements[0].focus();
		},
			cleanUp = function () {
				element.off('click');
			};
		element.on('click', onClick);
		scope.$on('$destroy', cleanUp);
	}

	// Factory method: Returns the object of SkipToMainContent directive.
	static getDirective() {
		let directive = new SkipToMainContent();
		return directive;
	}
}