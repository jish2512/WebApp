import { FxpBootstrap } from "./boot/fxpboot";
import { ISettingsServiceProvider } from "./interfaces/ISettingsServiceProvider";
import { FxpBotServiceProvider } from "./provider/FxpBotServiceProvider";
import { GlobalExceptionHandler } from './telemetry/GlobalExceptionHandler';
import { SettingsServiceProvider } from './provider/SettingsServiceProvider';
import { NonFxpApp } from './iframe_app/iframeAppController';
import { Fxp } from './module-declarations';
import { FxpConfigurationService } from "./services/FxpConfiguration";
import { FxpStateTransitionService } from "./services/FxpStateTransitionService";
import { FxpLoggerServiceExtension } from "./telemetry/FxpLoggerServiceExtension";
import { FxpLoggerService } from "./telemetry/FxpLogger";
import { UserProfileService } from "./services/userProfileService";
import { UserClaimsService } from "./services/UserClaimsService";
import { UserInfoService } from "./services/UserInfoService";
import { TimeZoneHelper } from "./services/TimeZoneHelper";
import { SystemMessagesService } from "./services/SystemMessagesService";
import { PlannedDownTimeService } from "./services/PlannedDownTimeService";
import { PersonalizationService } from "./services/PersonalizationService";
import { pageTourEventService } from "./services/pageTourEventService";
import { PageLoaderService } from "./services/pageLoaderService";
import { OBOUserService } from "./services/OBOUserService";
import { NotificationStore } from "./services/NotificationStore";
import { NotificationService } from "./services/NotificationService";
import { NotificationActionCenter } from "./services/NotificationActionCenter";
import { HelpCentralService } from "./services/HelpCentralService";
import { FxpToastNotificationService } from "./services/fxptoastnotificationservice";
import { FxpStorageService } from "./services/FxpStorageService";
import { FxpRouteService } from "./services/FxpRouteService";
import { FxpMessageService } from "./services/FxpMessageService";
import { FxpFeedbackService } from "./services/FxpFeedbackService";
import { FxpBreadcrumbService } from "./services/FxpBreadcrumbService";
import { FxpAuthorizationService } from "./services/FxpAuthorizationService";
import { DashboardService } from "./services/dashboardService";
import { AdminLandingService } from "./services/AdminLandingService";
import { TelemetryConfiguration } from "./telemetry/TelemetryConfiguration";
import { FxpOnlineLoggingStrategy } from "./telemetry/FxpOnlineLoggingStrategy";
import { FxpLoggingStrategyFactory } from "./telemetry/FxpLoggingStrategyFactory";
import { TelemetryContext } from "./telemetry/telemetrycontext";
import { PouchDBProvider } from "./common/PouchDBProvider";
import { FxpContext } from "./context/FxpContext";
import { httpCorrelationInterceptor, httpRetryInterceptor } from "./factory/FxpHttpInterceptorFactory";
import { AppControllerHelper } from "./factory/AppControllerHelper";
import { DeviceFactoryProvider } from "./utils/device.factory";
import { SYSTEM_MESSAGE_UI } from "./constants/systemMessages.constants";
import { AppController } from "./controllers/appCntrl";
import { FxpUIData } from "./factory/FxpUIDataFactory";
import { SessionTimeoutModalFactory } from "./factory/SessionTimeoutModalFactory";
import { SessionTimeoutModalConstant } from "./constants/SessionTimeoutModal.constants";
import { ToastNotificationController } from "./controllers/toastNotificationController";
import { DataService } from "./services/DataService";
import { FxpHttpService } from "./services/FxpHttpService";
import { ActOnBehalfOfController } from "./controllers/actOnBehalfOfController";
import { AdminLandingController } from "./controllers/AdminLandingController";
import { CreateAskOpsController } from "./controllers/createAskOpsController";
import { DashBoardController } from "./controllers/dashBoardController";
import { FooterController } from "./controllers/footerController";
import { HelpArticleImageController } from "./controllers/HelpArticleImageController";
import { HelpController } from "./controllers/helpcontroller";
import { LeftNavController } from "./controllers/LeftNavController";
import { LeftNavPersonalizationController } from "./controllers/leftNavPersonalizationController";
import { NotificationsController } from "./controllers/notificationController";
import { PowerBiPageController } from "./controllers/powerBIPageController";
import { RoleNavPersonalizationController } from "./controllers/roleNavPersonalizationController";
import { SessionTimeoutModalController } from "./controllers/SessionTimeoutModalController";
import { SystemMessagesController } from "./controllers/systemMessagesController";
import { UserLookupPersonalizationController } from "./controllers/userLookupPersonalizationController";
import { CreateAskOpsModalConstant } from "./constants/CreateAskOpsRequest.constants";
import { AuthorNotificationConstant } from "./constants/AuthorNotification.constants";
import { HelpArticleImageModalConstant } from "./constants/HelpArticle.constants";
import { SkipToMainContent } from "./directives/fxpSkipToMainContent.directive";
import { AuthorNotificationConfirmationController, AuthorNotificationController } from "./controllers/authorNotificationController";
import { FxpUIStateHelperProvider } from "./provider/UIStateHelperProvider";
import { DashBoardHelper } from "./factory/DashBoardHelper";
import { ActOnBehalfOfHelper } from "./factory/ActOnBehalfOfHelper";
import { AuthorNotificationRoleGroupHelper } from "./factory/AuthorNotificationRoleGroupHelper";
import { ChangeTabIndexByClassDirective } from "./directives/changeTabIndexByClass";
import { AuthorNotificationContentDirective } from "./directives/fxpAuthorNotification.directive";
import { FxpAuthorNotificationListDirective } from "./directives/fxpAuthorNotificationList.directives";
import { BreadcrumbDirectives } from "./directives/fxpbreadcrumb.directive";
import { fxpBreadcrumbLink } from "./directives/fxpBreadcrumbLink";
import { fxpChoiceItem } from "./directives/fxpChoiceControl.directive";
import { FxpGoToTopDirective } from "./directives/fxpGoToTop.directive";
import { FxpHelpDirectives } from "./directives/fxpHelpEvents";
import { FxpIncludeStaticTemplate } from "./directives/fxpIncludeStaticTemplate";
import { FxpComponentDirectives } from "./directives/fxpItems.directive";
import { FxpKeyDownDirective } from "./directives/fxpKeyDown.derective";
import { fxpLeftNavKeydown } from "./directives/fxpleftnavkeydown";
import { LeftnavLink } from "./directives/fxpLeftnavLink";
import { FxpNotification } from "./directives/fxpNotificationKeyEventHandler.directive";
import { FxpNotificationSetFocusDirective } from "./directives/fxpNotificationSetFocus.directive";
import { FxpSetFocusToElement } from "./directives/fxpSetFocus";
import { FxpShowIfDeviceDirective } from "./directives/fxpShowIfDevice";
import { fxpSystemMessageRow, fxpSystemMessagePopupDirective } from "./directives/fxpSystemMessage.directives";
import { FxpToastNotificationDirectives } from "./directives/fxptoastnotification.directive";
import { LeftNavOutsideClickDirective } from "./directives/leftNavOutsideClick";
import { RenderNavElementsForKeydownDirective } from "./directives/leftNavPersonalization.directive";
import { LeftNavPrsonalizationAdjustScrollDirective } from "./directives/leftNavPersonalizationAdjustScroll.directive";
import { RenderPopUpForKeydownDirective } from "./directives/leftNavPersonalizationPopUp.directive";
import { LeftNavPersonalizationScreenReaderDirective } from "./directives/leftNavPersonalizationScreenReader";
import { LeftNavPersonalizationScrollToActiveDirective } from "./directives/leftNavPersonalizationScrollToActive";
import { MultilineEllipsisDirective } from "./directives/multilineellipsis";
import { MultilineEllipsisWithAccordionDirective } from "./directives/multilineEllipsisWithAccordion";
import { IntervalFlipDirective } from "./directives/ngLongPress";
import { FeedbackFlyoutDirective } from "./directives/ngRightClick";
import { ScrollToTopDirective } from "./directives/scrolltotopdirective";
import { Resiliency } from "./resiliency/FxpResiliency";
import { AdalLoginHelperService } from "./services/AdalLoginHelperService";
import { UnCamelCase } from "./filters/unCamelCase.filter";
import { AppDirectives } from "./directives/AppDirectives";
import { AdminLandingDirective } from "./directives/adminLanding.directive";
import { FxpProviders } from "./provider/CorrelationProvider";
import { Subject } from "rxjs";
import { FeatureFlagAngular1Module } from '@fxp/flightingsdk';
import { ConfitAngular1Module } from '@fxp/confitsdk';
import { FxpEventBroadCastService } from "./services/BroadCastingService"; 



