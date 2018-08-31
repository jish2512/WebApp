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
import { FxpConstants, ApplicationConstants } from "../common/ApplicationConstants";
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
import { UserClaimsService } from "../services/UserClaimsService";
import { FxpBroadcastedEvents } from "../services/FxpBroadcastedEvents";

/**
   * This is the controller to fetch and update the leftnav data .
   * @class Fxp.Controllers.LeftNavController
   * @classdesc A main controller for leftnav of FxpApp module
   * @example <caption>
   *  //To Use LeftNavController
   *  angular.module('FxPApp').controller('LeftNavController', ['AnyDependency', LeftNavController]);
   *  function LeftNavController(AnyDependency){ AnyDependency.doSomething(); }
   */
export class LeftNavController {
	private $rootScope: IRootScope;
	private $scope: ILeftNavControllerScope;
	private $state: IStateService;
	private timeout;
	private dashboardService: DashboardService;
	private adminLandingService: AdminLandingService;
	private fxpLoggerService: ILogger;
	private userInfoService: UserInfoService;
	private fxpMessage: FxpMessageService;
	private fxpRouteService: FxpRouteService;
	private fxpConfigurationService: FxpConfigurationService;
	private loggedInUserLeftNavData: any;
	private oboUserLeftNavData: any;
	private window;
	private isNavLinkFocused: any;
	private deviceFactory: any;
	private currentUserDefaultState = "";
	private userProfileService: UserProfileService;
	private settingsService: SettingsServiceProvider;
	private fxpContext: FxpContext;
	private fxpTelemetryContext: TelemetryContext;
	private deviceDetector: any;
	private $q: angular.IQService; 

