import { IRootScope } from "../interfaces/IRootScope";
import { FxpBreadcrumbService } from "../services/FxpBreadcrumbService";
import { FxpConstants } from "../common/ApplicationConstants";

export class fxpBreadcrumbLink {
	static fxpBreadcrumbLinksDirective($rootScope: IRootScope, $window, fxpBreadcrumbService: FxpBreadcrumbService) {
		var directive = {
			link: link,
			scope: {
				breadcrumbItem: "="
			},
			restrict: 'A'
		};
		return directive;

		function link(scope, element, attrs) {
			var elementClickHandler = ($event) => {
				if ($event.shiftKey || $event.ctrlKey || $event.target.tagName != 'A')
					return;
				// need to reload the page when partner used service to set breadcrumb, for example
				// Page A > Page B , when partner set Page B from service, url is same as A, so on click A, we need to use $window.location.reload()
				var breadcrumbLastItem = $rootScope.fxpBreadcrumb[$rootScope.fxpBreadcrumb.length - 1];
				if (scope.breadcrumbItem.href === $window.location.hash && breadcrumbLastItem.displayName !== scope.breadcrumbItem.displayName)
					$window.location.reload();
				if (breadcrumbLastItem.displayName !== scope.breadcrumbItem.displayName) {
					fxpBreadcrumbService.logBreadcrumbTelemetryInfo(FxpConstants.BreadcrumbEventType.BreadcrumbClick, scope.breadcrumbItem);
				}
				if (scope.breadcrumbItem.targetEventName)
					$rootScope.$emit(scope.breadcrumbItem.targetEventName);
			};
			element.bind('click', elementClickHandler);
			scope.$on('$destroy', function () {
				element.unbind('click', elementClickHandler);
			});
		}
	}
}

fxpBreadcrumbLink.fxpBreadcrumbLinksDirective['$inject'] = ['$rootScope', "$window", 'FxpBreadcrumbService'];