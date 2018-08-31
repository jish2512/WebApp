
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
import { FxpStateTransitionService } from "../services/FxpStateTransitionService";
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
import { IAppControllerScope } from "../interfaces/IAppControllerScope";
import { FxpBreadcrumbService } from "../services/FxpBreadcrumbService";
import { pageTourEventService } from "../services/pageTourEventService";
import { FxpBotService } from "../provider/FxpBotServiceProvider";
import { PlannedDownTimeService } from "../services/PlannedDownTimeService";
import { FxpUIData } from "../factory/FxpUIDataFactory";
import { AppControllerHelper } from "../factory/AppControllerHelper";
import { SessionTimeoutModalFactory } from "../factory/SessionTimeoutModalFactory";
import { FxpBroadcastedEvents } from "../services/FxpBroadcastedEvents";

//import { AngularDirective } from "../../decorators";
declare type FeatureFlagService = any;

/**
    * A main controller for FxpApp module. This is the controller having basic models and events.
    * @class Fxp.Controllers.AppController
    * @classdesc A main controller of FxpApp module
    * @example <caption>
    *  //To Use AppController
    *  angular.module('FxPApp').controller('AppController', ['AnyDependency', AppController]);
    *  function AppController(AnyDependency){ AnyDependency.doSomething(); }
    */
//@AngularDirective("appcontroller", AppController,  "FxpApp", ['$rootScope', '$scope', '$location', '$state', 'FxpUIData', 'FxpLoggerService', 'UserProfileService', 'adalAuthenticationService', 'PageLoaderService', 'AppControllerHelper', 'DeviceFactory', 'FxpConfigurationService', 'FxpBreadcrumbService', 'FxpMessageService', 'FxpBotService', '$window', 'FeatureFlagService', 'StartUpFlightConfig', 'PlannedDownTimeService', 'SessionTimeoutModalFactory', 'PageTourEventService'])  
export class AppController {
	private $rootScope: IRootScope;
	private $scope: IAppControllerScope;
	private $state: IStateService;
	private $location: angular.ILocationService;
	private fxpUIData: FxpUIData;
	private fxpLogger: ILogger;
	private fxpConstants: FxpConstants;
	private userProfileService: UserProfileService;
	private adalAuthenticationService: adal.AdalAuthenticationService;
	private pageLoaderService: PageLoaderService;
	private appControllerHelper: AppControllerHelper;
	private fxpConfigurationService: FxpConfigurationService;
	private fxpBreadcrumbService: FxpBreadcrumbService;
	private fxpMessage: FxpMessageService;
	private sessionTimeOutModalFactory: SessionTimeoutModalFactory;
	private device: any;
	private pageLoadThreshold: any;
	private stateSuccessTime: any;

