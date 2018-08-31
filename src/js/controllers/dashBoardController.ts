
/**
 * @application  Fxp
 */
/**
 * @module Fxp.Controllers
 */
declare type IStateService = any;
import { IActOnBehalfOfControllerScope } from "../interfaces/IActOnBehalfOfControllerScope";
import { ILogger } from "../interfaces/ILogger";
import { FxpMessageService } from "../services/FxpMessageService";
import { FxpConstants, ApplicationConstants, CustomEvents } from "../common/ApplicationConstants";
import { OBOUserService } from "../services/OBOUserService";
import { IFxpContext } from "../interfaces/IFxpContext";
import { IRootScope } from "../interfaces/IRootScope";
import { UserProfileService } from "../services/userProfileService";
import { UserInfoService } from "../services/UserInfoService";
import { LogPropertyBag } from "../telemetry/LogPropertyBag";
import { TelemetryContext } from "../telemetry/telemetrycontext";
import { FxpConfigurationService } from "../services/FxpConfiguration";
import { PageLoaderService } from "../services/pageLoaderService";
import { DashboardService } from "../services/dashboardService";
import { CommonUtils } from "../utils/CommonUtils";
import { ActOnBehalfOfHelper } from "../factory/ActOnBehalfOfHelper";
import { ILeftNavControllerScope } from "../interfaces/ILeftNavControllerScope";
import { FxpRouteService } from "../services/FxpRouteService";
import { AdminLandingService } from "../services/AdminLandingService";
import { SettingsServiceProvider } from "../provider/SettingsServiceProvider";
import { FxpContext } from "../context/FxpContext";
import { SettingsType } from "../common/SettingsType";
import { Resiliency } from "../resiliency/FxpResiliency";
import { IDashBoardControllerScope } from "../interfaces/IDashBoardControllerScope";
import { FxpFeedbackService } from "../services/FxpFeedbackService";
import { DashBoardHelper } from "../factory/DashBoardHelper";
import { FxpBroadcastedEvents } from "../services/FxpBroadcastedEvents";
/**
   * A main controller for FxpApp module. This is the controller having basic scopes and events.
   * @class Fxp.Controllers.DashBoardController
   * @classdesc A main controller of FxpApp module
   * @example <caption>
   *  //To Use DashBoardController
   *  angular.module('FxPApp').controller('DashBoardController', ['AnyDependency', DashBoardController]);
   *  function DashBoardController(AnyDependency){ AnyDependency.doSomething(); }
   */
export class DashBoardController {
	private $state: IStateService;

	private $rootScope: IRootScope;
	private $scope: IDashBoardControllerScope;
	private userProfileService: UserProfileService;
	private userInfoService: UserInfoService;
	private adalAuthenticationService: adal.AdalAuthenticationService;
	private fxpLoggerService: ILogger;
	private fxpMessage: FxpMessageService;
	private fxpConstants: FxpConstants;
	private OBOUserService: OBOUserService;
	private fxpContext: IFxpContext;
	private dashBoardHelper: DashBoardHelper;
	private fxpTelemetryContext: TelemetryContext;
	private fxpConfigurationService: FxpConfigurationService;
	private dashboardService: DashboardService;
	private fxpFeedbackService: FxpFeedbackService;
	private fxpErrorMessages: any;
	private leftnavigationdata: any;

