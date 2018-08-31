/// <reference path="../typings/jasmine.d.ts" />
import * as angular from 'angular';
import { UserInfoService } from '../js/services/UserInfoService';
import { FxpRouteService } from '../js/services/FxpRouteService';
import {PersonalizationService} from '../js/services/PersonalizationService';
import {LeftNavController} from '../js/controllers/leftNavController';
import {OBOUserService} from '../js/services/OBOUserService';
import { AdalLoginHelperService } from '../js/services/AdalLoginHelperService';
import {FxpAuthorizationService} from '../js/services/FxpAuthorizationService';
import {AdminLandingService} from '../js/services/AdminLandingService';
import {FxpMessageService} from '../js/services/FxpMessageService';
import {httpCorrelationInterceptor,httpRetryInterceptor} from '../js/factory/FxpHttpInterceptorFactory'
import {FxpBreadcrumbService} from '../js/services/FxpBreadcrumbService';
import {FxpConfigurationService} from '../js/services/FxpConfiguration';
import {FxpFeedbackService}from '../js/services/FxpFeedbackService';
import { AppController } from '../js/controllers/appCntrl';
import {AppControllerHelper} from '../js/factory/AppControllerHelper';
import{DashboardService}from '../js/services/dashboardService';
import {DashBoardController}from '../js/controllers/dashBoardController';
import { DashBoardHelper } from '../js/factory/DashBoardHelper';
import {ActOnBehalfOfHelper} from '../js/factory/ActOnBehalfOfHelper';
import { ActOnBehalfOfController } from '../js/controllers/actOnBehalfOfController';
import {CreateAskOpsController} from '../js/controllers/createAskOpsController';
import {AuthorNotificationRoleGroupHelper} from '../js/factory/AuthorNotificationRoleGroupHelper';
import {AuthorNotificationController,AuthorNotificationConfirmationController} from '../js/controllers/authorNotificationController';
import { fxpBreadcrumbLink } from '../js/directives/fxpBreadcrumbLink';
import { FxpComponentDirectives } from '../js/directives/fxpItems.directive';
import { LeftnavLink } from '../js/directives/fxpLeftnavLink';
import{SessionTimeoutModalFactory} from '../js/factory/SessionTimeoutModalFactory';
import {FxpStorageService} from '../js/services/FxpStorageService';
import {FxpToastNotificationService} from '../js/services/FxpToastNotificationService';
import {FxpUIData} from '../js/factory/FxpUIDataFactory';
import { HelpArticleImageController } from '../js/controllers/HelpArticleImageController';
import {HelpCentralService} from '../js/services/HelpCentralService';
import {HelpController} from '../js/controllers/helpController';
import { NotificationsController } from '../js/controllers/notificationController';
import { LeftNavPersonalizationController } from '../js/controllers/leftNavPersonalizationController';
import { NotificationActionCenter } from '../js/services/NotificationActionCenter';
import { NotificationService } from '../js/services/NotificationService';
import { NotificationStore } from '../js/services/NotificationStore';
import {pageTourEventService} from '../js/services/pageTourEventService';
import {RoleNavPersonalizationController} from '../js/controllers/roleNavPersonalizationController';
import {SettingsServiceProvider} from '../js/provider/SettingsServiceProvider';
import {SystemMessagesController} from '../js/controllers/systemMessagesController';
import {SystemMessagesService} from '../js/services/SystemMessagesService';
import { ISettingsServiceProvider } from "../js/interfaces/ISettingsServiceProvider";
import { TelemetryContext } from '../js/telemetry/telemetrycontext';
import { ToastNotificationController } from '../js/controllers/toastNotificationController';
import { UserLookupPersonalizationController } from '../js/controllers/userLookupPersonalizationController';
import { FxpOnlineLoggingStrategy } from "../js/telemetry/FxpOnlineLoggingStrategy";
import { FxpStateTransitionService } from '../js/services/FxpStateTransitionService';
angular.module("FXPComponents", [])
.directive('fxpfooter', FxpComponentDirectives.fxpfooter)
.directive('fxpheader', FxpComponentDirectives.fxpheader)
.directive('fxpleftnavigation', FxpComponentDirectives.fxpleftnavigation)
//.directive('fxpmessage', FxpComponentDirectives.fxpmessage)
.directive('actOboHeader', FxpComponentDirectives.fxpOboHeader)
.directive('pageLoader', FxpComponentDirectives.pageLoader)
.directive('fxpbreadcrumb', FxpComponentDirectives.fxpbreadcrumb)
.directive('fxphelpmenu', FxpComponentDirectives.fxphelpmenu)
.directive('fxpnotification', FxpComponentDirectives.fxpnotification)
.directive('fxpsystemupdatemsg', FxpComponentDirectives.fxpsystemupdatemsg)
.directive('fxptoastnotification', FxpComponentDirectives.fxptoastnotification);