	constructor($rootScope: IRootScope, $scope: IAppControllerScope, $location: angular.ILocationService, $state: IStateService, fxpUIData: FxpUIData, fxpLoggerService: ILogger, userProfileService: UserProfileService, adalAuthenticationService: adal.AdalAuthenticationService,
		pageLoaderService: PageLoaderService, appControllerHelper: AppControllerHelper, deviceFactory: any, fxpConfigurationService: FxpConfigurationService, fxpBreadcrumbService: FxpBreadcrumbService, fxpMessage: FxpMessageService, fxpBotService: FxpBotService, $window: angular.IWindowService, private featureFlagService: FeatureFlagService, private startUpFlightConfig: any, private plannedDownTimeService: PlannedDownTimeService, private sessionTimeoutModalFactory: SessionTimeoutModalFactory,
		private pageTourEventService: pageTourEventService, private fxpStateTransitionService: FxpStateTransitionService
	) {
		this.$rootScope = $rootScope;
		this.$rootScope.showLoader = true;
		this.$rootScope.isHelpOpen = false;
		this.$scope = $scope;
		this.$state = $state;
		this.device = deviceFactory;
		this.$location = $location;
		this.fxpUIData = fxpUIData;
		this.fxpLogger = fxpLoggerService;
		this.fxpConstants = FxpConstants;
		this.userProfileService = userProfileService;
		this.adalAuthenticationService = adalAuthenticationService;
		this.pageLoaderService = pageLoaderService;
		this.fxpBreadcrumbService = fxpBreadcrumbService;
		this.appControllerHelper = appControllerHelper;
		this.fxpMessage = fxpMessage;
		this.pageLoadThreshold = (parseFloat(fxpConfigurationService.FxpAppSettings.PageLoadDurationThreshold));
		this.sessionTimeOutModalFactory = sessionTimeoutModalFactory;
		this.pageTourEventService = pageTourEventService;
		//ENUM to represent the last route transition status.
		var pageTransitionState = {
			stateNotFound: "stateNotFound",
			stateChangeError: "stateChangeError",
			stateChangeSuccess: "stateChangeSuccess",
			viewContentLoading: "viewContentLoading",
			viewContentLoaded: "viewContentLoaded"
		};

		//Holds the last route load metrics and details
		$rootScope.$on("resetPageLoadMetrics", function (evt) {
			$rootScope.pageLoadMetrics = {
				"sourceRoute": "",
				"destinationRoute": "",    //Holds the route name.
				"pageTransitionStatus": "",   //holds the page transition end state from the pageTransitionState enumeration.
				"stateChangeDuration": 0, //Duration taken within state change events.
				"viewLoadDuration": 0,//Duration taken within view content loading events.
				"preViewLoadingDuration": 0,
				"pageLoadError": "",
				"pageLoadDuration": 0,
				"totalDuration": 0,
				"preStateDuration": 0,
				"pageDisplayName": "",
				"startTime": 0,
				"threshold": {
					"thresholdCrossed": false,
					"thresholdValue": 0
				}
			};
		});

		// Intialization of scopes and rootscopes

		this.$scope.fxpheaderdata = {
			"ElementType": "span",
			"DisplayText": "",
			"Name": "",
			"Email": "",
			"Role": ""
		};

		// custom scroll config
		this.$scope.leftNavConfig = {
			theme: 'dark',
			axis: 'y',
			scrollButtons: {
				enable: false
			},
			keyboard: { scrollAmount: 5 }
		}
		this.$rootScope.isFullScreen = false;
		// it contains ui string of view full profile text
		this.$scope.ViewFullProfile = this.$rootScope.fxpUIConstants.UIStrings.ViewFullProfile;
		this.$scope.renderHeaderForClick = this.renderHeaderForClick.bind(this);
		this.$scope.renderHeaderForKeydown = this.renderHeaderForKeydown.bind(this);
		this.$scope.renderHeaderForFocusout = this.renderHeaderForFocusout.bind(this);
		this.$scope.renderHeaderMenuForKeydown = this.renderHeaderMenuForKeydown.bind(this);
		this.$scope.renderSideBarForKeydown = this.renderSideBarForKeydown.bind(this);
		this.$scope.onMessageKeyDown = this.onMessageKeyDown.bind(this);
		this.$scope.OnNavigationClick = this.onNavigationClick.bind(this);
		this.$scope.OnNavigationClickWithParams = this.onNavigationClickWithParams.bind(this);
		this.$scope.getPageLoadPropertyBag = this.getPageLoadPropertyBag.bind(this);
		this.$scope.logMiniProfileTelemetryInfo = this.logMiniProfileTelemetryInfo.bind(this);


		this.$scope.showViewFullProfileLink = window["tenantConfiguration"].ShowFullProfile;
		this.$scope.viewProfileUrl = window["tenantConfiguration"].ViewProfileUrl;

		let handler = this.$rootScope.$on('leftNavHighlighted', this.onLeftNavHighlighted.bind(this));
		let flightHandler = $rootScope.$on(CustomEvents.StartUpFlagRetrieved, this.initialFlagsResponseHandler.bind(this));
		this.$scope.$on('destroy', this.unregisterEvents);

		var self = this;

		this.$scope.$on(FxpBroadcastedEvents.OnAppHeaderChanged, function (event, headerText) {
			self.$scope.fxpheaderdata.DisplayText = headerText;
		});

		this.$scope.$on(FxpBroadcastedEvents.OnPageTitleChanged, function (event, pageTitle) {
			self.$scope.pageTitle = pageTitle;
		});

		this.fxpStateTransitionService.onStateNotFound(item => {
			console.log('Fired UI-Router StateNotFound event. UnfoundState: ' + item.toState._identifier + " from state :" + item.fromState._identifier.name);
			$rootScope.pageLoadMetrics.pageTransitionStatus = pageTransitionState.stateNotFound;
			var stateDuration = performance.now();
			var finalDuration = stateDuration - $rootScope.startTime;
			$rootScope.pageLoadMetrics.stateChangeDuration = finalDuration;
			$rootScope.pageLoadMetrics.pageLoadError = "The State you were navigating to was not found";
			var propBag = self.getPageLoadPropertyBag($rootScope.pageLoadMetrics);
			self.fxpLogger.logError("Fxp.stateNotFound", "The State you were navigating to was not found", "2908", null, propBag);
			self.fxpLogger.setPageLoadMetrics($rootScope.pageLoadMetrics);
			$rootScope.startTime = 0;
		});

		this.fxpStateTransitionService.onStateChangeFailure(item => {
			console.log('Fired UI-Router onStateChangeFailure error. toState: ' + item.toState.name + " from state :" + item.fromState.name);
			if (item.fromState.name) {
				$rootScope.pageLoadMetrics.pageTransitionStatus = pageTransitionState.stateChangeError;
				var msg;
				var stateDuration = performance.now();
				var finalDuration = stateDuration - $rootScope.startTime;
				$rootScope.pageLoadMetrics.stateChangeDuration = finalDuration;
				msg = self.$rootScope.fxpUIConstants.UIMessages.StateChangeErrorException.ErrorMessageTitle.replace('{0}', item.toState.name);
				$rootScope.pageLoadMetrics.pageLoadError = msg;
				self.fxpMessage.addMessage(msg, FxpConstants.messageType.error);
				var propBag = self.getPageLoadPropertyBag($rootScope.pageLoadMetrics);
				let error = (item && item.error) ? JSON.stringify(item.error) : "";
				self.fxpLogger.logError("Fxp.stateChangeError", msg, "2909", error, propBag);
				self.fxpLogger.setPageLoadMetrics($rootScope.pageLoadMetrics);
				$rootScope.startTime = 0;
			}
		});

		this.$scope.$on('$viewContentLoaded', function (event) {
			console.log('Fired UI-Router $viewContentLoaded event.');
			var viewContentDuration = performance.now();
			$rootScope.pageLoadMetrics.pageTransitionStatus = pageTransitionState.viewContentLoaded;
			self.fxpBreadcrumbService.logBreadcrumbTelemetryInfo(FxpConstants.BreadcrumbEventType.BreadcrumbLoad, null);

			if (!CommonUtils.isNullOrEmpty($rootScope.pageLoadMetrics.sourceRoute)) {

				if ($rootScope.pageLoadMetrics.startTime == 0) {
					$rootScope.pageLoadMetrics.startTime = self.getStartTime();
				}

				var totalDuration = viewContentDuration - $rootScope.pageLoadMetrics.startTime;
				self.checkIfThresholdCrossed(totalDuration);
			}

			self.fxpLogger.setPageLoadMetrics($rootScope.pageLoadMetrics);
			$rootScope.startTime = 0;
		});

		this.fxpStateTransitionService.onStateChangeSuccess(item => {
			console.log('Fired UI-Router onStateChangeSuccess event. To State: ' + item.toState + ' from State: ' + item.fromState);
			self.stateSuccessTime = performance.now();
			var finalDuration = self.stateSuccessTime - $rootScope.stateChangeStartTime;
			// Setting app header.
			self.fxpUIData.setAppHeaderFromRoute(item.toState);
			// Setting pagetitle.
			self.fxpUIData.setPageTitleFromRoute(item.toState);
			//logging from here
			$rootScope.pageLoadMetrics.pageTransitionStatus = pageTransitionState.stateChangeSuccess;
			$rootScope.pageLoadMetrics.stateChangeDuration = finalDuration;

			$rootScope.isFullScreenEnabled = item.toParams ? item.toParams.fullScreenEnabled || false : false;
			if (!$rootScope.isFullScreenEnabled)
				$rootScope.isFullScreen = false;
			if (CommonUtils.isNullOrEmpty(self.$rootScope.initialFlags)) {
				let flightHandler = function () {
					self.renderBreadcrumb(item.toState);
					flightHandlerCleanUp();
				};
				let flightHandlerCleanUp = self.$rootScope.$on(CustomEvents.StartUpFlagRetrieved, flightHandler);
			}
			self.renderBreadcrumb(item.toState);
		});

		$rootScope.$on('$viewContentLoading',
			function (event, viewConfig) {
				console.log('Fired $viewContentLoading event. ');
			});

		this.$scope.userThumbnailPhoto = "/assets/pictures/User.png";
		this.$rootScope.getLandingPage = this.getLandingPage.bind(this);
		this.$rootScope.navigateToLandingPage = this.navigateToLandingPage.bind(this);
		if (!this.adalAuthenticationService.userInfo.isAuthenticated) {
			this.$rootScope.$on('adal:loginSuccess', onLoginSuccess);
		}
		else {
			onLoginSuccess();
		}

		function onLoginSuccess() {
			self.fxpLogger.logInformation("Fxp.AppController", "onLoginSuccess started in appCtrl");
			self.pageLoaderService.fnShowPageLoader($rootScope.fxpUIConstants.UIStrings.LoadingStrings.LoadingProfile, appControllerHelper.handleAdalErrorsLoadingProfile);
			self.appControllerHelper.getBasicProfile($scope);
			self.appControllerHelper.postLoginSuccess();
		}
		//Handle skype bot link
		$rootScope.$on(CustomEvents.SkypeBotInit,
			function (e, url, target) {
				fxpBotService.setUserContext().then(function (response) {
					$window.open(url, target);
					self.fxpLogger.logInformation("Chat Bot response : " + response.data, "SkypeBotInit");
				}, function (error) {
					self.fxpMessage.addMessage($rootScope.fxpUIConstants.UIMessages.FxpBotSetContextFailedError.ErrorMessage, FxpConstants.messageType.error);
					//Handling data undefined
					error.data = error.data || "";
					//TODO replace error code
					self.fxpLogger.logError("Call to Bot Service failed -" + error.data, "SkypeBotInit", "2911", null);
				});
			});
	}

