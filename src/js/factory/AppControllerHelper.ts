import { IRootScope } from "../interfaces/IRootScope";
import { UserProfileService } from "../services/userProfileService";
import { PageLoaderService } from "../services/pageLoaderService";
import { TelemetryContext } from "../telemetry/telemetrycontext";
import { UserInfoService } from "../services/UserInfoService";
import { FxpLoggerService } from "../telemetry/FxpLogger";
import { FxpConfigurationService } from "../services/FxpConfiguration";
import { CustomErrors } from "../common/constants/ErrorConstants";
import { CustomEvents, FxpConstants, PerfMarkers, ApplicationConstants } from "../common/ApplicationConstants";
import { GlobalExceptionHandler } from "../telemetry/GlobalExceptionHandler";
import { CommonUtils } from "../utils/CommonUtils";
import { PlannedDownTimeService } from "../services/PlannedDownTimeService";
import { SettingsServiceProvider } from "../provider/SettingsServiceProvider";
import { FxpMessageService } from "../services/FxpMessageService";
import { FxpContext } from "../context/FxpContext";
import { SettingsType } from "../common/SettingsType";
import { ISettingsService } from "../interfaces/ISettingsService";
import { FeatureFlagService } from '@fxp/flightingsdk';
import { UserClaimsService } from "../services/UserClaimsService";
import { FxpBroadcastedEvents } from "../services/FxpBroadcastedEvents";
import { showSystemDownOverlay } from "../utils/systemDownOverlay";

/**
 * @application  Fxp
 */
/**
    * A main factory which acts as an helper for AppController. This is the factory having common functionalities.
    * @class Fxp.Factory.AppControllerHelper
    * @classdesc An helper factory for AppController in FxPApp module
    * @example <caption>
    *  //How To use this factory
    *  angular.module('FxPApp').controller('AppController', ['AppControllerHelper', AppControllerHelper]);
    *  function AppController(AnyDependency){ AppControllerHelper.getBasicProfile(); }
    */

export class AppControllerHelper {
	private static _instance: AppControllerHelper;
	private $rootScope: IRootScope;
	private $q: angular.IQService;
	private adalAuthenticationService: adal.AdalAuthenticationService;
	private userProfileService: UserProfileService;
	private pageLoaderService: PageLoaderService;
	private fxpTelemetryContext: TelemetryContext;
	private fxpLoggerService: FxpLoggerService;
	private userInfoService: UserInfoService;
	private fxpConstants: FxpConstants;
	private fxpConfiguration: FxpConfigurationService;
	private deviceFactory: any;
	private deviceDetector: any;
	private userClaimsService: UserClaimsService; 
	constructor($q: angular.IQService, $rootScope: IRootScope, adalAuthenticationService: adal.AdalAuthenticationService,
		userProfileService: UserProfileService, pageLoaderService: PageLoaderService, fxpTelemetryContext: TelemetryContext,
		fxpLoggerService: FxpLoggerService, userInfoService: UserInfoService, private featureFlagService: FeatureFlagService, private startUpFlightConfig: any, private settingsService: ISettingsService, private fxpContext: FxpContext, private fxpMessage: FxpMessageService, deviceFactory: any, deviceDetector: any,
		private plannedDownTimeService: PlannedDownTimeService, fxpConfiguration: FxpConfigurationService, userClaimsService: UserClaimsService) {
		this.$q = $q;
		this.$rootScope = $rootScope;
		this.adalAuthenticationService = adalAuthenticationService;
		this.userProfileService = userProfileService;
		this.pageLoaderService = pageLoaderService;
		this.fxpTelemetryContext = fxpTelemetryContext;
		this.fxpLoggerService = fxpLoggerService;
		this.userInfoService = userInfoService;
		this.fxpConstants = FxpConstants;
		this.fxpConfiguration = fxpConfiguration;
		this.$rootScope.isFxpLoadedWithClaims = false;
		this.deviceFactory = deviceFactory;
		this.deviceDetector = deviceDetector;
		this.userClaimsService = userClaimsService; 
		if (AppControllerHelper._instance) {
			return AppControllerHelper._instance;
		}
		AppControllerHelper._instance = this;
	}