	constructor($rootScope: IRootScope, $q: angular.IQService,
		$scope: ILeftNavControllerScope,
		$state: IStateService,
		$timeout,
		dashboardService: DashboardService, fxpLoggerService: ILogger, userInfoService: UserInfoService, fxpMessage: FxpMessageService, $window, $document, deviceFactory: any, fxpRouteService: FxpRouteService,
		fxpConfigurationService: FxpConfigurationService, userProfileService: UserProfileService, settingsService: SettingsServiceProvider, fxpContext: FxpContext, fxpTelemetryContext: TelemetryContext, deviceDetector: any,
		adminLandingService: AdminLandingService,private userClaimsService: UserClaimsService, private $base64: any) {
		var self = this;
		self.$rootScope = $rootScope;
		self.$scope = $scope;
		self.$q = $q;
		self.$state = $state;
		self.timeout = $timeout;
		self.window = $window;
		self.fxpLoggerService = fxpLoggerService;
		self.userInfoService = userInfoService;
		self.dashboardService = dashboardService;
		self.adminLandingService = adminLandingService;
		self.fxpMessage = fxpMessage;
		self.fxpRouteService = fxpRouteService;
		self.fxpConfigurationService = fxpConfigurationService; 

		self.deviceFactory = deviceFactory;
		self.$scope.isMoreLinkActive = false;
		self.$scope.selectedLeftNavItemLinkId = -1;
		self.isNavLinkFocused = false;
		self.fxpContext = fxpContext;
		self.userProfileService = userProfileService;
		self.settingsService = settingsService;
		self.fxpTelemetryContext = fxpTelemetryContext;
		self.deviceDetector = deviceDetector;
		self.$scope.expandLeftNav = self.expandLeftNav.bind(self);
		self.$scope.collapseLeftNav = self.collapseLeftNav.bind(self);
		self.$scope.onPinFlyoutClick = self.onPinFlyoutClick.bind(self);
		self.$scope.onPinFlyoutKeyDown = self.onPinFlyoutKeyDown.bind(self);

		self.$scope.headerMenuChange = self.headerMenuChange.bind(self);
		self.$scope.openFlyoutOnClick = self.openFlyoutOnClick.bind(self);
		self.$scope.onMenuItemClick = self.onMenuItemClick.bind(self);
		self.$scope.resetLeftNavFocus = self.resetLeftNavFocus.bind(self);
		self.$scope.leftNavKeydown = self.leftNavKeydown.bind(self);
		self.$scope.setFocusToHamburger = self.setFocusToHamburger.bind(self);
		self.$scope.leftNavItemClick = self.leftNavItemClick.bind(self);
		self.loggedInUserLeftNavData = null;
		self.oboUserLeftNavData = null;

		var userAlias = self.userInfoService.getCurrentUser();
		var userInfo = self.userInfoService.getCurrentUserData();
		var roleGroupId = userInfo.roleGroupId;
		var userRoleId = userInfo.businessRoleId;
		self.getLeftNav(window["tenantConfiguration"].TenantId, userAlias);
		this.$scope.$on(FxpBroadcastedEvents.OnLeftNavHighlightByStateName, function (event, stateName) {
			self.filterGLNItemForHighlight(self.$scope.leftNavData.internalLinks, stateName);
		});
		this.$scope.$on(FxpBroadcastedEvents.OnUserContextChanged, function (event, currentUserChangedUserAlias, currentUserChangedRoleGroupId, currentUserChangedRoleId) {
			// on close and open AOB , hightlight the default landing experience page                
			self.$rootScope.fxpBreadcrumb = new Array();
			self.currentUserDefaultState = self.fxpRouteService.getDefaultStateName();
			if (!self.userInfoService.isActingOnBehalfOf() && self.loggedInUserLeftNavData) {
				self.$scope.AdminData = self.adminLandingService.GetAdminTileDetails(false);
				self.onSuccessGetLeftNav(self.loggedInUserLeftNavData, currentUserChangedUserAlias);
			} else {
				self.$scope.leftNavData = [];
				self.$scope.leftNavDataExists = false;
				self.getLeftNav(window["tenantConfiguration"].TenantId, currentUserChangedUserAlias);
			}
			if (!self.userInfoService.isActingOnBehalfOf())
				self.setLoggedInUserPreferences();
		});
		this.$scope.$on(FxpBroadcastedEvents.OnLeftNavToggleExpandedState, function () {
			if (self.$rootScope.isLeftNavOpen) {
				self.$scope.collapseLeftNav();
			}
			else {
				self.$scope.expandLeftNav();
			}
		});

		var resizeWindow = function () {
			self.timeout(function () {
				self.isNavLinkFocused = false;
				self.resizeLeftNavHeight();
				if (self.loggedInUserLeftNavData && !self.userInfoService.isActingOnBehalfOf()) {
					self.onSuccessGetLeftNav(self.loggedInUserLeftNavData, self.userInfoService.getLoggedInUser());
				} else if (self.oboUserLeftNavData && self.userInfoService.isActingOnBehalfOf()) {
					self.onSuccessGetLeftNav(self.oboUserLeftNavData, self.userInfoService.getCurrentUser());
				}
			});
		}
		////event to handle window resize
		angular.element(self.window).bind('resize', resizeWindow);
		////event to handle $destroy window
		self.$scope.$on('$destroy', function () {
			angular.element(self.window).unbind('resize', resizeWindow);
		});
	}

	/**
	* A method to  calculate no of icons to show in ui based on window height
	* @method Fxp.Controllers.LeftNavController.resizeLeftnavHeight
	* @example <caption> Example to use resizeLeftnavHeight</caption>
	* LeftNavController.resizeLeftnavHeight()
	*/
	resizeLeftNavHeight(): void {
		var visibleLinksCount = this.getVisibleLinksCount();
		var self = this;
		if (!CommonUtils.isNullOrEmpty(self.$scope.leftNavData)) {
			var internalLinksCount = CommonUtils.getArrayLength(self.$scope.leftNavData.internalLinks);
			var externalLinksCount = CommonUtils.getArrayLength(self.$scope.leftNavData.externalLinks);
			var settingLinksCount = CommonUtils.getArrayLength(self.$scope.leftNavData.settings);

			const linksCount = internalLinksCount + externalLinksCount + settingLinksCount;
			self.$scope.isMoreButtonVisible = visibleLinksCount < linksCount;
			self.$scope.isMoreLinkActive = (self.$scope.selectedLeftNavItemSequence > visibleLinksCount) ? true : false;
			self.$scope.visibleInternalLinksCount = Math.min(visibleLinksCount, internalLinksCount);

			visibleLinksCount = visibleLinksCount - self.$scope.visibleInternalLinksCount;
			self.$scope.visibleExternalLinksCount = Math.min(visibleLinksCount, externalLinksCount);

			visibleLinksCount = visibleLinksCount - self.$scope.visibleExternalLinksCount;
			self.$scope.visibleSettingLinksCount = Math.min(visibleLinksCount, settingLinksCount);
		}
	}
	sortObject = function (srtObject, srtElement) {
		srtObject.sort(function (a, b) {
			return a[srtElement] > b[srtElement] ? 1 : a[srtElement] < b[srtElement] ? -1 : 0;
		});
	};