	/**
	*an internal method to populate propertyBag values.
	*/
	getPageLoadPropertyBag = function (pageLoadData: any) {
		var self = this, propBag;
		propBag = self.fxpLogger.createPropertyBag();
		propBag.addToBag("sourceRoute", pageLoadData.sourceRoute);
		propBag.addToBag("pageDisplayName", pageLoadData.pageDisplayName);
		propBag.addToBag("destinationRoute", pageLoadData.destinationRoute);
		propBag.addToBag("pageTransitionStatus", pageLoadData.pageTransitionStatus);
		propBag.addToBag("stateChangeDuration", (pageLoadData.stateChangeDuration).toString());
		propBag.addToBag("error", pageLoadData.pageLoadError);
		propBag.addToBag("partnerPageLoadDuration", (pageLoadData.pageLoadDuration).toString());
		propBag.addToBag("totalDuration", (pageLoadData.totalDuration).toString());
		propBag.addToBag("preStateDuration", (pageLoadData.preStateDuration).toString());
		propBag.addToBag("thresholdCrossed", (pageLoadData.threshold.thresholdCrossed).toString());
		propBag.addToBag("thresholdValue", (pageLoadData.threshold.thresholdValue).toString());
		return propBag;
	}
	/**
	*an internal method to check EnableBreadcrumb status on success calls breadcrumbservice
	*/
	renderBreadcrumb = function (toState) {
		var self = this;
		if (self.$rootScope.initialFlags && self.$rootScope.initialFlags.breadcrumbEnabled) {
			self.fxpBreadcrumbService.setBreadcrumbFromRoute(toState);
		}
	}
	/**
	* An event handler whenever header is clicked.
	* @method Fxp.Controllers.AppController.renderHeaderForClick
	* @param {Event} $event An event object which is passed from the view.
	* @example <caption> Example to use renderHeaderForClick</caption>
	*  <div ng-app="AppController"><div ng-click="renderHeaderForClick">Render header</div></div>;
	*  <div ng-app="AppController as app"><div ng-click="app.renderHeaderForClick">Render header</div></div>;
	*/
	renderHeaderForClick = function ($event) {
		$(".helpflyoutmenu ul.dropdown-menu").animate({ scrollTop: 0 }, "fast");
		var target = $($event.target);

		if (target.parent().hasClass("open")) {
			target.parent().removeClass("open");
			target.attr("aria-expanded", "false");
		} else {
			target.parent().addClass("open");
			target.attr("aria-expanded", "true");
		}

		if ($event.screenX != 0 && $event.screenY != 0)
			target.addClass("focus-removed");
	};

