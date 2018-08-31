/// <reference path="../../typings/angularjs/angular-cookies.d.ts" />
/// <reference path="../../typings/adal-angular/adal-angular.d.ts" />
import { CommonUtils } from "../utils/CommonUtils";
import { EnvironmentData } from "../telemetry/EnvironmentData";
import { PerfMarkers, ApplicationConstants, CustomEvents, FxpConstants } from "../common/ApplicationConstants";
import { IRootScope } from "../interfaces/IRootScope";
import { FxpAuthorizationService } from "../services/FxpAuthorizationService";
import { FxpConfigurationService } from "../services/FxpConfiguration";
import { FxpMessageService } from "../services/FxpMessageService";
import { FxpContext } from "../context/FxpContext";
import { TelemetryContext } from "../telemetry/telemetrycontext";
import { ILogger } from "../interfaces/ILogger";
import { PlannedDownTimeService } from "../services/PlannedDownTimeService";
import { UserProfileService } from "../services/userProfileService";
import { OBOUserService } from "../services/OBOUserService";
import { PageLoaderService } from "../services/pageLoaderService";
import { FxpStateTransitionService } from "../services/FxpStateTransitionService";
import { AppControllerHelper } from "../factory/AppControllerHelper";
import { PartnerAppRegistrationService } from "../services/PartnerAppRegistrationService";

declare type IStateService = any;
declare type IStateProvider = any;
declare type IUrlRouterProvider = any;

/**
 * @application  Fxp
 */

/**
       * A class that contains angular configurations for FXP app
       * @class Fxp.Boot.FxpBootstrap
       * @classdesc A class that contains angular configurations for FXP app,
       */
export class FxpBootstrap {
	/**
	* An angular configuration for Initializing context and window error handler
	* @method Fxp.Boot.FxpBootstrap.fxpInit
	*/
	public static fxpConfigInit = function ($provide: angular.auto.IProvideService) {
		if (CommonUtils.isNullOrEmpty(sessionStorage["startTime"]))
			sessionStorage["startTime"] = new Date();

		$provide.decorator("$exceptionHandler", ['$delegate', '$injector', '$window', 'FxpConfigurationService', 'FxpLoggerService', 'FxpTelemetryContext', 'FxpContextService', function ($delegate, $injector: angular.auto.IInjectorService, $window: angular.IWindowService, fxpConfiguration: FxpConfigurationService, fxpLoggerService: ILogger, FxpTelemetryContext: TelemetryContext, fxpContextService: FxpContext) {
			var environmentData = new EnvironmentData(fxpConfiguration.ModelConfiguration.EnvironmentName, fxpConfiguration.ModelConfiguration.ServiceOffering,
				fxpConfiguration.ModelConfiguration.ServiceLine, fxpConfiguration.ModelConfiguration.Program, fxpConfiguration.ModelConfiguration.Capability, fxpConfiguration.ModelConfiguration.ComponentName, fxpConfiguration.FxpAppSettings.ApplicationName, fxpConfiguration.ModelConfiguration.IctoId, fxpConfiguration.ModelConfiguration.BusinessProcessName);
			FxpTelemetryContext.setEnvironmentDetails("FXP", environmentData);
			if (fxpConfiguration.FxpBaseConfiguration != null && fxpConfiguration.FxpBaseConfiguration.PartnerTelemetryEnvironments != null) {
				FxpTelemetryContext.setPartnerEnvironmentDetails(fxpConfiguration.ModelConfiguration.EnvironmentName, fxpConfiguration.FxpBaseConfiguration.PartnerTelemetryEnvironments);
			}
			fxpContextService.saveContext(ApplicationConstants.BaseUrl, ApplicationConstants.FxpBaseUrl);
			fxpContextService.saveContext(ApplicationConstants.AssetsUrl, fxpConfiguration.FxpAppSettings.AssetsUrl);
			fxpContextService.saveContext(ApplicationConstants.BaseConfigDBName, fxpConfiguration.FxpBaseConfiguration);

			window["fxpLogger"] = fxpLoggerService; //adding for backward compatibility

			fxpLoggerService.logInformation('Fxp.BaseModule', 'FXPBooting');

			var windowOnError = function (msg, url, lineNo, columnNo, error) {
				var propbag = fxpLoggerService.createPropertyBag();
				propbag.addToBag("Url", url);
				propbag.addToBag("LineNo", lineNo);
				propbag.addToBag("ColumnNo", columnNo);
				propbag.addToBag("Type", "javascript");
				propbag.addToBag("Location", window.location.hash);
				fxpLoggerService.logError("Fxp.Client.GlobalException", msg, "3301", error ? error.stack : null, propbag);
			}

			$window.onerror = windowOnError;
			return function (exception, cause) {
				$delegate(exception, cause);
				var propbag = fxpLoggerService.createPropertyBag();
				propbag.addToBag("Type", "angularjs");
				propbag.addToBag("Location", window.location.hash);
				fxpLoggerService.logError("Fxp.Client.GlobalException", exception.message, "3301", exception.stack, propbag);
			};
		}]);
	}