	/**
	* A method to  use to get the VisibleLinksCount
	* @method Fxp.Controllers.LeftNavController.VisibleLinksCount
	* @example <caption> Example to use VisibleLinksCount</caption>
	* LeftNavController.getVisibleLinksCount()
	*/
	getVisibleLinksCount(): number {
		let leftNavHeight = this.getLeftNavHeight();
		var menuIconHeight = angular.element("#hamburger").outerHeight();
		var noOfIconsToShow = (Math.floor(leftNavHeight / menuIconHeight) - 1);
		return noOfIconsToShow;
	}

	/**
	* A method to  use to get the leftNAvHeight
	* @method Fxp.Controllers.LeftNavController.getLeftNavHeight
	* @example <caption> Example to use getLeftNavHeight</caption>
	* LeftNavController.getLeftNavHeight()
	*/
	getLeftNavHeight(): number {
		var headerHeight = angular.element("#header").height();
		var footerHeight = angular.element("#fxpfooter").height();
		var moreHeight = angular.element("#hamburger").outerHeight();
		var windowHeight = self.window.innerHeight;
		var leftNavHeight = windowHeight - headerHeight - footerHeight - moreHeight;
		return leftNavHeight;
	}

	 /**
        * A method to get the LeftNav data for the user
        * @method Fxp.Controllers.LeftNavController.getLeftNav
        * @example <caption> Example to use getLeftNav</caption>
        * LeftNavController.getLeftNav('tenantId','userAlias')
        */
	   getLeftNav(tenantId: string, userAlias: string) {
		let self = this;
		self.$scope.AdminData = self.adminLandingService.GetAdminTileDetails(true);

		self.userClaimsService.getUserRoles(userAlias)
			.then(function (roles) {
				var deferred = self.$q.defer();
				let userResouces=self.userClaimsService.getUserResources(userAlias);
				let userRoles = self.$base64.encode(roles).toString(); 
                let encodedUserResources= self.$base64.encode(userResouces).toString();
				self.dashboardService.getLeftNavData(tenantId, userRoles,encodedUserResources).then((response) => {
					self.onSuccessGetLeftNav(response.data != undefined ? response.data : [], userAlias);
					deferred.resolve(response);
				}, (error) => {
					var propbag = self.fxpLoggerService.createPropertyBag();
					propbag.addToBag(FxpConstants.metricConstants.RequestedUserAlias, userAlias);
					propbag.addToBag(FxpConstants.metricConstants.Status, error.status);
					propbag.addToBag(FxpConstants.metricConstants.StatusText, error.statusText);
					self.fxpMessage.addMessage(self.$rootScope.fxpUIConstants.UIMessages.LeftNavServiceCallFailedError.ErrorMessage, FxpConstants.messageType.error);
					self.fxpLoggerService.logError('Fxp.Client.LeftNavController', self.$rootScope.fxpUIConstants.UIMessages.LeftNavServiceCallFailedError.ErrorMessageTitle, "1801", null, propbag);
					deferred.reject(error);
				});
				return deferred.promise;
			}, (error) => {

			});
	}