FeatureFlagAngular1Module.registerModule();

ConfitAngular1Module.registerModule();

declare type FeatureFlagServiceProvider = any;

'use strict';
var di = ['oc.lazyLoad', NonFxpApp, 'vx.grid.modules', 'AdalAngular', 'ui.router', 'ui.bootstrap', 'ngAnimate', 'ngResource', 'ngSanitize',
	'ngRoute', 'FXPComponents', 'FxpUtils', 'Telemetry', 'ngCookies', ConfitAngular1Module.ConfitNg1ModuleName, 'angularCSS', 'angularMoment', 'moment-picker',
	'ngMessages', 'ngScrollbars', 'Microsoft.PS.Feedback', FeatureFlagAngular1Module.FlightingNg1ModuleName, 'ActivityMonitor', 'base64', 'ng-showdown', 'ng.deviceDetector', 'ui.router.state.events'];

//To remove cannot find name error
var PartnerModules = PartnerModules || window["PartnerModules"] || [];
var FxpAppSettings = FxpAppSettings || window["FxpAppSettings"] || {};
var OcModules = OcModules || window["OcModules"] || [];
var PreLoadModules = PreLoadModules || window["PreLoadModules"] || [];
if (PartnerModules)
	di = di.concat(PartnerModules);

angular
	.module('FxpUtils', [])
	.service('AdalLoginHelperService', ['$q', '$resource', 'adalAuthenticationService', AdalLoginHelperService]);