	/**
	* An angular configuration method for setting Application theme
	* @method Fxp.Boot.FxpBootstrap.setSanitizedWhitelist
	*/
	public static setSanitizedWhitelist = function ($compileProvider: angular.ICompileProvider) {
		$compileProvider
			.imgSrcSanitizationWhitelist(/^\s*(https?|http|ms-appx|ms-appx-web|data|blob):/)
			.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
	}

	/**
	* An angular configuration method for settingdefault behaviour of httpProvider
	* @method Fxp.Boot.FxpBootstrap.configHttpProvider
	*/
	public static configHttpProvider = function ($httpProvider: angular.IHttpProvider) {
		var token;

		if (sessionStorage['adal.idtoken']) {
			token = 'Bearer ' + sessionStorage['adal.idtoken'];
		}
		$httpProvider.defaults.useXDomain = true;
		$httpProvider.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded; charset=utf-8";
		$httpProvider.defaults.headers.common['Authorization'] = token;
		$httpProvider.interceptors.push('FxpHttpCorrelationInterceptor', 'FxpHttpRetryInterceptor');
		delete $httpProvider.defaults.headers.common['X-Requested-With'];
	}

	/**
	 * An angular configuration method to register states
	 * @method Fxp.Boot.FxpBootstrap.registerRoutes
	 */
	public static registerRoutes = function ($stateProvider: IStateProvider, $urlRouterProvider: IUrlRouterProvider) {
		//TODO: Record the current Route and set it later
		if (window.location.hash.indexOf('id_token') == -1 && window.location.hash.indexOf('access_token') == -1 && window.location.hash != "#/") {
			sessionStorage[ApplicationConstants.RequestStateName] = window.location.hash.substring(1, window.location.hash.length);
		}

		$urlRouterProvider.otherwise('/');

		$stateProvider.state('Home', {
			url: "/",
			requireADLogin: true,
			data: { 'headerName': "Home" }
		});
	}