	expandLeftNav = function () {
		var self = this;
		self.$rootScope.isLeftNavOpen = true;
		self.setFocusToHamburger();
		self.resetLeftNavFocus();
		angular.forEach(self.$scope.leftNavData.internalLinks, function (item) {
			item.isOpen = (item.id === self.$scope.selectedLeftNavItemLinkId);
		});
		if (self.$scope.leftNavData.externalLinks) {
			angular.forEach(self.$scope.leftNavData.externalLinks, function (item) {
				item.isOpen = false;
			});
		}

		if (self.$scope.leftNavData.settings) {
			angular.forEach(self.$scope.leftNavData.settings, function (item) {
				item.isOpen = false;
			});
		}
	}

	collapseLeftNav = function ($event) {
		var self = this;
		if (!$event || $event.keyCode == FxpConstants.keyCodes.escapeKey || $event.keyCode == FxpConstants.keyCodes.enterKey || $event.keyCode == FxpConstants.keyCodes.spaceBar) {
			self.$rootScope.isLeftNavOpen = false;
			self.setFocusToHamburger();
		}
	}

	onPinFlyoutClick = function ($event) {
		var leftNavPinUnPinActionStartTime = performance.now();
		var uiPinUnpinActionDuration;
		var self = this;
		if (!self.$rootScope.isLeftNavPinned) {
			self.$rootScope.isLeftNavPinned = true;
			angular.element('#pin').focus();
		}
		else {
			self.$rootScope.isLeftNavPinned = false;
			self.$rootScope.isLeftNavOpen = false;
			self.setFocusToHamburger();
		}
		uiPinUnpinActionDuration = performance.now() - leftNavPinUnPinActionStartTime;
		self.saveLeftNavPinSetting(uiPinUnpinActionDuration);
	}

	onPinFlyoutKeyDown = function ($event) {
		var leftNavPinUnPinActionStartTime = performance.now();
		var uiPinUnpinActionDuration;
		var self = this;
		var keyCode = ($event) ? $event.keyCode : FxpConstants.keyCodes.enterKey;
		switch (keyCode) {

			case FxpConstants.keyCodes.escapeKey:
				self.$rootScope.isLeftNavOpen = false;
				self.setFocusToHamburger();
				break;
			case FxpConstants.keyCodes.tabKey:
				if (!$event.shiftKey) {
					var targetMenu = $($event.target).closest(".fxpLeftNavOpen"),
						visibleMenuItems = targetMenu.find("li a").filter(':visible');
					this.timeout(function () {
						visibleMenuItems[1].focus();
					}, 50);
				}
				break;
		}
	}


	logTelemetryForPinAction(uiPinUnpinActionDuration, saveSettingsResponseDuration) {
		var self = this;
		var leftNavPinStatus = self.$rootScope.isLeftNavPinned ? "LeftNavPinned" : "LeftNavUnPinned";
		var uiPinUnpinDurationKey = self.$rootScope.isLeftNavPinned ? "UILeftNavPinnedDuration" : "UILeftNavUnPinnedDuration";
		var propbag = self.fxpLoggerService.createPropertyBag();
		propbag.addToBag(uiPinUnpinDurationKey, uiPinUnpinActionDuration);
		propbag.addToBag(FxpConstants.metricConstants.LeftNavPinStatus, leftNavPinStatus);
		propbag.addToBag(FxpConstants.metricConstants.SaveSettingsAPIResponseDuration, saveSettingsResponseDuration);
		propbag.addToBag(FxpConstants.metricConstants.ScreenRoute, self.$state.current.name);
		propbag.addToBag(FxpConstants.metricConstants.Geography, self.fxpTelemetryContext.getGeography());
		propbag.addToBag(FxpConstants.metricConstants.BrowserType, self.deviceDetector.browser);
		self.userProfileService.getBasicProfileByAlias(self.userInfoService.getLoggedInUser(), null).then(function (loggedInUserInfo) {
			propbag.addToBag(FxpConstants.metricConstants.UserBusinessRole, loggedInUserInfo["businessRole"]);
			self.fxpLoggerService.logEvent('Fxp.Client.LeftNavController', "Fxp.LeftNavController.PinAction", propbag);
		});
	}