	constructor($scope: IDashBoardControllerScope,
		UIStateHelper, $rootScope: IRootScope, fxpLoggerService: ILogger, adalAuthenticationService: adal.AdalAuthenticationService,
		userProfileService: UserProfileService, userInfoService: UserInfoService, fxpMessage: FxpMessageService, OBOUserService: OBOUserService,
		dashBoardHelper: DashBoardHelper, fxpTelemetryContext: TelemetryContext, fxpContextService: IFxpContext, fxpConfigurationService: FxpConfigurationService, dashboardService: DashboardService, fxpFeedbackService: FxpFeedbackService, $state: IStateService) {
		this.$rootScope = $rootScope;
		this.$state = $state;

		this.$scope = $scope;
		this.userProfileService = userProfileService;
		this.userInfoService = userInfoService;
		this.adalAuthenticationService = adalAuthenticationService;
		this.fxpLoggerService = fxpLoggerService;
		this.fxpMessage = fxpMessage;
		this.fxpConstants = FxpConstants;
		this.OBOUserService = OBOUserService;
		this.dashBoardHelper = dashBoardHelper;
		this.fxpErrorMessages = $rootScope.fxpUIConstants.UIMessages;
		this.fxpTelemetryContext = fxpTelemetryContext;
		this.fxpContext = fxpContextService;
		this.dashboardService = dashboardService;
		this.fxpFeedbackService = fxpFeedbackService;
		this.leftnavigationdata = [];
		this.fxpConfigurationService = fxpConfigurationService;
		this.$scope.footerdata = fxpConfigurationService.FxpBaseConfiguration.FxpFooterData;
		this.$scope.oboUIStrings = this.$rootScope.fxpUIConstants.UIStrings.OBOUIStrings;
		this.$scope.OBOUser = {};

		//Initializes value
		var self = this;

		if (window["isFxpConfigFetched"] == false) {
			this.dashboardService.fxpConfigurationFailed();
			return;
		}
 
		this.$scope.closeActOnBehalofUserClick = this.closeActOnBehalofUserClick.bind(this);
		this.$scope.pullFocusToElement = CommonUtils.pullFocusToElement.bind(this);
		this.$scope.onSendUserFeedbackInfo = this.onSendUserFeedbackInfo.bind(this);
		this.$scope.onSendUserFeedbackInfoError = this.onSendUserFeedbackInfoError.bind(this);
		this.$scope.logFooterUsageTelemetryInfo = this.logFooterUsageTelemetryInfo.bind(this);

		if (this.$rootScope.actOnBehalfOfUserActive) {
			this.$rootScope.currentRoutes = this.OBOUserService.getOBOUserRoutes();
			this.$scope.OBOUser.name = this.OBOUserService.getOBOUser().displayName;
			this.$scope.OBOUser.href = this.OBOUserService.getOBOUser().href;
			this.$scope.OBOUser.alias = this.OBOUserService.getOBOUser().alias; 
			if (!$scope.OBOUser.alias) {
				self.fxpMessage.addMessage(self.fxpErrorMessages.OBOUserAliasUndefined.ErrorMessage, FxpConstants.messageType.error);
			}
		}
		else {
			this.$rootScope.currentRoutes = window["loggedInUserConfig"]; // loggedinUserConfig is coming from DashBoard.cshtml
			self.setTenantConfiguration(window["tenantConfiguration"]);
		}
		console.log("Dashboard Fill Routes");
		self.dashBoardHelper.fillRoutes(self.$rootScope.currentRoutes);

		// Feedback
		if (CommonUtils.isNullOrEmpty(self.$rootScope.initialFlags)) {
			let flightHandler = function () {
				self.enableFeedback();
				flightHandlerCleanUp();
			};
			let flightHandlerCleanUp = self.$rootScope.$on(CustomEvents.StartUpFlagRetrieved, flightHandler);
		}
		self.enableFeedback();
		self.$scope.$on(FxpBroadcastedEvents.OnFeedbackContextChanged, function () {
			self.$scope.feedbackContextItem = fxpFeedbackService.getFeedbackPropBagItems();
		});

		self.$scope.$on(FxpBroadcastedEvents.OnFeedbackConfigurationChanged, function () {
			self.$scope.feedbackConfiguration =
				{
					feedbackItemCollection: fxpFeedbackService.getFeedbackItemCollection(),
					feedbackSubscriptionId: fxpFeedbackService.getSubscriprtionId(),
					feedbackServiceEndpoint: fxpFeedbackService.getFeedbackEndpoint()
				}
		});

		this.$rootScope.$watch('actOnBehalfOfUserActive', function (newValue, oldValue) {
			if (newValue !== oldValue) {

				if (newValue == true) {
					self.$rootScope.currentRoutes = self.OBOUserService.getOBOUserRoutes();
					self.$scope.OBOUser.name = self.OBOUserService.getOBOUser().displayName;
					self.$scope.OBOUser.href = self.OBOUserService.getOBOUser().href;
					self.$scope.OBOUser.alias = self.OBOUserService.getOBOUser().alias;
					if (!CommonUtils.isNullOrEmpty(self.OBOUserService.getOBOUserTenantConfiguration())) {
						self.setTenantConfiguration(self.OBOUserService.getOBOUserTenantConfiguration());
					}
					console.log("OBO Routes Filling");
				} else {
					self.OBOUserService.removeOBOUserContext();
					self.$rootScope.currentRoutes = window["loggedInUserConfig"];
					self.setTenantConfiguration(window["tenantConfiguration"]);
					console.log("Logged in Routes Filling");
				}
				self.dashBoardHelper.fillRoutes(self.$rootScope.currentRoutes);
			}

			if (self.$rootScope.initialFlags.feedbackEnabled)
				self.fxpFeedbackService.setUserDetailsToFeedback();
		});
	}