var fxpModule = angular.module('FxPApp', di)
	.constant('confitRootUrl', FxpAppSettings.ConfitServiceEndPoint)
	.constant('StartUpFlightConfig', {
		appName: FxpAppSettings.ApplicationName,
		envName: FxpAppSettings.FlightingEnvironmentName,
		featureNames: [
			'botEnabled',
			'breadcrumbEnabled',
			'feedbackEnabled',
			'pageTourEnabled',
			'notificationsEnabled',
			'flashEnabled',
			'sessionTimeOutEnabled',
			'askOpsEnabled',
			'contextualHelpEnabled'
		]
	})
	.constant('CreateAskOpsModalConstant', CreateAskOpsModalConstant)
	.constant('AuthorNotificationConstant', AuthorNotificationConstant)
	.constant('HelpArticleImageModalConstant', HelpArticleImageModalConstant);

// Providers 

/* Naming the service as "fxpLoggerService" since the same is is exposed to partner apps
 *  Should change it to FxpLoggerService to be in sync with other service names
 */
angular.module('Telemetry', [])
	.service('TelemetryConfiguration', [TelemetryConfiguration])
	.service('fxpLoggerService', ['TelemetryConfiguration', 'FxpLoggingStrategyFactory', 'FxpConfigurationService', 'FxpLoggerServiceExtension', FxpLoggerService]) // for Backward Compatibility
	.service('FxpLoggerService', ['TelemetryConfiguration', 'FxpLoggingStrategyFactory', 'FxpConfigurationService', 'FxpLoggerServiceExtension', FxpLoggerService])
	.service('FxpOnlineLoggingStrategy', ['TelemetryConfiguration', 'Microsoft.ApplicationInsights.AppInsights', 'FxpTelemetryContext', FxpOnlineLoggingStrategy])
	.service('FxpLoggerServiceExtension', [FxpLoggerServiceExtension]);