	/**
	* A method to get the basic profile.
	* @method Fxp.Factory.AppControllerHelper.getBasicProfile($scope, true)
	* @param {angular.IScope} $scope $scope from angular app view.
	* @param {Boolean} isRefresh A boolean which if false gets the data from fxpContext(global cache).
	* @example <caption> Example to use getBasicProfile</caption>
	*  AppControllerHelper.getBasicProfile($scopem true);
	*/
	getBasicProfile($scope: any): void {
		var upn = this.adalAuthenticationService.userInfo.userName;
		var alias = upn.substring(0, upn.indexOf('@'));
		var fxpTelemetryContext = this.fxpTelemetryContext;
		var fxpLoggerService = this.fxpLoggerService;
		var self = this;
		var isAppLaunch = false;

		var fxpAppLaunched = window.sessionStorage.getItem(ApplicationConstants.FxpApplaunchedKey)
		if (CommonUtils.isNullOrEmpty(fxpAppLaunched)) {
			isAppLaunch = true;
		}
		isAppLaunch = true;
		if (this.adalAuthenticationService.userInfo.profile.iss === ApplicationConstants.PartnerDomainIss) {
			alias = ApplicationConstants.PartnerDomain + alias;
		}

		self.userProfileService.setLoggedInUser(alias);
		self.userClaimsService.setLoggedInUser(alias);
		self.fxpTelemetryContext.addToGlobalPropertyBag('LoggedInUser', upn);
		self.userProfileService.setCurrentUser(alias);

		var profilePromise = this.userProfileService.getBasicProfile(alias, isAppLaunch).then(function (data) {
			self.$rootScope.userProfile = data;
			if (data) {
				try {
					let Id = (data.roleGroupId == null || data.roleGroupId == undefined || data.roleGroupId == 0) ? -1 : data.roleGroupId;
					self.$rootScope.roleGroupIdInternal = parseInt(Id);
					self.fxpLoggerService.setLoggedInUserContext(data.roleGroupId, data.roleGroupName, self.userProfileService.isObo(), data.TenantKey, data.TenantName);
				} catch (e) {
					self.$rootScope.roleGroupIdInternal = -1;
					fxpLoggerService.logError('Fxp.BaseModule', "roleGroupId is not integer value", null, null);
				}
				//Setting Tenant Name to the rootscope
				self.$rootScope.tenantIdInternal = data.TenantName ? data.TenantName : "-1";
				
				if (isAppLaunch == true) {
					window.sessionStorage.setItem(ApplicationConstants.FxpApplaunchedKey, 'true');
					fxpLoggerService.logEvent('Fxp.BaseModule', CustomEvents.FxpAppLaunched);
				}
			}
			else {
				self.$rootScope.roleGroupId = -1;
			}
		});

		var claimsPromise = this.userProfileService.getCalimsSvc(alias).then(function (data) {
			if (data) {
				let appRole = (data.defaultAppRole == null || data.defaultAppRole == undefined) ? "" : data.defaultAppRole;
				if (appRole == "") {
					var headerText = CommonUtils.getTenantURLSpecificPageTitle(self.fxpConfiguration.FxpBaseConfiguration.FxpConfigurationStrings.UIMessages.InvalidRoleGroupID.ErrorMessageTitle);
					var descriptionText = self.fxpConfiguration.FxpBaseConfiguration.FxpConfigurationStrings.UIMessages.InvalidRoleGroupID.ErrorMessage;
					var hyperlinkText = CommonUtils.getTenantURLSpecificPageTitle(self.fxpConfiguration.FxpBaseConfiguration.FxpConfigurationStrings.UIMessages.InvalidRoleGroupID.HyperlinkText);
					var hyperlinkUrl = self.fxpConfiguration.FxpBaseConfiguration.FxpConfigurationStrings.UIMessages.InvalidRoleGroupID.HyperlinkUrl;
					var pageTitle = CommonUtils.getTenantURLSpecificPageTitle(self.fxpConfiguration.FxpBaseConfiguration.FxpConfigurationStrings.UIMessages.InvalidRoleGroupID.PagetTitle);
					showSystemDownOverlay(headerText, descriptionText, pageTitle, hyperlinkText, hyperlinkUrl);
				}
				fxpTelemetryContext.setUserRole(appRole);
				self.$rootScope.defaultAppRoleInternal = appRole;
			} else {
				self.$rootScope.defaultAppRole = "";
			}
			fxpLoggerService.logInformation("Fxp.AppControllerHelper", "User Claims loaded");
		});
		this.$q.all([claimsPromise, profilePromise]).then(function () {
			self.$rootScope.isFxpLoadedWithClaims = true;
			self.$rootScope.roleGroupId = self.$rootScope.roleGroupIdInternal || -1;
			self.setDefaultAppRole();
			//TODO
			self.$rootScope.tenantId = self.$rootScope.tenantIdInternal;
			fxpLoggerService.logInformation("Fxp.AppControllerHelper", "rolegroupId, tenantId, defaultAppRole was updated");
			fxpLoggerService.stopTrackPerformance(PerfMarkers.PreDashboardLoad);
			fxpLoggerService.startTrackPerformance(PerfMarkers.DashboardLoad);
			self.$rootScope.$broadcast(FxpBroadcastedEvents.OnFxpLoadCompleted);
		}, function (err) { 
			self.$rootScope.roleGroupId = -1;
			self.pageLoaderService.fnHidePageLoader();
			self.checkOneProfileAndCalimStatus(err);
			self.$rootScope.isFxpLoadedWithClaims = false;
		});

		self.fxpLoggerService.startTrackPerformance(PerfMarkers.GetUserThumbnail);
		this.userProfileService.getUserThumbnail(upn, false).then(function (data) {
			var blob = new Blob([data.data], { type: "JPEG" });
			var url = (window.URL || window["webkitURL"]).createObjectURL(blob);
			$scope.userThumbnailPhoto = url;
			self.fxpLoggerService.stopTrackPerformance(PerfMarkers.GetUserThumbnail);
		}, function (data) {
			$scope.userThumbnailPhoto = "/assets/pictures/User.png";
			self.fxpLoggerService.stopTrackPerformance(PerfMarkers.GetUserThumbnail);
		});
	}