	/**
	* An angular configuration method to initialize adalAuthenticationServiceProvider
	* @method Fxp.Boot.FxpBootstrap.authenticationInit
	*/
	public static authenticationInit = function (adalAuthenticationServiceProvider: adal.AdalAuthenticationServiceProvider, $httpProvider: angular.IHttpProvider) {
		var config = window["ModelConfiguration"];
		var partnerEndpoints = FxpBootstrap.getRegisteredEndpoints();
		var endpoints = JSON.parse(JSON.stringify(eval("(" + "{" + config.Endpoints + "}" + ")")));
		endpoints = CommonUtils.jsonConcat(endpoints, partnerEndpoints);

		adalAuthenticationServiceProvider.init(
			{
				instance: config.Instance,
				tenant: config.Tenant,
				clientId: config.ClientId,
				extraQueryParameter: 'nux=1',
				endpoints: endpoints,
				cacheLocation: 'localStorage',
				frameRedirectUri: window.location.protocol + "//" + location.host + "/AdalIFrame.html?v=1"
			}, $httpProvider);
	}
	private static getRegisteredEndpoints = function () {
		var partnerApps = PartnerAppRegistrationService.getRegisteredPartnerApps();
		var partnerRegisteredEndpoints = {};
		Object.keys(partnerApps).forEach((key) => {
			var appInstance = new partnerApps[key]();
			var endpoints = appInstance.getRegisteredEndpoints();
			for (var i = 0; i < endpoints.length; i++) {
				if (!partnerRegisteredEndpoints[endpoints[i].ServiceEndpoint])
					partnerRegisteredEndpoints[endpoints[i].ServiceEndpoint] = endpoints[i].ClientId;
			}
		});
		return partnerRegisteredEndpoints;
	}

	/**
  * An angular Run for Initializing FXP APP
  * @method Fxp.Boot.FxpBootstrap.init
  */
	public static fxpRunInit = function ($cookies: angular.cookies.ICookiesService, $rootScope: IRootScope, adalAuthenticationService: adal.AdalAuthenticationService, userProfileService: UserProfileService, fxpMessage: FxpMessageService, fxpConfiguration: FxpConfigurationService, fxpContextService: FxpContext, fxpTelemetryContext: TelemetryContext, fxpLoggerService: ILogger, oboUserService: OBOUserService, pageLoaderService: PageLoaderService, timeout, appControllerHelper: AppControllerHelper) {

		oboUserService.initializeOBOEntityFromContext();
		$rootScope.isAuthenticated = false;
		$rootScope.fxpUIConstants = fxpConfiguration.FxpBaseConfiguration.FxpConfigurationStrings;
		if (fxpConfiguration.FxpBaseConfiguration == undefined) {
			fxpLoggerService.logError("FXP.Client.Shell", "Error in Config Service which returns null", "2904", null);
			fxpMessage.addMessage("System Error has occurred. Please try again. If the problem persists, please contact IT support.", FxpConstants.messageType.error);
		}
		fxpLoggerService.logInformation("Fxp.Boot", "Authenticating loader started");
		pageLoaderService.fnShowPageLoader($rootScope.fxpUIConstants.UIStrings.LoadingStrings.Authenticating, appControllerHelper.handleAdalErrorsAuthenticating);
		localStorage["adalConfig"] = JSON.stringify(adalAuthenticationService.config);
		if (sessionStorage[ApplicationConstants.RequestStateName] != undefined) {
			$cookies.put('requestedUrl', sessionStorage[ApplicationConstants.RequestStateName]);
		}

		if (!adalAuthenticationService.userInfo.isAuthenticated && adalAuthenticationService.userInfo.profile) {
			adalAuthenticationService.userInfo.isAuthenticated = true;
		}

		if (!adalAuthenticationService.userInfo.isAuthenticated) {
			$rootScope.$on('adal:loginSuccess', function () {
				fxpLoggerService.logInformation('adal:loginSuccess', 'login');
				FxpBootstrap.onLoginSuccess($cookies, adalAuthenticationService, fxpMessage, $rootScope, fxpContextService, fxpTelemetryContext, fxpLoggerService);
				$rootScope.isAuthenticated = true;
			})
		}
		else {
			FxpBootstrap.onLoginSuccess($cookies, adalAuthenticationService, fxpMessage, $rootScope, fxpContextService, fxpTelemetryContext, fxpLoggerService);
			$rootScope.isAuthenticated = true;
		}
	}