fxpModule
	.provider('SettingsService', SettingsServiceProvider)
	.provider('FxpBotService', FxpBotServiceProvider)
	.provider('DeviceFactory', [DeviceFactoryProvider])
	.provider('UIStateHelper', ['$stateProvider', '$urlRouterProvider', FxpUIStateHelperProvider.UIStateHelperProvider]);

fxpModule.constant('SYSTEM_MESSAGE_UI', SYSTEM_MESSAGE_UI)
	.constant('SessionTimeoutModalConstant', SessionTimeoutModalConstant);

fxpModule.service('FxpConfigurationService', [FxpConfigurationService])
	.service('FxpHttpService', ['$http', FxpHttpService])
    .service('FxpEventBroadCastService', ['$rootScope', FxpEventBroadCastService])
    .service('FxpStateTransitionService', ['$injector', '$state', FxpStateTransitionService])
	.service('UserProfileService', ['$http', '$q', '$rootScope', '$timeout', 'FxpLoggerService', 'AdalLoginHelperService', 'FxpMessageService', 'FxpContextService', 'FxpConfigurationService', 'FxpTelemetryContext', 'UserInfoService','UserClaimsService', UserProfileService])
	.service('UserClaimsService', ['$http', '$q', '$rootScope', '$timeout', 'FxpLoggerService', 'AdalLoginHelperService', 'FxpMessageService', 'FxpContextService','UserInfoService', UserClaimsService])
	.service('UserInfoService', [UserInfoService])
	.service('TimeZoneHelper', ['moment', TimeZoneHelper])
	.service('SystemMessagesService', ['$http', 'FxpConfigurationService', SystemMessagesService])
	.service('PlannedDownTimeService', ['$timeout', 'FxpConfigurationService', 'SystemMessagesService', 'TimeZoneHelper',
		'moment', 'SYSTEM_MESSAGE_UI', 'FxpLoggerService', '$window', PlannedDownTimeService])
	.service('PersonalizationService', ['$http', '$q', '$rootScope', 'FxpConfigurationService', '$timeout', 'FxpLoggerService', 'AdalLoginHelperService', 'FxpMessageService', PersonalizationService])
	.service('PageTourEventService', ['$rootScope', 'UserProfileService', pageTourEventService])
	.service('PageLoaderService', ['$http', '$rootScope', '$timeout', 'FxpConfigurationService', PageLoaderService])
	.service('OBOUserService', ['$rootScope', 'FxpContextService', '$q', 'FxpMessageService', 'UserInfoService', 'UserProfileService','UserClaimsService', OBOUserService])
	.service("NotificationStore", [
		'$rootScope',
		'$q',
		'NotificationService',
		NotificationStore
	]
	)
	.service('NotificationService', ['$http', 'FxpConfigurationService', 'DataService', NotificationService])
	.service("NotificationActionCenter", [
		'$rootScope',
		'$state',
		'FxpConfigurationService',
		'FxpRouteService',
		NotificationActionCenter
	]
	)
	.service('HelpCentralService', ['$http', 'FxpConfigurationService', 'UserInfoService','DeviceFactory', HelpCentralService])
	.service('FxpToastNotificationService', [
		'$rootScope',
		'NotificationStore',
		'FxpLoggerService',
		FxpToastNotificationService])
	.service('FxpStorageService', ['$window', FxpStorageService])
	.service('fxpRouteService', ['$state', '$rootScope', 'FxpLoggerService', 'UserProfileService', 'UserInfoService', 'FxpBreadcrumbService', FxpRouteService]) //for backward compatibility
	.service('FxpRouteService', ['$state', '$rootScope', 'FxpLoggerService', 'UserProfileService', 'UserInfoService', 'FxpBreadcrumbService', FxpRouteService])
	.service('fxpMessage', ['$rootScope', '$interval', '$timeout', 'FxpConfigurationService', 'FxpLoggerService', FxpMessageService]) //For backward compatibility
	.service('FxpMessageService', ['$rootScope', '$interval', '$timeout', 'FxpConfigurationService', 'FxpLoggerService', FxpMessageService])
	.service('FxpFeedbackService', ['FxpLoggerService', '$rootScope', 'UserInfoService', 'FxpTelemetryContext', 'UserProfileService', FxpFeedbackService])
	.service('FxpBreadcrumbService', ['$state', '$q', '$rootScope', 'FxpStorageService', 'UserInfoService', 'DashboardService', 'FxpConfigurationService', 'FxpLoggerService', 'FxpTelemetryContext', FxpBreadcrumbService])
	.service("FxpAuthorizationService", ["$state", "$rootScope", "FxpLoggerService", "UserClaimsService", "UserInfoService", "FxpConfigurationService", FxpAuthorizationService])
	.service('DashboardService', ['$http', '$q', '$rootScope', 'FxpConfigurationService', '$timeout', 'FxpLoggerService', 'AdalLoginHelperService', 'FxpMessageService', 'UserInfoService', 'PageLoaderService', 'FxpTelemetryContext', 'UserProfileService', DashboardService])
	.service('AdminLandingService', ['$http', '$q', '$rootScope', '$timeout','FxpConfigurationService', 'FxpLoggerService', 'AdalLoginHelperService', 'FxpMessageService', 'UserClaimsService','UserInfoService', '$base64',  AdminLandingService])
	.service('FxpLoggingStrategyFactory', [FxpLoggingStrategyFactory])
	.service('FxpTelemetryContext', [TelemetryContext])
	.service('PouchDBProvider', [PouchDBProvider])
	.service('FxpContextService', ['PouchDBProvider', FxpContext])
	.service('DataService', ['$http', '$q', '$timeout', 'AdalLoginHelperService', 'FxpLoggerService', DataService]);