	/**
	 * A method to use show the SystemDown/Profile error, if OneProfileAndCalims API falied.
	 * @method Fxp.Controllers.AppController.checkOneProfileAndCalimStatus 
	 * @param {object} error A error Object need to send 
	 * @example <caption> Example to use checkOneProfileAndCalimStatus</caption>
	 * AppControllerHelper.checkOneProfileAndCalimStatus(error)
	 */
	checkOneProfileAndCalimStatus(err: any) {
		var self = this, headerText, descriptionText, pageTitle,
			profileStore = window["tenantConfiguration"].ProfileStore || {},
			authStore = window["tenantConfiguration"].AuthStore || {};
		var propBag = self.fxpLoggerService.createPropertyBag();
		propBag.addToBag("UserName", self.adalAuthenticationService.userInfo.profile.name);

		if (err && err.config) {
			propBag.addToBag(FxpConstants.metricConstants.Status, err.status);
			propBag.addToBag(FxpConstants.metricConstants.StatusText, err.statusText);
			propBag.addToBag(FxpConstants.metricConstants.ErrorUrl, err.config.url);
		}

		// if oneprofile basic API failed
		if (err && err.config && err.config.url.indexOf(profileStore.ProfileAPIEndPoint) > -1) {
			self.getBasicProfileFailed(propBag);
			// ErrorCode === 114 represents  Not a valid user/ profile does'nt exist, which is return by basic profile API. 
			if ((err && err.data && err.data.ErrorCode === 114)) {
				if (self.fxpConfiguration.FxpBaseConfiguration.FxpConfigurationStrings.UIMessages.BasicProfileMissing) {
					headerText = self.fxpConfiguration.FxpBaseConfiguration.FxpConfigurationStrings.UIMessages.BasicProfileMissing.ErrorMessageTitle;
					descriptionText = self.fxpConfiguration.FxpBaseConfiguration.FxpConfigurationStrings.UIMessages.BasicProfileMissing.ErrorMessage;
					pageTitle = CommonUtils.getTenantURLSpecificPageTitle(self.fxpConfiguration.FxpBaseConfiguration.FxpConfigurationStrings.UIMessages.BasicProfileMissing.PageTitle);
				} else {
					console.log("Failed to load BasicProfileMissing error string from UIMessages");
				}
				propBag.addToBag(FxpConstants.metricConstants.GlobalErrorDetail, "Basic Profile call Failure");
				GlobalExceptionHandler.logFxpBootFailure(self.fxpLoggerService.getDefaultPropertyBagValues(propBag), "Fxp.CheckOneProfileAndCalimStatus", true, headerText, descriptionText, pageTitle);
			}
		}
		// if oneprofile claims API failed due to ITAuth Down or blank roles (for 500 and 404 httpresponses)
		if (err && err.config &&
			(err.config.url.indexOf(authStore.UserClaimsEndPoint) > -1 || err.config.url.indexOf(authStore.TenantClaimsEndPoint) > -1)) {
			self.getClaimsFailed(propBag);
		}
	}