	/**
	* An event handler whenever header is clicked.
	* @method Fxp.Controllers.AppController.renderHeaderForKeydown
	* @param {Event} $event An event object which is passed from the view.
	* @example <caption> Example to use renderHeaderForKeydown</caption>
	*  <div ng-app="AppController"><div ng-keydown="renderHeaderForKeydown">Render header</div></div>;
	*  <div ng-app="AppController as app"><div ng-keydown="app.renderHeaderForKeydown">Render header</div></div>;
	*/
	renderHeaderForKeydown = function ($event) {
		var target = $($event.target);
		if ($event.key == "Tab" && $event.shiftKey) {
			target.parent().removeClass("open");
			target.attr("aria-expanded", "false");
		} else if ($event.key == "Down" && target.parent().hasClass("open")) {
			var menuItems = target.parent().find("[uib-dropdown-menu] li a");
			menuItems[0].focus();
		}
	};

	/**
	* An event handler whenever focus is lost from header.
	* @method Fxp.Controllers.AppController.renderHeaderForFocusout
	* @param {Event} $event An event object which is passed from the view.
	* @example <caption> Example to use renderHeaderForFocusout</caption>
	*  <div ng-app="AppController"><div ng-blur="renderHeaderForFocusout">Focus out header</div></div>;
	*  <div ng-app="AppController as app"><div ng-blur="app.renderHeaderForFocusout">Focus out header</div></div>;
	*/
	renderHeaderForFocusout = function ($event) {
		var target = $($event.target);
		target.removeClass("focus-removed");
	}

