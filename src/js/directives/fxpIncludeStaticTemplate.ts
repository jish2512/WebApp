/*
    fxpIncludeStaticTemplate is an alternate to ng-include.
    But unlike ng-include it won't create a new scope while fetching the template.

    e.g.
    Usage <section fxp-include-static-template="path/to/static/template.html"> </section>
*/

export class FxpIncludeStaticTemplate implements angular.IDirective {
	scope = false;
	templateUrl = (element: JQuery, attrs) => {
		return attrs.fxpIncludeStaticTemplate;
	}
}