fxpModule
	.factory('FxpHttpCorrelationInterceptor', ['UserInfoService', 'FxpConfigurationService', 'FxpLoggerService', httpCorrelationInterceptor])
	.factory('FxpHttpRetryInterceptor', ['$q', '$injector', '$timeout', 'FxpConfigurationService', 'FxpLoggerService', '$rootScope', httpRetryInterceptor])
    .factory("AppControllerHelper", ['$q', '$rootScope', 'adalAuthenticationService', 'UserProfileService', 'PageLoaderService', 'FxpTelemetryContext', 'FxpLoggerService', 'UserInfoService', 'FeatureFlagService', 'StartUpFlightConfig', 'SettingsService', 'FxpContextService', 'FxpMessageService', 'DeviceFactory', 'deviceDetector', 'PlannedDownTimeService', 'FxpConfigurationService','UserClaimsService', AppControllerHelper.appControllerHelperFactory])
	.factory('FxpUIData', ['$rootScope', 'FxpFeedbackService', FxpUIData.getUIDataFactoryObj])
	.factory('SessionTimeoutModalFactory', ['$uibModal', 'FxpConfigurationService', 'FxpLoggerService', 'SessionTimeoutModalConstant', 'ActivityMonitor', SessionTimeoutModalFactory.getUIDataFactoryObj])
	.factory('DashBoardHelper', ['$rootScope', '$state', 'UIStateHelper', 'FxpLoggerService', 'FxpTelemetryContext',
		'FxpContextService', 'FxpRouteService', '$location', 'PageLoaderService','FxpConfigurationService', '$injector', 'AppControllerHelper', 'UserInfoService', DashBoardHelper.DashBoardHelperFactory])
	.factory("ActOnBehalfOfHelper", ['$rootScope', '$http', '$q', 'UserProfileService', 'FxpLoggerService', 'FxpMessageService', 'adalAuthenticationService', 'FxpContextService', 'FxpTelemetryContext', 'UserInfoService', ActOnBehalfOfHelper.ActOnBehalfOfHelperFactory])
	.factory('AuthorNotificationRoleGroupHelper', [AuthorNotificationRoleGroupHelper.AuthorNotificationRoleGroupHelper]);