	/**
	 * A method that is called on every success login. sets the user contexts
	 * @method Fxp.Boot.FxpBootstrap.onLoginSuccess
	 */
	public static onLoginSuccess = function ($cookies: angular.cookies.ICookiesService, adalAuthenticationService: adal.AdalAuthenticationService, fxpMessage: FxpMessageService, $rootScope: IRootScope, fxpContextService: FxpContext, fxpTelemetryContext: TelemetryContext, fxpLoggerService: ILogger) {
		fxpLoggerService.logInformation("Fxp.Boot", "onLoginSuccess method started from fxpboot");
		fxpLoggerService.startTrackPerformance(PerfMarkers.FxpLoad);
		fxpLoggerService.startTrackPerformance(PerfMarkers.PreDashboardLoad);
		var requestedUrlCookie = $cookies.get('requestedUrl');
		sessionStorage[ApplicationConstants.RequestStateName] = requestedUrlCookie;

		$cookies.remove("requestedUrl");
		fxpTelemetryContext.setGeography(adalAuthenticationService.userInfo.profile.ipaddr);
		var sessionIdCached = window.sessionStorage.getItem(ApplicationConstants.FxpSessionKey)
		if (CommonUtils.isNullOrEmpty(sessionIdCached)) {
			var sessionId = fxpTelemetryContext.setNewUserSession(adalAuthenticationService.userInfo.userName);
			window.sessionStorage.setItem(ApplicationConstants.FxpSessionKey, sessionId);

			var propbag = fxpLoggerService.createPropertyBag();
			propbag.addToBag("UserId", adalAuthenticationService.userInfo.userName);
			propbag.addToBag("SessionId", sessionId);
			fxpLoggerService.logInformation('Fxp.BaseModule', CustomEvents.UserSessionCreated, propbag);
		}
		else
			var sessionId = fxpTelemetryContext.setNewUserSession(adalAuthenticationService.userInfo.userName, sessionIdCached);

		fxpContextService.saveContext("sessionId", sessionId);
		$rootScope.sessionId = sessionId;
		fxpLoggerService.logInformation("Fxp.Boot", "onLoginSuccess method ended from fxpboot");
	}

	/**
	* An angular Run for assigning rootScope Event handlers
	* @method Fxp.Boot.FxpBootstrap.rootScopeEventHandler
	*/
	public static rootScopeEventHandler = function ($rootScope: IRootScope, fxpAuthorizationService: FxpAuthorizationService, fxpConfigurationService: FxpConfigurationService, plannedDownTimeService: PlannedDownTimeService, $state: IStateService, fxpStateTransitionService: FxpStateTransitionService) {
		fxpStateTransitionService.onStateChangeStart(item => {
			console.log("onStartStateChange invoked");
			// next is an object that is the route that we are starting to go to
			// current is an object that is the route where we are currently
			var currentPath = item.fromState.name;
			var nextPath = item.toState.name;
			var preStateDuration = 0;
			var displayName = "";
			if (currentPath == nextPath) {
				$rootScope.startTime = 0;
			}

			$rootScope.stateChangeStartTime = performance.now();
			if ($rootScope.startTime) {
				preStateDuration = $rootScope.stateChangeStartTime - $rootScope.startTime;
				displayName = $rootScope.displayName || "";
			}
			console.log('Starting to leave %s to go to %s', currentPath, nextPath);

			$rootScope.$emit("resetPageLoadMetrics");
			$rootScope.pageLoadMetrics.pageTransitionStatus = "stateChangeStart";
			$rootScope.pageLoadMetrics.sourceRoute = currentPath;
			$rootScope.pageLoadMetrics.destinationRoute = nextPath;
			$rootScope.pageLoadMetrics.preStateDuration = preStateDuration;
			$rootScope.pageLoadMetrics.pageDisplayName = displayName;
			$rootScope.pageLoadMetrics.sourceRouteURL = item.fromState.templateUrl;
			$rootScope.pageLoadMetrics.destinationRouteURL = item.toState.templateUrl;

			fxpAuthorizationService.checkStatePermission(event, item.toState.name);

			if (plannedDownTimeService.isStateDown(nextPath)) {
				event.preventDefault();
				$state.go('SystemDown');
			}
		});
	}
}