	/**
	* A method to save the LeftNav pin/unpin settings of the user preferences
	* @method Fxp.Controllers.LeftNavController.saveLeftNavPinSetting
	* @example <caption> Example to use getLeftNav</caption>
	* LeftNavController.saveLeftNavPinSetting()
	*/
	saveLeftNavPinSetting = function (uiPinUnpinActionDuration) {
		let self = this;
		if (!self.userInfoService.isActingOnBehalfOf()) {
			let userAlias = self.userInfoService.getLoggedInUser();
			let userPreferencesStorageKey = ApplicationConstants.UserPreferencesStorageKey.replace('{0}', userAlias);
			self.fxpContext.readContext(userPreferencesStorageKey, ApplicationConstants.FxPAppName).then(function (context) {
				let userPreferences = (context && context.Result) ? JSON.parse(context.Result) : {};
				userPreferences.isLeftNavPinned = self.$rootScope.isLeftNavPinned;
				let strUserPreferences = JSON.stringify(userPreferences);
				var saveSettingsAPIStartTime = performance.now();
				self.settingsService.saveSettings(SettingsType.User,
					userAlias,
					ApplicationConstants.UserPreferencesSettings,
					strUserPreferences).then(function (response) {
						var saveSettingsAPIDuration = performance.now() - saveSettingsAPIStartTime;
						self.logTelemetryForPinAction(uiPinUnpinActionDuration, saveSettingsAPIDuration);
						self.fxpContext.saveContext(userPreferencesStorageKey, strUserPreferences, ApplicationConstants.FxPAppName);
					}, function (error) {
						let propbag = self.fxpLoggerService.createPropertyBag();
						propbag.addToBag(FxpConstants.metricConstants.RequestedUserAlias, userAlias);
						propbag.addToBag(FxpConstants.metricConstants.ScreenRoute, self.$state.current.name);
						propbag.addToBag(FxpConstants.metricConstants.Geography, self.fxpTelemetryContext.getGeography());
						propbag.addToBag(FxpConstants.metricConstants.BrowserType, self.deviceDetector.browser);
						propbag.addToBag(FxpConstants.metricConstants.Status, error.status);
						propbag.addToBag(FxpConstants.metricConstants.StatusText, error.statusText + ' ' + error.data);
						self.userProfileService.getBasicProfileByAlias(self.userInfoService.getLoggedInUser(), null).then(function (loggedInUserInfo) {
							propbag.addToBag(FxpConstants.metricConstants.UserBusinessRole, loggedInUserInfo.businessRole);
							self.fxpLoggerService.logError('Fxp.Client.LeftNavController', self.$rootScope.fxpUIConstants.UIMessages.SaveSettingsServiceCallFailedError.ErrorMessageTitle, "3502", null, propbag);
						});
					});
			});
		}
	}

	/**
   * A method to get the Logged-in User preferences
   * @method Fxp.Controllers.LeftNavController.setLoggedInUserPreferences
   * @example <caption> Example to use setLoggedInUserPreferences </caption>
   * LeftNavController.setLoggedInUserPreferences ()
   */
	setLoggedInUserPreferences(): void {
		let self = this;
		self.fxpContext.readContext(ApplicationConstants.UserPreferencesStorageKey.replace('{0}', self.userInfoService.getLoggedInUser()),
			ApplicationConstants.FxPAppName).then(function (context) {
				var settings = (context && context.Result) ? JSON.parse(context.Result) : {};
				self.$rootScope.isLeftNavOpen = self.$rootScope.isLeftNavPinned = (settings.isLeftNavPinned === undefined) ? true : settings.isLeftNavPinned;
			});
	}

	headerMenuChange = function ($event, item) {
		var self = this;
		if (!item.parentId && item.hasChildren === false) {
			self.setSelectedLeftNavIds(item.id, -1, item.sequence);
			// when L0 item is clicked hide all L0 with child items
			angular.forEach(self.$scope.leftNavData.internalLinks, function (item) {
				item.isOpen = false;
			});
		}
		if (!item.hasChildren) {
			if (!self.$rootScope.isLeftNavPinned) {
				self.$rootScope.isLeftNavOpen = false;
				var currentStateName = this.$state.current.name;
				if (item.targetUIStateName === currentStateName) {
					this.timeout(function () {
						angular.element('#Fxpdashboard_LeftNavItem_' + item.id).focus();
					}, 50);
				}
			}
			self.$rootScope.$emit('leftNavHighlighted', item);
			$event.stopPropagation();
		}
	}