	private enableFeedback(): void {
		var self = this;
		self.$rootScope.initialFlags = self.$rootScope.initialFlags || {};
		if (self.$rootScope.initialFlags && self.$rootScope.initialFlags.feedbackEnabled) {
			try {
				var feedbackItemCollection = typeof self.fxpConfigurationService.FxpBaseConfiguration.FeedbackItemCollection != FxpConstants.CONST.String ? self.fxpConfigurationService.FxpBaseConfiguration.FeedbackItemCollection : JSON.parse(self.fxpConfigurationService.FxpBaseConfiguration.FeedbackItemCollection);
				self.fxpFeedbackService.setFeedbackItemCollection(feedbackItemCollection);
			} catch (e) {
				self.fxpFeedbackService.setFeedbackItemCollection([]);
			}
			self.fxpFeedbackService.setFeedbackEndpoint(self.fxpConfigurationService.FxpAppSettings.FeedbackServiceEndpoint);
			self.fxpFeedbackService.setSubscriprtionId(self.fxpConfigurationService.FxpAppSettings.FeedbackSubscriptionId);
			self.fxpFeedbackService.setUserDetailsToFeedback();
		}
	}

	private setTenantConfiguration(tenantConfig: any): void {
		var self = this;
		self.setUIStrings(tenantConfig.UIStrings);
		self.updateHeaderLogo(tenantConfig.FxpHeaderLogo);
	}

	private setUIStrings(uiStrings: any): void {
		var self = this;
		var uiStringsInternal = self.userInfoService.isActingOnBehalfOf() ? self.filterUIStringsForOBO(uiStrings) : uiStrings;

		angular.forEach(uiStringsInternal, function (value, key) {
			self.$rootScope.fxpUIConstants.UIStrings[key] = value;
		});
	}

	private filterUIStringsForOBO(uiStrings: any): any {
		var self = this;
		var uiStringsInternal = {};

		self.fxpConfigurationService.FxpBaseConfiguration.OBOTenantUIStrings.map(function (item) {
			if (uiStrings[item] !== undefined) {
				uiStringsInternal[item] = uiStrings[item];
			}
		});
		return uiStringsInternal;
	}

	toggleLeftNavExpandedState(): void {
		var self = this;
		self.$rootScope.$broadcast(FxpBroadcastedEvents.OnLeftNavToggleExpandedState);
	}

	onSendUserFeedbackInfoError(feedbackResponse): any {
		var self = this;
		switch (feedbackResponse.tags.Action) {
			case FxpConstants.ActionTypes.Submit:
				self.fxpFeedbackService.logFeedbackInformation(feedbackResponse, "User feedback submission failed", FxpConstants.messageType.error, feedbackResponse.error);
				self.fxpMessage.addMessage(self.$rootScope.fxpUIConstants.UIStrings.FeedbackUIMessages.ErrorMessage, FxpConstants.messageType.error);
				// To pull focus back to Feedback button after closing message
				self.$rootScope.activeElement = $("#feedback-control");
				break;
			case FxpConstants.ActionTypes.Cancel:
				self.fxpFeedbackService.logFeedbackInformation(feedbackResponse, "User feedback cancel failed", FxpConstants.messageType.error, feedbackResponse.error);
				break;
			case FxpConstants.ActionTypes.Click:
				self.fxpFeedbackService.logFeedbackInformation(feedbackResponse, "User feedback click failed", FxpConstants.messageType.error, feedbackResponse.error);
				break;
		}
	}

	onSendUserFeedbackInfo(feedbackResponse): any {
		var self = this;
		switch (feedbackResponse.tags.Action) {
			case FxpConstants.ActionTypes.Submit:
				self.fxpFeedbackService.logFeedbackInformation(feedbackResponse, "User feedback submission success", FxpConstants.messageType.success, null);
				self.fxpMessage.addMessage(self.$rootScope.fxpUIConstants.UIStrings.FeedbackUIMessages.SuccessMessage, FxpConstants.messageType.success, null);
				// To pull focus back to Feedback button after closing message
				self.$rootScope.activeElement = $("#feedback-control");
				break;
			case FxpConstants.ActionTypes.Cancel:
				self.fxpFeedbackService.logFeedbackInformation(feedbackResponse, "User feedback cancel success", FxpConstants.messageType.success, null);
				break;
			case FxpConstants.ActionTypes.Click:
				self.fxpFeedbackService.logFeedbackInformation(feedbackResponse, "User feedback click success", FxpConstants.messageType.success, null);
				break;
		}
	}