	/**
	* An event handler whenever a key is pressed on header menu.
	* @method Fxp.Controllers.AppController.renderHeaderMenuForKeydown
	* @param {Event} $event An event object which is passed from the view.
	* @example <caption> Example to use renderHeaderMenuForKeydown</caption>
	*  <div ng-app="AppController"><div ng-keydown="renderHeaderMenuForKeydown">Render header menu</div></div>;
	*  <div ng-app="AppController as app"><div ng-keydown="app.renderHeaderMenuForKeydown">Render header menu</div></div>;
	*/
	renderHeaderMenuForKeydown = function ($event) {
		var targetMenu = $($event.target).closest("[uib-dropdown-menu]"),
			targetMenuToggleBtnId = targetMenu.attr("aria-labelledby"),
			targetMenuToggleBtn = $("#" + targetMenuToggleBtnId),
			allMenuItems = targetMenu.find("li a"),
			currentMenuItemIndex = allMenuItems.index($event.target);

		if ($event.keyCode == this.fxpConstants.keyCodes.escapeKey) {
			targetMenuToggleBtn.focus();
			if (targetMenuToggleBtnId.indexOf("Fxpdashboard_LeftNavItem") != -1) {
				targetMenu.parent().removeClass("open");
				targetMenuToggleBtn.attr("aria-expanded", "false");
			}
		} else if ($event.keyCode == this.fxpConstants.keyCodes.tabKey && !$event.shiftKey && currentMenuItemIndex == (allMenuItems.length - 1)) {
			targetMenuToggleBtn.focus();
			targetMenu.parent().removeClass("open");
			targetMenuToggleBtn.attr("aria-expanded", "false");
		} else if ($event.keyCode == this.fxpConstants.keyCodes.tabKey && $event.shiftKey && currentMenuItemIndex == 0) {
			$event.preventDefault();
			$event.stopPropagation();
			targetMenuToggleBtn.focus();
		} else if ($event.keyCode == this.fxpConstants.keyCodes.arrowDownKey) {
			$event.preventDefault();
			$event.stopPropagation();
			if (currentMenuItemIndex < (allMenuItems.length - 1)) {
				allMenuItems[currentMenuItemIndex + 1].focus();
			}
			else {
				allMenuItems[0].focus();
			}
		} else if ($event.keyCode == this.fxpConstants.keyCodes.arrowUpKey) {
			$event.preventDefault();
			$event.stopPropagation();
			if (currentMenuItemIndex > 0) {
				allMenuItems[currentMenuItemIndex - 1].focus();
			}
			else {
				allMenuItems[allMenuItems.length - 1].focus();
			}
		}
	};