	openFlyoutOnClick = function (item, $event) {
		var self = this;
		if (!$event.ctrlKey && !$event.shiftKey) {
			if (!item.parentId && item.hasChildren === false) {
				self.setSelectedLeftNavIds(item.id, -1, item.sequence);
			}
			angular.forEach(self.$scope.leftNavData.internalLinks, function (item) {
				item.isOpen = false;
			});
			if (self.$scope.leftNavData.externalLinks) {
				angular.forEach(self.$scope.leftNavData.externalLinks, function (item) {
					item.isOpen = false;
				});
			}
			if (self.$scope.leftNavData.settings) {
				angular.forEach(self.$scope.leftNavData.settings, function (item) {
					item.isOpen = false;
				});
			}

			self.resetLeftNavFocus();
			if (!item.hasChildren) {
				self.$rootScope.$emit('leftNavHighlighted', item);
				return;
			}
			self.$rootScope.isLeftNavOpen = true;
			item.isOpen = true;
			this.timeout(function () {
				angular.element('#Fxpdashboard_LeftNavItem_' + item.id).focus();
			}, 50);
		}
	}

	onMenuItemClick = function (item, innerItem) {
		var self = this;
		if (!self.$rootScope.isLeftNavPinned) {
			self.$rootScope.isLeftNavOpen = false;
			var currentStateName = this.$state.current.name;
			if (innerItem.targetUIStateName === currentStateName) {
				this.timeout(function () {
					angular.element('#Fxpdashboard_LeftNavItem_' + item.id).focus();
				}, 50)
			}
		}
	}

	resetLeftNavFocus = function () {
		this.timeout(function () {
			angular.element('.mCustomScrollBox').attr("tabindex", "-1");
			angular.element('.accordion-toggle').attr("tabindex", "-1");
		}, 1000)
	}

	leftNavKeydown = function ($event) {
		var self = this;
		var targetMenu = $($event.target).closest("#fxp-sidebar"),
			allMenuItems = targetMenu.find("li a").filter(':visible'),
			currentMenuItemIndex = allMenuItems.index($event.target);

		switch ($event.keyCode) {
			case FxpConstants.keyCodes.arrowDownKey:
				if (currentMenuItemIndex < (allMenuItems.length - 1)) {
					allMenuItems[currentMenuItemIndex + 1].focus();
				}
				break;
			case FxpConstants.keyCodes.arrowUpKey:
				if (currentMenuItemIndex > 0) {
					allMenuItems[currentMenuItemIndex - 1].focus();
				}
				break;
			case FxpConstants.keyCodes.spaceBar:
				self.$scope.expandLeftNav();
				break;
		}
	}

	setFocusToHamburger = function () {
		this.timeout(function () {
			angular.element('#hamburger').focus();
		}, 50)
	}