	/**
	 * A method to use log the Basic profile error  
	 * @method Fxp.Controllers.AppController.getBasicProfileFailed
	 * @param {object} propBag A propBag Ojects need to send
	 * @example <caption> Example to use getBasicProfileFailed</caption>
	 * AppControllerHelper.getBasicProfileFailed(propBag)
	 */
	getBasicProfileFailed(propBag: any) {
		var self = this, headerText, descriptionText, pageTitle;
		if (self.fxpConfiguration.FxpBaseConfiguration.FxpConfigurationStrings.UIMessages.BasicProfileAPIFailed) {
			headerText = self.fxpConfiguration.FxpBaseConfiguration.FxpConfigurationStrings.UIMessages.BasicProfileAPIFailed.ErrorMessageTitle;
			descriptionText = self.fxpConfiguration.FxpBaseConfiguration.FxpConfigurationStrings.UIMessages.BasicProfileAPIFailed.ErrorMessage;
			pageTitle = CommonUtils.getTenantURLSpecificPageTitle(self.fxpConfiguration.FxpBaseConfiguration.FxpConfigurationStrings.UIMessages.BasicProfileAPIFailed.PageTitle);
		} else {
			console.log("Failed to load BasicProfileAPIFailed error string from UIMessages");
		}
		propBag.addToBag(FxpConstants.metricConstants.GlobalErrorDetail, "User basic profile call Failure");
		GlobalExceptionHandler.logFxpBootFailure(self.fxpLoggerService.getDefaultPropertyBagValues(propBag), "Fxp.GetBasicProfileFailed", true, headerText, descriptionText, pageTitle);
	}

	/**
	 * A method to use log the User Claims call failure error  
	 * @method Fxp.Controllers.AppController.getClaimsFailed
	 * @param {object} propBag A propBag Ojects need to send
	 * @example <caption> Example to use getClaimsFailed</caption>
	 * AppControllerHelper.getClaimsFailed(propBag)
	 */
	getClaimsFailed(propBag: any) {
		var self = this, headerText, descriptionText, pageTitle;
		if (self.fxpConfiguration.FxpBaseConfiguration.FxpConfigurationStrings.UIMessages.ClaimsAPIFailed) {
			headerText = self.fxpConfiguration.FxpBaseConfiguration.FxpConfigurationStrings.UIMessages.ClaimsAPIFailed.ErrorMessageTitle;
			descriptionText = self.fxpConfiguration.FxpBaseConfiguration.FxpConfigurationStrings.UIMessages.ClaimsAPIFailed.ErrorMessage;
			pageTitle = CommonUtils.getTenantURLSpecificPageTitle(self.fxpConfiguration.FxpBaseConfiguration.FxpConfigurationStrings.UIMessages.ClaimsAPIFailed.PageTitle);
		} else {
			console.log("Failed to load ClaimsAPIFailed error string from UIMessages");
		}
		propBag.addToBag(FxpConstants.metricConstants.GlobalErrorDetail, "User Claims call Failure");
		GlobalExceptionHandler.logFxpBootFailure(self.fxpLoggerService.getDefaultPropertyBagValues(propBag), "Fxp.GetClaimsFailed", true, headerText, descriptionText, pageTitle);
	}

	/**
	* A method to load data after login success
	* @method Fxp.Controllers.AppController.postLoginSuccess
	* @example <caption> Example to use postLoginSuccess</caption>
	* AppControllerHelper.postLoginSuccess()
	*/
	postLoginSuccess(): void {
		let self = this;
		self.getUserPreferenceSettings();
		//make flighting service call after the get basic profile call is succeeeded
		self.$rootScope.$on('OnFxpLoadedEvent', function () {
			self.getInitalFlags();
		});
		self.fxpLoggerService.logInformation("Fxp.AppControllerHelper", "postLoginSuccess method end in AppControllerHelper");
	}
	/**
	* A method to get the User Preferences Settings
	* @method Fxp.Controllers.AppController.getUserPreferenceSettings
	* @example <caption> Example to use getUserPreferenceSettings</caption>
	* AppControllerHelper.getUserPreferenceSettings()
	*/
	getUserPreferenceSettings(): void {
		var self = this;
		if (self.deviceFactory.isMobile()) {
			/*In mobile view leftnav pinned by default status setting false.*/
			self.$rootScope.isLeftNavOpen = self.$rootScope.isLeftNavPinned = false;
		} else {
			self.getSettingsSvc();
		}
	}