	/**
	* An event handler whenever header is clicked.
	* @method Fxp.Controllers.AppController.renderHeaderForKeydown
	* @param {Event} $event An event object which is passed from the view.
	* @example <caption> Example to use renderHeaderForKeydown</caption>
	*  <div ng-app="AppController"><div ng-keydown="renderHeaderForKeydown">Render header</div></div>;
	*  <div ng-app="AppController as app"><div ng-keydown="app.renderHeaderForKeydown">Render header</div></div>;
	*/
	renderSideBarForKeydown = function ($event) {
		var target = $($event.target),
			currentIndex = $(".left-nav-menu").index(target.parent()),
			previousItem = currentIndex ? $(".left-nav-menu")[currentIndex - 1] : null,
			previousItemId = previousItem ? $(previousItem).find("a")[0].id : "";
		if (($event.key == "Down" || ($event.key == "Tab" && !$event.shiftKey)) && target.parent().hasClass("open")) {
			var menuItems: any = document.querySelectorAll("[aria-labelledby=" + target[0].id + "] li a");
			$event.preventDefault();
			$event.stopPropagation();
			menuItems[0].focus();
		} else if ($event.key == "Tab" && $event.shiftKey && previousItem && $(previousItem).hasClass("open")) {
			var menuItems: any = document.querySelectorAll("[aria-labelledby=" + previousItemId + "] li a");
			$event.preventDefault();
			$event.stopPropagation();
			menuItems[menuItems.length - 1].focus();
		}
	};
	/**
	* An event handler whenever a key is pressed on Message.
	* @method Fxp.Controllers.AppController.onMessageKeyDown
	* @param {Event} $event An event object which is passed from the view.
	* @example <caption> Example to use onMessageKeyDown</caption>
	*  <div ng-app="AppController"><div ng-keydown="onMessageKeyDown">Fxp Message</div></div>;
	*  <div ng-app="AppController as app"><div ng-keydown="app.onMessageKeyDown">Focus out</div></div>;
	*/
	onMessageKeyDown = function ($event) {
		if ($event.key == "Tab") {
			var targetMessage = $($event.target).closest(".message"),
				allMessages = $(".message"),
				currentMessageIndex = allMessages.index(targetMessage),
				targetType = $event.target.tagName.toLowerCase(),
				isFirstMessageFocused = (currentMessageIndex == 0 && targetType == 'div') ? true : false,
				isLastMessageFocused = (currentMessageIndex == (allMessages.length - 1) && targetType == 'button') ? true : false,
				isForwardNavigation = !$event.shiftKey,
				isBackwardNavigation = $event.shiftKey,
				elementToFocus = undefined;
			if (isForwardNavigation && isLastMessageFocused) {
				$event.preventDefault();
				$event.stopPropagation();
				elementToFocus = $(allMessages[0]).find('.message-content').focus();
			} else if (isBackwardNavigation && isFirstMessageFocused) {
				$event.preventDefault();
				$event.stopPropagation();
				elementToFocus = $(allMessages[allMessages.length - 1]).find('button').focus();
			}
		}
	}