fxpModule.controller('AppController', AppController)
	.controller('ToastNotificationController', [
		"$scope",
		"$rootScope",
		"$window",
		"$timeout",
		"FxpConfigurationService",
		"NotificationStore",
		"NotificationActionCenter",
		"FxpMessageService",
		'FxpLoggerService',
		ToastNotificationController
	])
	.controller('ActOnBehalfOfController', ActOnBehalfOfController)
	.controller('AdminLandingController', AdminLandingController)
	.controller('AuthorNotificationConfirmationController', ['$uibModalInstance', AuthorNotificationConfirmationController])
	.controller('AuthorNotificationController', ['$scope', '$rootScope', '$uibModal', '$state', '$timeout', 'UserProfileService', 'FxpLoggerService', 'FxpRouteService', 'NotificationStore', 'FxpMessageService', 'FxpConfigurationService', 'PageLoaderService', 'AuthorNotificationConstant', 'PersonalizationService', 'AuthorNotificationRoleGroupHelper', '$window', AuthorNotificationController])
	.controller('CreateAskOpsController', [
		'$rootScope',
		'$window',
		'$uibModalInstance',
		'FxpLoggerService',
		'SettingsService',
		'FxpMessageService',
		'defaultRequestType',
		CreateAskOpsController
	])
	.controller('DashBoardController', ['$scope', 'UIStateHelper', '$rootScope', 'FxpLoggerService', 'adalAuthenticationService', 'UserProfileService', 'UserInfoService', 'FxpMessageService', 'OBOUserService', 'DashBoardHelper', 'FxpTelemetryContext', 'FxpContextService', 'FxpConfigurationService', 'DashboardService', 'FxpFeedbackService', '$state', DashBoardController])
	.controller('FooterController', ['$scope', 'FxpLoggerService', 'FxpConfigurationService', FooterController])
	.controller('HelpArticleImageController', ['$uibModalInstance', 'source', HelpArticleImageController])
	.controller('HelpController',
		[
			'$scope',
			'$rootScope',
			'$location',
			'FxpConfigurationService',
			'PageLoaderService',
			'FxpLoggerService',
			'DeviceFactory',
			'DashBoardHelper',
			'$state',
			'$timeout',
			'$window',
			'$uibModal',
			'CreateAskOpsModalConstant',
			'HelpArticleImageModalConstant',
			'HelpCentralService',
			HelpController
		])
	.controller('LeftNavController', LeftNavController)
	.controller('LeftNavPersonalizationController', LeftNavPersonalizationController)
	.controller('NotificationsController', [
		'$rootScope',
		'$scope',
		'$window',
		'$interval',
		'FxpConfigurationService',
		'$timeout',
		'NotificationStore',
		'NotificationActionCenter',
		'FxpToastNotificationService',
		'FxpLoggerService',
		'SettingsService',
		'UserInfoService',
		'FxpMessageService',
		'FxpContextService',
		'DeviceFactory',
		NotificationsController])
	.controller('PowerBiPageController', PowerBiPageController)
	.controller('RoleNavPersonalizationController', RoleNavPersonalizationController)
	.controller('SessionTimeoutModalController', ['FxpLoggerService', SessionTimeoutModalController])
	.controller('SystemMessagesController', ['$scope', 'FxpLoggerService', 'FxpMessageService', 'TimeZoneHelper', 'SystemMessagesService', 'PersonalizationService', 'PageLoaderService', 'UserInfoService', 'SYSTEM_MESSAGE_UI', '$timeout', SystemMessagesController])
	.controller('UserLookupPersonalizationController', UserLookupPersonalizationController) 