	/**
	* A method to get the User Preferences Settings using settings provider service 
	* @method Fxp.Controllers.AppControllerHelper.getSettingsSvc
	* @example <caption> Example to use getSettingsSvc</caption>
	* AppControllerHelper.getSettingsSvc()
	*/
	private getSettingsSvc(): void {

		let self = this;
		let upn = self.adalAuthenticationService.userInfo.userName;
		let userAlias = upn.substring(0, upn.indexOf('@'));
		let userPreferencesStorageKey = ApplicationConstants.UserPreferencesStorageKey.replace('{0}', userAlias);
		let getSettingsAPIResponseDuration;
		let propbag = self.fxpLoggerService.createPropertyBag();
		let getSettingsAPIStartTime = performance.now();
		self.settingsService.getSettings(SettingsType.User, userAlias, ApplicationConstants.UserPreferencesSettings).then(function (response: any) {
			getSettingsAPIResponseDuration = performance.now() - getSettingsAPIStartTime;
			propbag.addToBag(FxpConstants.metricConstants.GetSettingsAPIResponseDuration, getSettingsAPIResponseDuration);
			propbag.addToBag(FxpConstants.metricConstants.Geography, self.fxpTelemetryContext.getGeography());
			propbag.addToBag(FxpConstants.metricConstants.BrowserType, self.deviceDetector.browser);
			self.userProfileService.getBasicProfileByAlias(self.userInfoService.getLoggedInUser(), null).then(function (loggedInUserInfo: any) {
				propbag.addToBag(FxpConstants.metricConstants.UserBusinessRole, loggedInUserInfo.businessRole);
				self.fxpLoggerService.logEvent('Fxp.Client.AppControllerHelper', "Fxp.AppControllerHelper.GetUserPreferences", propbag);
			});
			if (response && (response.data.length > 0)) {
				var userSettings = JSON.parse(response.data[0].settingValue);
				self.$rootScope.isLeftNavOpen = self.$rootScope.isLeftNavPinned = userSettings.isLeftNavPinned;
				self.$rootScope.isNotificationDNDEnabled = userSettings.isNotificationDNDEnabled;
				self.fxpContext.saveContext(userPreferencesStorageKey, response.data[0].settingValue, ApplicationConstants.FxPAppName);
			} else {
				self.setDefaultUserPreferences();
			}
		}, function (error) {
			self.setDefaultUserPreferences();
			propbag.addToBag(FxpConstants.metricConstants.RequestedUserAlias, userAlias);
			propbag.addToBag(FxpConstants.metricConstants.Status, error.status);
			propbag.addToBag(FxpConstants.metricConstants.StatusText, error.statusText + ' ' + error.data);
			self.fxpMessage.addMessage(self.$rootScope.fxpUIConstants.UIMessages.GeneralExceptionError.ErrorMessage, FxpConstants.messageType.error);
			self.userProfileService.getBasicProfileByAlias(self.userInfoService.getLoggedInUser(), null).then(function (loggedInUserInfo: any) {
				propbag.addToBag(FxpConstants.metricConstants.UserBusinessRole, loggedInUserInfo.businessRole);
				self.fxpLoggerService.logError('Fxp.Client.AppControllerHelper', self.$rootScope.fxpUIConstants.UIMessages.GetSettingsServiceCallFailedError.ErrorMessageTitle, "3501", null, propbag);
			});
		});
	}

	private setDefaultUserPreferences(): void {
		var self = this;
		self.$rootScope.isLeftNavOpen = self.$rootScope.isLeftNavPinned = true;
		self.$rootScope.isNotificationDNDEnabled = false;
	}