	/**
	* A method to update LeftNav data for the current user
	* @method Fxp.Controllers.LeftNavController.onSuccessGetLeftNav
	* @example <caption> Example to use onSuccessGetLeftNav</caption>
	* LeftNavController.onSuccessGetLeftNav(leftNavData,'alias')
	*/
	onSuccessGetLeftNav(leftNavData: any, userAlias: string) {
		var self = this;
		self.fxpLoggerService.logInformation('Fxp.Client.LeftNavController', "OnSuccessGetLeftNav");
		if (leftNavData.internalLinks.length > 0) { 
            leftNavData.internalLinks[0].targetUIStateName = self.fxpRouteService.getDefaultStateName();
        } 
		if (!self.userInfoService.isActingOnBehalfOf()) {
			self.loggedInUserLeftNavData = angular.copy(leftNavData);
		} else {
			self.oboUserLeftNavData = angular.copy(leftNavData);
		}
		if(self.fxpConfigurationService.FxpBaseConfiguration.RMDashboard){
			var rmDashboard = self.fxpConfigurationService.FxpBaseConfiguration.RMDashboard;
			leftNavData.internalLinks.push(rmDashboard);
		}
		if(self.fxpConfigurationService.FxpBaseConfiguration.FxpCapabilities){
			var fxpCapabilities = self.fxpConfigurationService.FxpBaseConfiguration.FxpCapabilities;
			leftNavData.internalLinks.push(fxpCapabilities);
		}
		if(self.fxpConfigurationService.FxpBaseConfiguration.ProfileComponent){
			var profileComponent = self.fxpConfigurationService.FxpBaseConfiguration.ProfileComponent;
			leftNavData.internalLinks.push(profileComponent);
		}
		self.$scope.AdminData.then(function (response) {

			if (response && response.length > 0) {
				if(self.fxpConfigurationService.FxpBaseConfiguration.AdminLeftNav){
					var LeftNavAdminData = self.fxpConfigurationService.FxpBaseConfiguration.AdminLeftNav;
					leftNavData.internalLinks.push(LeftNavAdminData);
				}
							
			}

		}, function (error) {

			self.fxpMessage.addMessage(self.$rootScope.fxpUIConstants.UIMessages.AdminLandingServiceCallFailedError.ErrorMessage, FxpConstants.messageType.error);
			self.fxpLoggerService.logError('Fxp.Client.LeftNavController', self.$rootScope.fxpUIConstants.UIMessages.AdminLandingServiceCallFailedError.ErrorMessageTitle, "2702", null);

		}).then(function () {
			self.$scope.leftNavData = self.getDeviceSpecificLeftNavItems(leftNavData);


			if (leftNavData.internalLinks && leftNavData.internalLinks.length > 0)
				self.checkLinksWithMissingModules(leftNavData.internalLinks);

			self.$scope.leftNavDataExists = self.$scope.leftNavData.internalLinks ? self.$scope.leftNavData.internalLinks.length > 0 : false;
			self.setSequence();
			if (!self.$scope.leftNavDataExists) {
				self.fxpMessage.addMessage(self.$rootScope.fxpUIConstants.UIMessages.GeneralExceptionError.ErrorMessage, FxpConstants.messageType.error);
				return;
			}
			self.timeout(function () {
				self.resizeLeftNavHeight();
				self.findActiveLeftNavItem(self.$scope.leftNavData.internalLinks);
			}, 300);
		});
	}

	/**
	* A method to get the leftNav items on device specific
	* @method Fxp.Controllers.LeftNavController.getDeviceSpecificLeftNavItems
	* @param {leftNavData } leftNavData leftnavdata returned by fxp service api.
	* @example <caption> Example to use getDeviceSpecificLeftNavItems</caption>
	* LeftNavController.getDeviceSpecificLeftNavItems(leftNavData)
	*/
	getDeviceSpecificLeftNavItems(leftNavData: any): any {
		var self = this;
		if (self.deviceFactory.isMobile()) {
			leftNavData.internalLinks = leftNavData.internalLinks.filter(function (item) {
				return (item.applicableDevice == FxpConstants.applicableDevice.mobile || item.applicableDevice == FxpConstants.applicableDevice.all)
			});
		}
		else {
			leftNavData.internalLinks = leftNavData.internalLinks.filter(function (item) {
				return (item.applicableDevice == FxpConstants.applicableDevice.desktop || item.applicableDevice == FxpConstants.applicableDevice.all)
			});
		}
		return leftNavData;
	}

	/**
	* click GLN item/link and Highlight it
	* @method Fxp.Controllers.LeftNavController.leftNavItemClick
	* @param {item} item item is LeftNav Item.
	* @example <caption> Example to use leftNavItemClick</caption>
	* LeftNavController.leftNavItemClick(item)
	*/
	leftNavItemClick = function (item, $event) {

		if (item.dependenciesMissing && item.dependenciesMissing === true) {
			//Handle scenario when left nav click is restricted.
		}
		else {
			var self = this;
			if ($event && !$event.ctrlKey && !$event.shiftKey) {
				self.highlightLeftNavItem(item);
			}
		}
	}