fxpModule
	.config(['$provide', FxpBootstrap.fxpConfigInit])
	.config(['$compileProvider', FxpBootstrap.setSanitizedWhitelist])
	.config(['adalAuthenticationServiceProvider', '$httpProvider', FxpBootstrap.authenticationInit])
	.config(['$httpProvider', FxpBootstrap.configHttpProvider])
	.config(['$stateProvider', '$urlRouterProvider', FxpBootstrap.registerRoutes])
	.config(['$sceProvider', function ($sceProvider: angular.ISCEProvider) {
		$sceProvider.enabled(false);
	}])
	.config(['SettingsServiceProvider', function (SettingsServiceProvider: ISettingsServiceProvider) {
		SettingsServiceProvider.configure({ settingsServiceBaseUrl: FxpAppSettings.FxpServiceEndPoint });
	}])
	.config(['FxpBotServiceProvider', function (FxpBotServiceProvider: FxpBotServiceProvider) {
		FxpBotServiceProvider.configure({
			AppID: FxpAppSettings.ConnectMeBotAppId,
			TopicID: FxpAppSettings.ConnectMeBotTopicId,
			Url: FxpAppSettings.ConnectMeBotEndpoint
		});
	}])
	.config(['FeatureFlagServiceProvider', function (FeatureFlagServiceProvider: FeatureFlagServiceProvider) {
		FeatureFlagServiceProvider.configure({
			ServiceEndpoint: FxpAppSettings.FlightingServiceEndpoint
		}, {});
	}])
	.config(['$ocLazyLoadProvider', function ($ocLazyLoadProvider) {
		$ocLazyLoadProvider.config({
			loadedModules: di,
			modules: OcModules,
			debug: false
		});
	}])
	.run(['$cookies', '$rootScope', 'adalAuthenticationService', 'UserProfileService', 'FxpMessageService', 'FxpConfigurationService', 'FxpContextService', 'FxpTelemetryContext', 'FxpLoggerService', 'OBOUserService', 'PageLoaderService', '$timeout', 'AppControllerHelper', FxpBootstrap.fxpRunInit])
    .run(['$rootScope', 'FxpAuthorizationService', 'FxpConfigurationService', 'PlannedDownTimeService', '$state', 'FxpStateTransitionService', FxpBootstrap.rootScopeEventHandler])
	.run(['$rootScope', function ($rootScope) {
		$rootScope.BuildNumber = FxpAppSettings.BuildNumber;
	}]);

let fxpKeyDownDirective: any = FxpKeyDownDirective.fxpEnterKeyPressDirective;
let setToFocusDirective: any = FxpSetFocusToElement.fxpSetFocus;
var clickDirective: any = AppDirectives.fxpClickDirective;

angular
	.module('FXPComponents', [])
	.directive('fxpfooter', FxpComponentDirectives.fxpfooter)
	.directive('fxpheader', FxpComponentDirectives.fxpheader)
	.directive('fxpleftnavigation', FxpComponentDirectives.fxpleftnavigation)
	.directive('actOboHeader', FxpComponentDirectives.fxpOboHeader)
	.directive('pageLoader', FxpComponentDirectives.pageLoader)
	.directive('fxpbreadcrumb', FxpComponentDirectives.fxpbreadcrumb)
	.directive('fxphelpmenu', FxpComponentDirectives.fxphelpmenu)
	.directive('fxpnotification', FxpComponentDirectives.fxpnotification)
	.directive('fxpsystemupdatemsg', FxpComponentDirectives.fxpsystemupdatemsg)
	.directive('fxptoastnotification', FxpComponentDirectives.fxptoastnotification);