angular.module("FxPApp", [])   
	.provider('SettingsService', SettingsServiceProvider)
	.constant('fxpConstants', {
		messageType: {
			error: "error",
			warning: "warning",
			info: "info",
			success: "success"
		},
		metricConstants: {
			getBasicProfileSvcName: "Get Basic Profile Service",
			getUserClaimsSvcName: "Get User Claims Service",
			FXPApplicationLaunchMetric: "FXP Application Launch Metric",
			Status: "Status",
			StatusText: "StatusText",
			StartTime: "StartTime",
			EndTime: "EndTime",
			ServiceName: "ServiceName",
			ServiceURL: "ServiceURL",
			UserAgent: "UserAgent",
			UserProfileService: "Fxp.UserProfileService",
			FxpAppLaunch: "Fxp.AppLaunch",
			SessionId: "SessionId",
			userupn: "UserUPN",
			userBusinessRole: "UserBusinessRole",
			geography: "Geography"
		}
	}).run(['$rootScope', function ($rootScope) {
		$rootScope.fxpUIConstants = {
			"UIMessages": {
				"errorMessage": "Please try this action again. If the issue persists, please reach out to <SMAPLEALAIS>@microsoft.com to get help. Please include further details about the action you were attempting, when the issue occurred.",
				"errorMessageTitle": "An error has occurred.",
				"ProfileServiceCallFailedError": {
					"ErrorMessage": "System Error has occurred: Unable to retrieve your  profile information. Please try again",
					"ErrorMessageTitle": "Error in getBasicProfile from service"
				},
				"AuthServiceReturnsBlankAppError": {
					"ErrorMessage": "Your profile does not have permissions to access this content. Please contact IT support.",
					"ErrorMessageTitle": "Error in getUserClaims from service which Returns Error"
				},
				"AADAuthFailureError": {
					"ErrorMessage": "System Error has occurred. Please try again. If the problem persists, please contact IT support.",
					"ErrorMessageTitle": "Error occured while retrieving JWT Token"
				},
				"UserProfileBusinessRoleFailureError": {
					"ErrorMessage": "Your professional services profile is missing role configuration. Please contact IT support.",
					"ErrorMessageTitle": "Error in getBasicProfileSvc from service Fails to return Business Role"
				},
				"UserProfileBusinessRoleMissingError": {
					"ErrorMessage": "Your professional services profile is missing role configuration. Please contact IT support.",
					"ErrorMessageTitle": "Error in getBasicProfileSvc from service Business Role is missing"
				},
				"UserProfileNotFoundError": {
					"ErrorMessage": "Your profile is not mapped to a Dashboard. Please contact IT support.",
					"ErrorMessageTitle": "Error in getBasicProfileSvc from service returns UserProfile is Null"
				},
				"BootstrapError": {
					"ErrorMessage": "System Error has occurred. Please try again. If the problem persists, please contact IT support.",
					"ErrorMessageTitle": ""
				},
				"AuthServiceReturnsBlankAppRoleError": {
					"ErrorMessage": "Your profile does not have permissions to access this content. Please contact IT support.",
					"ErrorMessageTitle": "Error in getUserClaims from service which returns Blank App Roles"
				},
				"AuthzServiceReturnsError": {
					"ErrorMessage": "Authorization failed. Please contact IT Support.",
					"ErrorMessageTitle": ""
				},
				"ConfigServiceReturnsNullError": {
					"ErrorMessage": "System Error has occurred. Please try again. If the problem persists, please contact IT support.",
					"ErrorMessageTitle": "Error in Config Service which returns null"
				},
				"GetUserClaimsSvcReturnsError": {
					"ErrorMessage": "Authorization failed. Please contact IT Support.",
					"ErrorMessageTitle": "Error in getUserClaims from service"
				},
				"SearchProfileSvcNotWorkingError": {
					"ErrorMessage": "System Error has occurred. Please try again. If the problem persists, please contact IT support.",
					"ErrorMessageTitle": "Error in SearchProfile service"
				},
				"SearchProfileSvcReturnsError": {
					"ErrorMessage": "Profile you are searching does not exist. Please Click on Create Profile",
					"ErrorMessageTitle": "Error in SearchProfile service"
				},
				"ProfileSelectError": {
					"ErrorMessage": "Profile you have selected does not exist. Please contact IT support.",
					"ErrorMessageTitle": "Error in SearchProfile service"
				},

				"UserSelectedProfileBusinessRoleFailureError": {
					"ErrorMessage": "Your Selected User profile is missing role configuration. Please contact IT support.",
					"ErrorMessageTitle": "Error in getBasicProfileSvc from service Fails to return Business Role"
				},

				"SelectedProfileRoles": {
					"ErrorMessage": "System Error. Unable to load on behalf of user application roles. Please try again",
					"ErrorMessageTitle": "Error while loading Onbehlafof user claims"
				},

				"SelectedUserProfileInformation": {
					"ErrorMessage": "System Error. Unable to retrieve on behalf of user profile. Please try again",
					"ErrorMessageTitle": "Error while retriving Onbehlafof user infromation"
				},

				"CreateProfileState": {
					"ErrorMessage": "System Error.Create Profile state does not exist.Please contact IT support",
					"ErrorMessageTitle": "Error in create profile"
				},

				"OBOUserActive": {
					"ErrorMessage": "You are already acting On behalf of for <OBOusername>. Please exit current on behalf of user experience to initiate a new on behalf of workflow",
					"ErrorMessageTitle": "OBO user is active"
				},
				"OBOUserAliasUndefined": {
					"ErrorMessage": "OBO user alias is not found",
					"ErrorMessageTitle": "OBO user alias is undefined"
				},
				"GeneralExceptionError": {
					"ErrorMessage": "Exception occurred",
					"ErrorMessageTitle": "General Exception"
				},
				"GetSettingsServiceCallFailedError": {
					"ErrorMessage": "System Error has occurred. Please try again. If the problem persists, please contact IT support.",
					"ErrorMessageTitle": "Call to Get Settings service failed"
				},
				"SaveSettingsServiceCallFailedError": {
					"ErrorMessage": "System Error has occurred. Please try again. If the problem persists, please contact IT support.",
					"ErrorMessageTitle": "Call to Save Settings service failed"
				},
				"HelpCentralGetSuggestionsError": {
					"ErrorMessage": "System Error has occurred. Please try again. If the problem persists, please contact IT support.",
					"ErrorMessageTitle": "Call to Save Settings service failed"
				}

			},

			"UIStrings": {
				"OBOUIStrings": {
					"ActingOnBehalfOf": "Acting On Behalf Of :",
					"CreateProfile": "Create Profile",
					"OBOReset": "Reset",
					"OBOSearchLabel": "Search for the user below you would like to act on behalf of",
					"Administrator": "Administrator",
					"ActOnBehalfOf": "Act On Behalf Of",
					"ActOnBehalfOfButton": "Act On Behalf Of Button"
				}
			},
		};
	}]).controller('LeftNavController',[LeftNavController])
		.controller('AppController', AppController)
		.controller('HelpController',[
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
		.controller('UserLookupPersonalizationController', UserLookupPersonalizationController)
		.controller('SystemMessagesController', ['$scope', 'FxpLoggerService', 'FxpMessageService', 'TimeZoneHelper', 'SystemMessagesService', 'PersonalizationService', 'PageLoaderService', 'UserInfoService', 'SYSTEM_MESSAGE_UI', '$timeout', SystemMessagesController])
		.controller('RoleNavPersonalizationController', RoleNavPersonalizationController)
		.controller('HelpArticleImageController', ['$uibModalInstance', 'source', HelpArticleImageController])
		.controller('AuthorNotificationConfirmationController', ['$uibModalInstance', AuthorNotificationConfirmationController])
		.controller('AuthorNotificationController', ['$scope', '$rootScope', '$uibModal', '$state', '$timeout', 'UserProfileService', 'FxpLoggerService', 'FxpRouteService', 'NotificationStore', 'FxpMessageService', 'FxpConfigurationService', 'PageLoaderService', 'AuthorNotificationConstant', 'PersonalizationService', 'AuthorNotificationRoleGroupHelper', '$window', AuthorNotificationController])
		.controller('CreateAskOpsController',['$rootScope','$window','$uibModalInstance','FxpLoggerService','SettingsService','FxpMessageService','defaultRequestType',CreateAskOpsController])
		.controller('ActOnBehalfOfController', ActOnBehalfOfController)
		.controller('DashBoardController', ['$scope', 'UIStateHelper', '$rootScope', 'FxpLoggerService', 'adalAuthenticationService', 'UserProfileService', 'UserInfoService', 'FxpMessageService', 'OBOUserService', 'DashBoardHelper', 'FxpTelemetryContext', 'FxpContextService', 'FxpConfigurationService', 'DashboardService', 'FxpFeedbackService', DashBoardController])
		.service('UserInfoService', [UserInfoService])
		.service('PageTourEventService', ['$rootScope', 'UserProfileService', pageTourEventService])
		.service("NotificationActionCenter", [
			'$rootScope',
			'$state',
			'FxpConfigurationService',
			'FxpRouteService',
			NotificationActionCenter
		])
		.service('SystemMessagesService', ['$http', 'FxpConfigurationService', SystemMessagesService])
		.service("NotificationStore", [
			'$rootScope',
			'$state',
			'$q',
			'NotificationService',
			NotificationStore
		])
		.service('NotificationService', ['$http', 'FxpConfigurationService', 'DataService', NotificationService])
		.service('FxpToastNotificationService', ['$rootScope','NotificationStore','FxpLoggerService',FxpToastNotificationService])
		.service('FxpConfigurationService', [FxpConfigurationService])
		.service('FxpStorageService', ['$window', FxpStorageService])
		.service('FxpTelemetryContext', [TelemetryContext])
		.service('FxpStateTransitionService', ['$injector', '$state', FxpStateTransitionService])
		.service('HelpCentralService', ['$http', 'FxpConfigurationService', 'UserInfoService', HelpCentralService])
		.service('DashboardService', ['$http', '$q', '$rootScope', '$state', 'FxpConfigurationService', '$timeout', 'FxpLoggerService', 'AdalLoginHelperService', 'FxpMessageService', 'UserInfoService', 'PageLoaderService', 'FxpTelemetryContext', 'UserProfileService', DashboardService])
		.service('FxpFeedbackService', ['FxpLoggerService', '$rootScope', 'UserInfoService', 'FxpTelemetryContext', 'UserProfileService', FxpFeedbackService])
		.service('FxpMessageService', ['$rootScope', '$interval', '$timeout', 'FxpConfigurationService', 'FxpLoggerService', FxpMessageService])
		.service('AdminLandingService', ['$http', '$q', '$rootScope', '$timeout', 'UserProfileService', 'FxpConfigurationService', 'FxpLoggerService', 'AdalLoginHelperService', 'FxpMessageService', '$base64', AdminLandingService])
		.service('FxpBreadcrumbService', ['$state', '$q', '$rootScope', 'FxpStorageService', 'UserInfoService', 'DashboardService', 'FxpConfigurationService', 'FxpLoggerService', 'FxpTelemetryContext', FxpBreadcrumbService])
		.service("FxpAuthorizationService", ["$state", "$rootScope", "FxpLoggerService", "UserProfileService", "UserInfoService", "FxpConfigurationService", FxpAuthorizationService])
		.service('OBOUserService', ['$rootScope', 'FxpContextService', '$q', 'FxpMessageService', 'UserInfoService', 'UserProfileService', OBOUserService])
		.service('FxpRouteService',['$state', '$rootScope', 'FxpLoggerService', 'UserInfoService', 'FxpBreadcrumbService', FxpRouteService])
		.service('PersonalizationService', ['$http', '$q', '$rootScope', 'FxpConfigurationService', '$timeout', 'FxpLoggerService', 'AdalLoginHelperService', 'FxpMessageService', PersonalizationService])
		.factory('FxpUIData', ['$rootScope', 'FxpFeedbackService', FxpUIData.getUIDataFactoryObj])
		.factory("AppControllerHelper", ['$q', '$rootScope', 'adalAuthenticationService', 'UserProfileService', 'PageLoaderService', 'FxpTelemetryContext', 'FxpLoggerService', 'UserInfoService', 'FeatureFlagService', 'StartUpFlightConfig', 'SettingsService', 'FxpContextService', 'FxpMessageService', 'DeviceFactory', 'deviceDetector', 'PlannedDownTimeService', 'FxpConfigurationService', 'UserClaimsService', AppControllerHelper.appControllerHelperFactory])
		.factory('FxpHttpCorrelationInterceptor', ['UserInfoService', 'FxpConfigurationService', 'FxpLoggerService', httpCorrelationInterceptor])
		.factory("ActOnBehalfOfHelper", ['$rootScope', '$http', '$q', 'UserProfileService', 'FxpLoggerService', 'FxpMessageService', 'adalAuthenticationService', 'FxpContextService', 'FxpTelemetryContext', 'UserInfoService', ActOnBehalfOfHelper.ActOnBehalfOfHelperFactory])
		.factory('AuthorNotificationRoleGroupHelper', [AuthorNotificationRoleGroupHelper.AuthorNotificationRoleGroupHelper])
		.factory('FxpHttpRetryInterceptor', ['$q', '$injector', '$timeout', 'FxpConfigurationService', 'FxpLoggerService', '$rootScope', httpRetryInterceptor])
		.factory('SessionTimeoutModalFactory', ['$uibModal', 'FxpConfigurationService', 'FxpLoggerService', 'SessionTimeoutModalConstant', 'ActivityMonitor', SessionTimeoutModalFactory.getUIDataFactoryObj])
		.factory('DashBoardHelper', ['$rootScope', '$state', 'UIStateHelper', 'FxpLoggerService', 'FxpTelemetryContext',
		'FxpContextService', 'FxpRouteService', '$location', 'PageLoaderService', '$injector', 'AppControllerHelper', 'UserInfoService', DashBoardHelper.DashBoardHelperFactory])
		.directive('fxpBreadcrumbLink', fxpBreadcrumbLink.fxpBreadcrumbLinksDirective)		
		.directive('fxpLeftnavLink', LeftnavLink.fxpLeftnavLinkDirective);
    

angular.module("Telemetry", [])
.service('FxpOnlineLoggingStrategy', ['TelemetryConfiguration', 'Microsoft.ApplicationInsights.AppInsights', 'FxpTelemetryContext', FxpOnlineLoggingStrategy]);
angular.module('FxpUtils', [])
	.service('AdalLoginHelperService', ['$q', '$resource', 'adalAuthenticationService', AdalLoginHelperService]);


