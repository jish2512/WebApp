import { ILogger } from "../interfaces/ILogger";
import { IRootScope } from "../interfaces/IRootScope";
import { FxpMessageService } from "../services/FxpMessageService";
import { OBOUserService } from "../services/OBOUserService";
import { FxpBreadcrumbService } from "../services/FxpBreadcrumbService";
import { UserInfoService } from "../services/UserInfoService";
import { TelemetryContext } from "../telemetry/telemetrycontext";
import { FxpConstants } from "../common/ApplicationConstants";
declare type IStateService = any; 

export class LeftnavLink {
	static fxpLeftnavLinkDirective($state: IStateService, $rootScope: IRootScope, fxplogger: ILogger, userInfoService: UserInfoService, fxpTelemetryContext: TelemetryContext, oboUserService: OBOUserService, FxpMessageService: FxpMessageService, FxpBreadcrumbService: FxpBreadcrumbService) {
		var directive = {
			link: link,
			restrict: 'A'
		};
		var businessProcessNameL0, displayNameL0;
		return directive;

		function logLeftNavActivity(captureChildLinkName) {
			const leftNavClickCount = 1;
			var userInfo = userInfoService.getCurrentUserData();
			const classNameFxpLeftnavLink = "Fxp.LeftnavLink";
			var fxpConstants = FxpConstants;

			// Creating PropertyBag
			var propbag = fxplogger.createPropertyBag();

			// Adding businessProcessNameL0 to propbag
			propbag.addToBag(fxpConstants.metricConstants.L0BusinessProcessName, businessProcessNameL0);

			// Adding L0Name to propbag
			propbag.addToBag(fxpConstants.metricConstants.L0Name, displayNameL0);

			// Adding L0Name_L1Name to propbag
			propbag.addToBag(fxpConstants.metricConstants.L0Name_L1Name, captureChildLinkName);

			// Adding UserRoleGroup name to propbag
			propbag.addToBag(fxpConstants.metricConstants.UserRoleGroup, userInfo.roleGroupName);

			// logging LeftNavigationClickCountbyRoleGroup metric data
			fxplogger.logMetric(classNameFxpLeftnavLink, fxpConstants.metricConstants.LeftNavigationClickCountbyRoleGroup, leftNavClickCount, propbag);

			// Adding UserBusinessRole to propbag
			propbag.addToBag(fxpConstants.metricConstants.UserBusinessRole, userInfo.businessRole);

			// logging LeftNavigationClickCountbyRole metric data
			fxplogger.logMetric(classNameFxpLeftnavLink, fxpConstants.metricConstants.LeftNavigationClickCountbyRole, leftNavClickCount, propbag);

			// Adding UserAgent to propbag
			propbag.addToBag(fxpConstants.metricConstants.UserAgent, navigator.userAgent);

			// Adding Geography to propbag
			propbag.addToBag(fxpConstants.metricConstants.Geography, fxpTelemetryContext.getGeography());

			// logging LeftNavigationClick event
			fxplogger.logEvent(classNameFxpLeftnavLink, "LeftNavigationClick", propbag);
		}

		//ToDo:Refactor telemetry code in this file using common method.
		function logLeftNavLoadFailEvent(linkName) {
			var userInfo = userInfoService.getCurrentUserData();
			const classNameFxpLeftnavLink = "Fxp.LeftnavLink";
			var fxpConstants = FxpConstants;

			// Creating PropertyBag
			var propbag = fxplogger.createPropertyBag();

			// Adding businessProcessNameL0 to propbag
			propbag.addToBag(fxpConstants.metricConstants.L0BusinessProcessName, businessProcessNameL0);

			// Adding L0Name to propbag
			propbag.addToBag(fxpConstants.metricConstants.L0Name, displayNameL0);

			// Adding L0Name_L1Name to propbag
			propbag.addToBag(fxpConstants.metricConstants.L0Name_L1Name, linkName);

			// Adding UserRoleGroup name to propbag
			propbag.addToBag(fxpConstants.metricConstants.UserRoleGroup, userInfo.roleGroupName);

			// Adding UserBusinessRole to propbag
			propbag.addToBag(fxpConstants.metricConstants.UserBusinessRole, userInfo.businessRole);

			// Adding UserAgent to propbag
			propbag.addToBag(fxpConstants.metricConstants.UserAgent, navigator.userAgent);

			// Adding Geography to propbag
			propbag.addToBag(fxpConstants.metricConstants.Geography, fxpTelemetryContext.getGeography());

			// logging LeftNavigationClick event
			fxplogger.logEvent(classNameFxpLeftnavLink, "LeftNavClickFailDueToMissingDependencies", propbag);
		}

		function link(scope, element, attrs) {
			if (!attrs.fxpLeftnavLink)
				return;
			var item = JSON.parse(attrs.fxpLeftnavLink);
			var url, target;
			// updating target value for link
			target = item.openInline === true ? '_self' : '_blank';
			element.attr('target', target);
			// when targetEventName set do not calculate href value.
			if (!item.targetEventName) {


				url = item.targetUIStateName ? $state.href(item.targetUIStateName) : item.targetURL;
				if (url)
					element.attr('href', url);
			}

			var elementClickHandler = function ($event) {

				var captureChildLinkName;
				var item = JSON.parse(attrs.fxpLeftnavLink);

				//If dependencies are missing stop further exeution and log event along with showing message in UI.
				if (item.dependenciesMissing && item.dependenciesMissing === true) {
					FxpMessageService.addMessage($rootScope.fxpUIConstants.UIMessages.StateChangeErrorDueToMissingModules.ErrorMessageTitle, FxpConstants.messageType.error);

					//Log a new event to notify that left nav click is restricted.
					var linkName = item.parentId != null ? item.displayName : "";
					logLeftNavLoadFailEvent(linkName);

					$event.preventDefault();

				}
				else {
					if ($state.current.name == item.targetUIStateName)
						$state.reload();
					if (item.businessProcessName && item.parentId == null) {
						//capturing businessProcessName for L0 when we click on L0 Item
						businessProcessNameL0 = item.businessProcessName;
						//capturing displayName for L0  when we click on L0 Item
						displayNameL0 = item.displayName;
					}
					else {
						businessProcessNameL0 = "";
						displayNameL0 = "";
					}

					if (element.attr('href') != "" && element.attr('href') != "#") {
						if (element.attr('target') === '_self' && !$event.ctrlKey && !$event.shiftKey)
							initiateClickStartTime(item.displayName);
						//updating captureChildLinkName in L0Name_L1Name
						captureChildLinkName = item.parentId != null ? item.displayName : "";
						//method to log telemetry data
						logLeftNavActivity(captureChildLinkName);
						if (attrs.isLeftnavItem)
							FxpBreadcrumbService.isLeftNavItemClicked = true;
					}
					// $emit targetEventName for subscribed at partners app
					if (item.targetEventName) {
						if (!$event.ctrlKey && !$event.shiftKey)     //Handle ctrl/Shift click for targetEvent
							initiateClickStartTime(item.displayName);
						$rootScope.$emit(item.targetEventName);
						if (attrs.isLeftnavItem)
							FxpBreadcrumbService.isLeftNavItemClicked = true;
					}
				}
			}
			var initiateClickStartTime = function (displayName) {
				$rootScope.startTime = performance.now();
				$rootScope.displayName = displayName;
			}
			element.bind('click', elementClickHandler);

			scope.$on('$destroy', function () {
				element.unbind('click', elementClickHandler);
			});
		}
	}
}

LeftnavLink.fxpLeftnavLinkDirective['$inject'] = ['$state', '$rootScope', 'FxpLoggerService', 'UserInfoService', 'FxpTelemetryContext', 'OBOUserService', 'FxpMessageService', 'FxpBreadcrumbService'];