	//Call flighting service to get the feature flags.        
	getInitalFlags(): void {
		var self = this;
		var context = {};
		var eventNames = CustomEvents;
		self.$rootScope.initialFlags = {}; //to avoid undefined errors
		var config = self.startUpFlightConfig;
		var username = self.adalAuthenticationService.userInfo.userName;
		var roleGroupId = self.$rootScope.roleGroupId;
		var tenantId = self.$rootScope.tenantId;
		//check if the rolegroupid and tenantid exists
		//if it doesnt exist pass -1. Flighting will send the data by checking for alias in this case.
		context = { alias: username.substring(0, username.indexOf("@")), rolegroupid: roleGroupId ? roleGroupId : -1, tenantId: tenantId ? tenantId : -1};

		console.log("retriving flags");
		this.featureFlagService
			.getFeatureFlags(config.appName, config.envName, config.featureNames, context)
			.then(function (response) {
				self.$rootScope.initialFlags = response;
				self.$rootScope.$emit(eventNames.StartUpFlagRetrieved);
			}, function (error) {
				var startUpFlagRetrieveError = CustomErrors.StartUpFlagRetrieveError
				self.fxpLoggerService.logError(startUpFlagRetrieveError.errorMessage, "Call to flighting service failed : " + error.data, startUpFlagRetrieveError.errorCode, null);
				self.$rootScope.$emit(eventNames.StartUpFlagRetrieved);
			});
	}
	handleAdalErrorsAuthenticating(): void {
		var self = AppControllerHelper._instance;
		self.handleAdalErrors("Authenticating");
	}
	handleAdalErrorsLoadingProfile(): void {
		var self = AppControllerHelper._instance;
		self.handleAdalErrors("LoadingProfile");
	}
	handleAdalErrorsLoadingDashboard(): void {
		var self = AppControllerHelper._instance;
		self.handleAdalErrors("LoadingDashboard");
	}
	private handleAdalErrors(pageLoaderEvent: string): void {
		var self = AppControllerHelper._instance;
		var propBag = self.fxpLoggerService.createPropertyBag();
		propBag.addToBag("PageLoaderEvent", pageLoaderEvent);
		propBag.addToBag(ApplicationConstants.RequestStateName, sessionStorage[ApplicationConstants.RequestStateName]);
		propBag.addToBag(ApplicationConstants.AdalLoginError, localStorage["adal.login.error"]);
		propBag.addToBag(ApplicationConstants.AdalLoginRequest, localStorage["adal.login.request"]);
		var adalErrorDescription = localStorage["adal.error.description"];
		if (CommonUtils.isNullOrEmpty(adalErrorDescription)) {
			propBag.addToBag("Message", self.$rootScope.fxpUIConstants.UIMessages.LoadTimeOutGenericError.ErrorMessage);
			self.fxpMessage.addMessage(self.$rootScope.fxpUIConstants.UIMessages.LoadTimeOutGenericError.ErrorMessage, "error");
			self.fxpLoggerService.logError("Fxp.Bootstrap", "FxpBootstrapError", "0001", null, propBag);
		}
		else {
			var trustedSiteIssue = adalErrorDescription.indexOf("AADSTS50058") == 0;
			var errorMessage = trustedSiteIssue ? self.$rootScope.fxpUIConstants.UIMessages.LoadTimeAdalError.ErrorMessage :
				self.$rootScope.fxpUIConstants.UIMessages.LoadTimeAdalUnknownError.ErrorMessage;

			propBag.addToBag("Message", errorMessage);
			propBag.addToBag("AdalError", localStorage["adal.error"]);
			propBag.addToBag("AdalErrorDescription", adalErrorDescription);
			self.fxpMessage.addMessage(errorMessage, "error");
			self.fxpLoggerService.logError("Fxp.Bootstrap", "FxpBootstrapAdalError", "0002", null, propBag);
		}
	}

	private setDefaultAppRole() {
		this.$rootScope.defaultAppRole = "";
		let authStore = window["tenantConfiguration"].AuthStore;
		if (this.$rootScope.defaultAppRoleInternal) {
			this.$rootScope.defaultAppRole = this.$rootScope.defaultAppRoleInternal;
		}
		else if (!(authStore) || !(authStore.TenantClaimsEndPoint)) {
			this.$rootScope.defaultAppRole = window["tenantConfiguration"].defaultAppRole;
		}
	} 

	static appControllerHelperFactory($q, $rootScope, adalAuthenticationService, userProfileService, pageLoaderService, fxpTelemetryContext, fxpLoggerService, userInfoService, featureFlagService, startUpFlightConfig, settingsService, fxpContext, fxpMessage, deviceFactory, deviceDetector, plannedDownTimeService, fxpConfiguration, userClaimsService) {
		return new AppControllerHelper($q, $rootScope, adalAuthenticationService, userProfileService, pageLoaderService, fxpTelemetryContext, fxpLoggerService, userInfoService, featureFlagService, startUpFlightConfig, settingsService, fxpContext, fxpMessage, deviceFactory, deviceDetector, plannedDownTimeService, fxpConfiguration, userClaimsService);
	}
}