	closeActOnBehalofUserClick(): void {
		var self = this;

		var propbag = self.fxpLoggerService.createPropertyBag();
		try {
			self.fxpLoggerService.logTrace('Fxp.closeactOnBehalfofuser', "close actOnBehalfOfUser Started");
			self.userProfileService.setCurrentUser(self.userInfoService.getLoggedInUser());
			let userClaimsSessionKey=FxpConstants.CONST.fxpUserClaimsSession + "_" + self.OBOUserService.getOBOUser().alias;
			let adminDataSessionKey=FxpConstants.CONST.fxpUserClaimsSession + "_" + self.OBOUserService.getOBOUser().alias;
			sessionStorage.removeItem(userClaimsSessionKey);
			sessionStorage.removeItem(adminDataSessionKey);

			self.OBOUserService.removeOBOUserContext();
			//when obo user session closed
			self.$rootScope.$broadcast(FxpBroadcastedEvents.OnUserContextChanged, self.userInfoService.getCurrentUser(), self.userInfoService.getCurrentUserData().roleGroupId, self.userInfoService.getCurrentUserData().businessRoleId);
			//Telemetry
			var oboUserEndTime = new Date().getTime().toString();
			propbag.addToBag(FxpConstants.OBOConstants.ActonBehalfofAdminEndTime, oboUserEndTime);
			var startTime = localStorage.getItem(FxpConstants.OBOConstants.ActonBehalfofAdminStartTime.toString());
			var responseTime = (parseInt(oboUserEndTime) - parseInt(startTime));
			var oboUserMetric = self.fxpLoggerService.createMetricBag();
			oboUserMetric.addToBag(FxpConstants.OBOConstants.AdminActOnBehaflOfDuratoin, responseTime);
			self.fxpLoggerService.logEvent("Fxp.closeActOnBehalfofUser", 'AdminOnBehalfOfEnd', propbag, oboUserMetric);
			//Remove global properties
			self.fxpTelemetryContext.removeFromGlobalPropertyBag(FxpConstants.OBOConstants.OnBehalfOfUserUpn);
			self.fxpTelemetryContext.removeFromGlobalPropertyBag(FxpConstants.OBOConstants.ActonBehalfMode);
			self.fxpTelemetryContext.removeFromGlobalPropertyBag(FxpConstants.OBOConstants.OnBehalfOfUserBusinessRoleId);
			self.fxpTelemetryContext.removeFromGlobalPropertyBag(FxpConstants.OBOConstants.OnBehalfOfUserBusinessRole);
			self.fxpLoggerService.setOBOUserContext(null, null, self.userProfileService.isObo(), null, null);
			self.fxpLoggerService.logTrace('Fxp.closeActOnBehalfofUser', "closeactOnBehalfofuser end");
			if (self.$rootScope.initialFlags.feedbackEnabled)
				self.fxpFeedbackService.setUserDetailsToFeedback();
		}
		catch (e) {
			propbag.addToBag("OBOCloseError", e);
			self.fxpMessage.addMessage(self.$rootScope.fxpUIConstants.UIMessages.GeneralExceptionError.ErrorMessage, FxpConstants.messageType.error);
			self.fxpLoggerService.logError('Fxp.closeActOnBehalfofUser', self.$rootScope.fxpUIConstants.UIMessages.GeneralExceptionError.ErrorMessage, "", null, propbag);
		}
	}

	logFooterUsageTelemetryInfo(footerItem: any): void {
		var self = this, propBag;

		propBag = self.fxpLoggerService.createPropertyBag();
		propBag.addToBag(FxpConstants.metricConstants.FooterLinkUrl, footerItem.href);
		propBag.addToBag(FxpConstants.metricConstants.FooterLinkName, footerItem.DisplayText);
		self.fxpLoggerService.logInformation("Fxp.Footer", "Fxp.FooterLinkClick", propBag);
	}
	

	private updateHeaderLogo(headerLogo: any): void {
		var self = this;
		if (CommonUtils.isNullOrEmpty(headerLogo)) {
			self.$scope.headerLogo = self.fxpConfigurationService.FxpBaseConfiguration.FxpHeaderLogo;
		}
		else {
			self.$scope.headerLogo = headerLogo;
		}
	}

}