fxpModule
	.directive('skipToMainContent', SkipToMainContent.getDirective)
	.directive('changeTabIndexByClass', ChangeTabIndexByClassDirective.changeTabIndexByClass)
	.directive('authorNotificationContent', AuthorNotificationContentDirective.authorNotificationContent)
	.directive('fxpAuthorNotificationRow', FxpAuthorNotificationListDirective.fxpAuthorNotificationRow)
	.directive('renderFxpBreadcrumb', BreadcrumbDirectives.renderFxpBreadcrumb)
	.directive('breadcrumbFocusContentAria', BreadcrumbDirectives.breadcrumbFocusContentAria)
	.directive('fxpBreadcrumbLink', fxpBreadcrumbLink.fxpBreadcrumbLinksDirective)
	.directive('fxpChoiceItem', fxpChoiceItem)
	.directive('fxpGoToTop', FxpGoToTopDirective.fxpGoToTop)
	.directive('fxpHelpEvents', FxpHelpDirectives.fxpHelpEvents)
	.directive('fxpHelp', FxpHelpDirectives.fxpHelp)
	.directive('fxpHelpArticle', FxpHelpDirectives.fxpHelpArticle)
	.directive('fxpHelpOutsideClick', FxpHelpDirectives.fxpHelpOutsideClick)
	.directive('fxpIncludeStaticTemplate', [() => new FxpIncludeStaticTemplate()])
	.directive('fxpKeyDown', fxpKeyDownDirective)
	.directive('fxpLeftNavKeydown', fxpLeftNavKeydown)
	.directive('fxpLeftnavLink', LeftnavLink.fxpLeftnavLinkDirective)
	.directive('fxpNotificationDirective', FxpNotification.fxpNotificationDirective)
	.directive('fxpNotificationSetFocus', FxpNotificationSetFocusDirective.fxpNotificationSetFocus)
	.directive('fxpSetFocus', setToFocusDirective)
	.directive('fxpShowIfDevice', ['$parse', '$rootScope', 'DeviceFactory', FxpShowIfDeviceDirective.fxpShowIfDevice])
	.directive('fxpSystemMessageRow', fxpSystemMessageRow)
	.directive('fxpSystemMessagePopupDirective', fxpSystemMessagePopupDirective)
	.directive('fxpToastNotification', FxpToastNotificationDirectives.fxpToastNotification)
	.directive('fxpToastNotificationContainer', FxpToastNotificationDirectives.fxpToastNotificationContainer)
	.directive('leftNavOutsideClick', ['$rootScope', '$document', '$parse', LeftNavOutsideClickDirective.leftNavOutsideClick])
	.directive('renderNavElementsForKeydown', RenderNavElementsForKeydownDirective.renderNavElementsForKeydown)
	.directive('leftNavPrsonalizationAdjustScroll', LeftNavPrsonalizationAdjustScrollDirective.leftNavPrsonalizationAdjustScroll)
	.directive('renderPopUpForKeydown', RenderPopUpForKeydownDirective.renderPopUpForKeydown)
	.directive('leftNavPersonalizationScreenReader', LeftNavPersonalizationScreenReaderDirective.leftNavPersonalizationScreenReader)
	.directive('leftNavPersonalizationScrollToActive', LeftNavPersonalizationScrollToActiveDirective.leftNavPersonalizationScrollToActive)
	.directive('multilineEllipsis', MultilineEllipsisDirective.multilineEllipsis)
	.directive('multilineEllipsisWithAccordion', MultilineEllipsisWithAccordionDirective.multilineEllipsisWithAccordion)
	.directive('ngLongPress', ['$timeout', IntervalFlipDirective.intervalFlip])
	.directive('ngRightClick', ['$parse', FeedbackFlyoutDirective.feedbackFlyout])
	.directive('scrollToTop', ScrollToTopDirective)
	.directive('fxpClick', clickDirective);

fxpModule.filter('unCamelCase', [UnCamelCase.getSpacedString]);

fxpModule
	.directive('adminLanding', AdminLandingDirective.adminLanding)
AdminLandingDirective.adminLanding.$inject = ["$timeout"];


fxpModule
	.provider('FxpCorrelationProvider', [FxpProviders.CorrelationProvider])


//fxpModule.requires = Resiliency.getResilientModules(fxpModule.requires);

// This must be imported in the end
import "./module-declarations";