	/**
	* A click handler when a navigation button is clicked.
	* @method Fxp.Controllers.AppController.onNavigationClick
	* @param {object} menuItem An object which is passed from the view.
	* @example <caption> Example to use onNavigationClick</caption>
	*  <div ng-app="AppController"><div fxp-click="onNavigationClick(item)">Navigation Button</div></div>;
	*  <div ng-app="AppController as app"><div fxp-click="app.onNavigationClick(item)">Navigation Button</div></div>;
	*/
	onNavigationClick = function (menuItem) {
		this.$state.go(menuItem);
	};

	/**
	* A click handler when a navigation button is clicked.
	* @method Fxp.Controllers.AppController.onNavigationClickWithParams
	* @param {object} menuItem An object which is passed from the view.
	* @example <caption> Example to use onNavigationClickWithParams</caption>
	*  <div ng-app="AppController"><div fxp-click="onNavigationClickWithParams(item, params)">Navigation Button</div></div>;
	*  <div ng-app="AppController as app"><div fxp-click="app.onNavigationClickWithParams(item, params)">Navigation Button</div></div>;
	*/

	onNavigationClickWithParams = function (menuItem, params) {
		this.$state.go(menuItem, JSON.parse(JSON.stringify(eval("(" + params + ")"))));
	};
	/**
	* An method to get the default landing page.
	* @method Fxp.Controllers.AppController.getLandingPage
	* @example <caption> Example to use getLandingPage</caption>
	*  <div ng-app="AppController"><div ng-click="getLandingPage">Get Landing Page</div></div>;
	*  <div ng-app="AppController as app"><div ng-click="app.getLandingPage">getLandingPage</div></div>;
	*/
	getLandingPage = function () {
		if (this.$state.get('DashBoard')) {
			return this.$state.href("DashBoard", {}, { absolute: true })
		}
		else {
			return this.$state.href(this.$state.get()[1].name, {}, { absolute: true })
		}
	};

	/**
	* A method to navigate to landing page.
	* @method Fxp.Controllers.AppController.navigateToLandingPage
	* @example <caption> Example to use navigateToLandingPage</caption>
	*  <div ng-app="AppController"><div ng-click="navigateToLandingPage">Navigate to landing page</div></div>;
	*  <div ng-app="AppController as app"><div ng-click="app.navigateToLandingPage">Navigate to landing page</div></div>;
	*/
	navigateToLandingPage = function () {

		var landingState = this.$state.get('Dashboard');
		if (CommonUtils.isNullOrEmpty(landingState)) {
			landingState = this.$rootScope.configRouteStates[0]
		}
		this.logHeaderClickTelemetryInfo(landingState);
		return this.$state.go(landingState);
	};

	onLeftNavHighlighted = function (event, item) {
		this.plannedDownTimeService.currentLeftNavItem = item;
		this.$rootScope.currentLeftNavItem = item;
		//prevent undefined issue
		this.$rootScope.initialFlags = this.$rootScope.initialFlags || {};

		if (this.$rootScope.initialFlags.flashEnabled)
			this.plannedDownTimeService.updateFlash();
	};