	highlightLeftNavItem = function (item) {
		var self = this;
		if (item.parentId) {
			self.setSelectedLeftNavIds(item.parentId, item.id, item.parentSequence);
		}
		else {
			self.setSelectedLeftNavIds(item.id, -1, item.sequence);
		}
		self.$rootScope.$emit('leftNavHighlighted', item);
	}

	/**
	* A method to set Sequence no to leftNav items
	* @method Fxp.Controllers.LeftNavController.setSequence
	* @example <caption> Example to use setSequence</caption>
	* LeftNavController.setSequence()
	*/
	private setSequence() {
		var self = this;
		if (self.$scope.leftNavDataExists) {
			self.sortObject(self.$scope.leftNavData.internalLinks, "sortOrder");
			for (var i = 0; i < self.$scope.leftNavData.internalLinks.length; i++) {
				self.$scope.leftNavData.internalLinks[i].sequence = i + 1;
				if (self.$scope.leftNavData.internalLinks[i].hasChildren) {
					var children = self.$scope.leftNavData.internalLinks[i].children;
					for (var j = 0; j < children.length; j++) {
						children[j].parentSequence = i + 1;
					}
				}
			}
		}
	}

	/**
	* A method to set Selected LeftNav Id's
	* @method Fxp.Controllers.LeftNavController.setSelectedLeftNavIds
	* @param {linkId } linkId linkId is Parent Id of Left Nav Item.
	* @param {id } id id is the Left Nav Item.
	* @param {sequence } sequence sequence is the Left Nav Item sequential order no of  Global Left Navigation List.
	* @example <caption> Example to use setSelectedLeftNavIds</caption>
	* LeftNavController.setSelectedLeftNavIds(linkId)
	*/
	private setSelectedLeftNavIds(linkId, id, sequence) {
		var self = this;
		self.$scope.selectedLeftNavItemId = id;
		self.$scope.selectedLeftNavItemLinkId = linkId;
		self.$scope.selectedLeftNavItemSequence = sequence;
	}

	/**
   * A method to to hightlight GLN link on refresh, landing experience and on bookmark.
   * @method Fxp.Controllers.LeftNavController.findActiveLeftNavItem
   * @param {response } response leftNavItems
   * @example <caption> Example to use findActiveLeftNavItem</caption>
   * LeftNavController.findActiveLeftNavItem(response)
   */
	private findActiveLeftNavItem(response) {
		var self = this;
		var stateName = self.currentUserDefaultState ? self.currentUserDefaultState : self.$state.current.name;
		if (response) {
			self.filterGLNItemForHighlight(response, stateName);
		}
	}

	private filterGLNItemForHighlight(navList, stateName) {
		var self = this;
		let leftNavItems = self.dashboardService.getGLNFlatDataStructure(navList).filter(function (item) {
			return (item.targetUIStateName && item.targetUIStateName.toLowerCase() === stateName.toLowerCase());
		});
		if (leftNavItems && leftNavItems.length === 1) {
			self.highlightLeftNavItem(leftNavItems[0]);
		}
	}

	private checkLinksWithMissingModules(links) {
		//Update Left nav data for states that are not available
		for (var l = 0; l < links.length; l++) {
			var leftNavLink = links[l];
			if (leftNavLink.hasChildren && leftNavLink.children && leftNavLink.children.length > 0) {
				this.checkLinksWithMissingModules(leftNavLink.children);
			}
			else {
				if (Resiliency.statesWithMissingModules.indexOf(leftNavLink.targetUIStateName) > -1) {
					leftNavLink.dependenciesMissing = true;

				}
			}
		}
	}
}

LeftNavController.$inject = ['$rootScope', '$q', '$scope', '$state', '$timeout', 'DashboardService', 'FxpLoggerService', 'UserInfoService', 'FxpMessageService', '$window', '$document', 'DeviceFactory', 'FxpRouteService', 'FxpConfigurationService', 'UserProfileService', 'SettingsService', 'FxpContextService', 'FxpTelemetryContext', 'deviceDetector', 'AdminLandingService','UserClaimsService', '$base64'];