	initialFlagsResponseHandler = function () {
		//prevent undefined issue
		this.$rootScope.initialFlags = this.$rootScope.initialFlags || {};

		if (this.$rootScope.initialFlags.flashEnabled)
			this.plannedDownTimeService.pollForPlannedDownTimesandUpdateFlash();

		if (this.$rootScope.initialFlags.sessionTimeOutEnabled)
			this.sessionTimeoutModalFactory.init();

		if (this.$rootScope.initialFlags.pageTourEnabled)
			this.pageTourEventService.init();
	}

	unregisterEvents = function () {
		this.handler();
		this.flightHandler();
	}

	logHeaderClickTelemetryInfo(state: any): void {
		var self = this, propBag;
		propBag = self.fxpLogger.createPropertyBag();
		propBag.addToBag(FxpConstants.metricConstants.HeaderClickNavigatedStateName, state.name);
		propBag.addToBag(FxpConstants.metricConstants.HeaderClickNavigatedStateTemplateURL, state.templateUrl);
		self.fxpLogger.logEvent("Fxp.Header", "Fxp.HeaderClick", propBag);
	}
	/**
	* An event handler to log Telemetry when mini profile icon is clicked.
	* @method Fxp.Controllers.AppController.logMiniProfileTelemetryInfo
	* @param {string} action action to decide whether it is profile icon click or view full profile click.
	* @param {boolean} isModalOpen flag to decide if uib dropdown is open or closed.
	*/
	logMiniProfileTelemetryInfo(action: string, isModalOpen: boolean): void {
		if (isModalOpen) {
			var self = this, propBag;
			propBag = self.fxpLogger.createPropertyBag();
			if (action == "ProfileIconClick")
				propBag.addToBag(FxpConstants.metricConstants.MiniProfileIconClick, "Yes");
			else
				propBag.addToBag(FxpConstants.metricConstants.ViewFullProfileClick, "Yes");
			self.fxpLogger.logEvent("Fxp.ProfileClick", "Fxp.MiniProfileClick", propBag);
		}
	}

	restore() {
		this.$rootScope.isFullScreen = false;
	}
	maximize() {
		this.$rootScope.isFullScreen = true;
	}
	getStartTime() {

		this.$rootScope.pageLoadMetrics.stateChangeStartTime = this.$rootScope.stateChangeStartTime;
		this.$rootScope.pageLoadMetrics.rootscopestartTime = this.$rootScope.startTime;

		if (this.$rootScope.startTime != undefined && this.$rootScope.startTime != 0)
			return this.$rootScope.startTime;

		return this.$rootScope.stateChangeStartTime;
	}

	checkIfThresholdCrossed(totalDuration) {

		if (totalDuration >= (this.pageLoadThreshold) * 1000
			&& !(this.$rootScope.pageLoadMetrics.threshold.thresholdCrossed)) {
			var msg, propBag;
			msg = "Threshold value of " + this.pageLoadThreshold + " second(s) crossed";
			this.$rootScope.pageLoadMetrics.threshold.thresholdCrossed = true;
			this.$rootScope.pageLoadMetrics.threshold.thresholdValue = this.pageLoadThreshold;
			this.$rootScope.pageLoadMetrics.pageLoadError = msg;

			propBag = this.$scope.getPageLoadPropertyBag(this.$rootScope.pageLoadMetrics);
			propBag.addToBag("viewContentLoadDuration", (totalDuration).toString());

			this.fxpLogger.logError("Fxp.viewContentLoaded", msg, "2910", null, propBag);
		}
	}
}

AppController.$inject = ['$rootScope', '$scope', '$location', '$state', 'FxpUIData', 'FxpLoggerService', 'UserProfileService', 'adalAuthenticationService', 'PageLoaderService', 'AppControllerHelper', 'DeviceFactory', 'FxpConfigurationService', 'FxpBreadcrumbService', 'FxpMessageService', 'FxpBotService', '$window', 'FeatureFlagService', 'StartUpFlightConfig', 'PlannedDownTimeService', 'SessionTimeoutModalFactory', 'PageTourEventService', 'FxpStateTransitionService'];