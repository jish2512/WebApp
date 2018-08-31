
// For Backward compatibility
import { BusinessProcessEvent as businessProcessEvent } from './telemetry/BusinessProcessEvent';
import { FeatureUsageEvent as featureUsageEvent } from './telemetry/FeatureUsageEvent';
import { SystemEvent as systemEvent } from './telemetry/SystemEvent';
import { ComponentType as componentType } from './telemetry/ComponentType';
import { EnvironmentData as environmentData } from './telemetry/EnvironmentData';
import { EventData as eventData } from './telemetry/EventData';
import { EventTypes as eventTypes } from './telemetry/EventTypes';
import { FxpLoggerService as fxpLoggerService } from './telemetry/FxpLogger';
import { FxpLoggerServiceExtension as fxpLoggerServiceExtension } from './telemetry/FxpLoggerServiceExtension';
import { LogPropertyBag as logPropertyBag } from './telemetry/LogPropertyBag';
import { TelemetryConfiguration as telemetryConfiguration } from './telemetry/TelemetryConfiguration';
import { UserInfo as telemetryUserInfo } from './telemetry/UserInfo';
import { FxpLogHelper as fxpLogHelper } from './telemetry/FxpLogHelper';
import { LogMetricBag as logMetricBag } from './telemetry/LogMetricBag';
import { TelemetryData as telemetryData } from './telemetry/TelemetryData';
import { TelemetryContext as telemetryContext } from './telemetry/TelemetryContext';
import { FxpLoggingStrategyFactory as fxpLoggingStrategyFactory } from './telemetry/FxpLoggingStrategyFactory';
import { DashBoardHelper as dashBoardHelper } from './factory/DashBoardHelper';
import { httpCorrelationInterceptor as httpCorrelationInterceptorAlias, httpRetryInterceptor as httpRetryInterceptorAlias } from './factory/FxpHttpInterceptorFactory';
import { AdminLandingDirective as adminLandingDirective } from './directives/adminLanding.directive';
import { AppDirectives } from './directives/AppDirectives';
import { AuthorNotificationContentDirective } from './directives/fxpAuthorNotification.directive';
import { FxpAuthorNotificationListDirective } from './directives/fxpAuthorNotificationList.directives';
import { FxpIncludeStaticTemplate as fxpIncludeStaticTemplate } from './directives/fxpIncludeStaticTemplate';
import { SkipToMainContent as skipToMainContent } from './directives/fxpSkipToMainContent.directive';
import { HelpArticleImageController as helpArticleImageController } from './controllers/HelpArticleImageController';

import {
	TelemetryConstants as telemetryConstants,
	TelemetryEventType as telemetryEventType,
	TelemetryConfigDefaults as telemetryConfigDefaults,
	TracingLevel as tracingLevel,
	PouchSyncMode as pouchSyncMode,
	DiagnosticLevel as diagnosticLevel,
	EventDataProperties as eventDataProperties,
	EnvironmentData as environmentData_Telemetry,
	ControllerName as controllerName,
	EventName as eventName,
	RoleGroupDetails as roleGroupDetails,
	TenantDetails as tenantDetails

} from './telemetry/TelemetryConst';

import {
	CustomEvents as customEvent,
	ApplicationConstants as applicationConstants,
	FxpConstants as fxpContants,
	PerfMarkers as perfMarkers,
	RoleGroupInfo as roleGroupInfo,
	TenantInfo as tenantInfo
} from './common/ApplicationConstants';

import { FxpBroadcastedEvents as fxpBroadcastedEvents } from './services/FxpBroadcastedEvents';
import { ITelemetryContextListener as iTelemetryContextListener } from './interfaces/ITelemetryContextListener';
import { FxpBaseController as fxpBaseController } from './common/FxpBaseController';
import { FxpWorkerActions as fxpWorkerActions } from './common/FxpWorkerActions';
import { NotificationAPI as notificationAPI } from './common/NotificationAPI';
import { PouchDbConnection as pouchDbConnection } from './common/PouchDbConnection';
import { PouchDBProvider as pouchDBProvider } from './common/PouchDBProvider';
import { PouchDbService as pouchDbService } from './common/PouchDbService';
import { SettingsType as settingsType } from './common/SettingsType';
import { HomeLocation as homeLocation, WorkLocation as workLocation, UserInfo as userInfo } from './common/UserInfo';
import { CustomErrors as customErrors } from './common/constants/ErrorConstants';
import { AuthorNotificationConstant as authorNotificationConstant } from './constants/AuthorNotification.constants';
import { CreateAskOpsModalConstant as createAskOpsModalConstant } from './constants/CreateAskOpsRequest.constants';
import { HelpArticleImageModalConstant as helpArticleImageModalConstant } from './constants/HelpArticle.constants';
import { SessionTimeoutModalConstant as sessionTimeoutModalConstant } from './constants/SessionTimeoutModal.constants';
import { SYSTEM_MESSAGE_UI as SYSTEM_MESSAGE_UI_Alias } from './constants/systemMessages.constants';
import { FxpContext as fxpContext } from './context/FxpContext';
import { RouteConfig as routeConfig } from './core/RouteConfig';
import { CommonUtils as commonUtils } from './utils/CommonUtils';
import { Resiliency as resiliency } from './resiliency/FxpResiliency';
import { FxpStateTransitionService as fxpStateTransitionService } from './services/FxpStateTransitionService';
import { AdalLoginHelperService as adalLoginHelperService } from './services/AdalLoginHelperService';
import { AdminLandingService as adminLandingService } from './services/AdminLandingService';
import { DashboardService as dashboardService } from './services/DashboardService';
import { DataService as dataService } from './services/DataService';
import { FxpAuthorizationService as fxpAuthorizationService } from './services/FxpAuthorizationService';
import { FxpBreadcrumbService as fxpBreadcrumbService } from './services/FxpBreadcrumbService';
import { FxpConfigurationService as fxpConfigurationService } from './services/FxpConfiguration';
import { FxpFeedbackService as fxpFeedbackService } from './services/FxpFeedbackService';
import { FxpMessageService as fxpMessageService } from './services/FxpMessageService';
import { FxpRouteService as fxpRouteService } from './services/FxpRouteService';
import { FxpStorageService as fxpStorageService } from './services/FxpStorageService';
import { FxpToastNotificationService as fxpToastNotificationService } from './services/FxpToastNotificationService';
import { HelpCentralService as helpCentralService } from './services/HelpCentralService';
import { NotificationActionCenter as notificationActionCenter } from './services/NotificationActionCenter';
import { NotificationService as notificationService } from './services/NotificationService';
import { NotificationStore as notificationStore } from './services/NotificationStore';
import { OBOUserService as oBOUserService } from './services/OBOUserService';
import { PageLoaderService as pageLoaderService } from './services/pageLoaderService';
import { pageTourEventService as pageTourEventServiceAlias } from './services/pageTourEventService';
import { PersonalizationService as personalizationService } from './services/PersonalizationService';
import { PlannedDownTimeService as plannedDownTimeService } from './services/PlannedDownTimeService';
import { SystemMessagesService as systemMessagesService } from './services/SystemMessagesService';
import { TimeZoneHelper as timeZoneHelper } from './services/TimeZoneHelper';
import { UserInfoService as userInfoService } from './services/UserInfoService';
import { UserProfileService as userProfileService } from './services/UserProfileService';
import { UserClaimsService as UserClaimsService } from './services/UserClaimsService';
import { FxpOnlineLoggingStrategy as fxpOnlineLoggingStrategy } from './telemetry/FxpOnlineLoggingStrategy';
import { FxpProviders as fxpProviders } from './provider/CorrelationProvider';
import { FxpBotService as fxpBotService, FxpBotServiceProvider as fxpBotServiceProvider } from './provider/FxpBotServiceProvider';
import { SettingsServiceProvider as settingsServiceProvider } from './provider/SettingsServiceProvider';
import { FxpUIStateHelperProvider as fxpUIStateHelperProvider } from './provider/UIStateHelperProvider';
import { AppDirectives as appDirectives } from './directives/AppDirectives';
import { fxpBreadcrumbLink as fxpBreadcrumbLink } from './directives/fxpBreadcrumbLink';
import { FxpBootstrap as fxpBootstrap } from './boot/fxpboot';
import { ActOnBehalfOfHelper as actOnBehalfOfHelper } from './factory/ActOnBehalfOfHelper';
import { AppControllerHelper as appControllerHelper } from './factory/AppControllerHelper';
import { AuthorNotificationRoleGroupHelper as authorNotificationRoleGroupHelper } from './factory/AuthorNotificationRoleGroupHelper';
import { FxpUIData as fxpUIData } from './factory/FxpUIDataFactory';
import { SessionTimeoutModalFactory as sessionTimeoutModalFactory } from './factory/SessionTimeoutModalFactory';
import { FxpKeyDownDirective as fxpKeyDownDirective } from './directives/fxpKeyDown.derective';
import { UnCamelCase as unCamelCase } from './filters/unCamelCase.filter';
import { IframeAppMessage as iframeAppMessage, IframeAppRequestType as iframeAppRequestType } from './iframe_app/iframeAppConstants';
import { IframeAppController as iframeAppController, IframeAppCtrlScope as iframeAppCtrlScope } from './iframe_app/iframeAppController';
import { IframeBridgeService as iframeBridgeService } from './iframe_app/iframeBridgeService';
import { FxpMessageEvent as fxpMessageEvent, FxpResponseEventData as fxpResponseEventData, RequestMessageType as requestMessageType, FxpServiceFuncRequest as fxpServiceFuncRequest, FxpRequestMessage as fxpRequestMessage, FxpContextInfo as fxpContextInfo, FxpResponseCallback as fxpResponseCallback } from './iframeAppSDK/iframeAppSdkInferfaces';
import { FxpIframeClient as fxpIframeClient } from './iframeAppSDK/iframeAppSdk';
import { FxpComponentRegistrationService as fxpComponentRegistrationService } from './services/FxpComponentRegistrationService';
import { PartnerAppRegistrationService as partnerAppRegistrationService } from './services/PartnerAppRegistrationService'
import { FxpEventBroadCastService as fxpEventBroadCastService } from './services/BroadCastingService';
import { FxpHttpService as fxpHttpService } from './services/FxpHttpService';
import { ConFitService as confitService } from '@fxp/confitsdk';
import { FeatureFlagService as featureFlagService } from '@fxp/flightingsdk';

export module Fxp {
	export var Resiliency = resiliency;
	export module Telemetry {
		export var BusinessProcessEvent = businessProcessEvent;
		export var FeatureUsageEvent = featureUsageEvent;
		export var SystemEvent = systemEvent;
		export var ComponentType = componentType;
		export var EnvironmentData = environmentData;
		export var EventData = eventData;
		export var EventTypes = eventTypes;
		export var FxpLoggerService = fxpLoggerService;
		export var FxpLoggerServiceExtension = fxpLoggerServiceExtension;
		export var TelemetryConfiguration = telemetryConfiguration;
		export var UserInfo = telemetryUserInfo;
		export var TelemetryContext = telemetryContext;
		export var FxpLoggingStrategyFactory = fxpLoggingStrategyFactory;
		export var FxpOnlineLoggingStrategy = fxpOnlineLoggingStrategy;
		export module Helper {
			export var FxpLogHelper = fxpLogHelper;
			export var LogPropertyBag = logPropertyBag;
			export var LogMetricBag = logMetricBag;
			export var TelemetryData = telemetryData;
		}


	}
	export module Common {
		export var FxpBaseController = fxpBaseController;
		export var PouchDbConnection = pouchDbConnection;
		export var PouchDBProvider = pouchDBProvider;
		export var PouchDbService = pouchDbService;
		export var SettingsType = settingsType;
		export var HomeLocation = homeLocation;
		export var WorkLocation = workLocation;
		export var UserInfo = userInfo;
		export var FxpWorkerActions = fxpWorkerActions;
		export var NotificationAPI = notificationAPI;
		export module Constants {
			export var TelemetryConstants = telemetryConstants;
			export var TelemetryEventType = telemetryEventType;
			export var TelemetryConfigDefaults = telemetryConfigDefaults;
			export var TracingLevel = tracingLevel;
			export var PouchSyncMode = pouchSyncMode;
			export var DiagnosticLevel = diagnosticLevel;
			export var EventDataProperties = eventDataProperties;
			export var EnvironmentData = environmentData_Telemetry;
			export var ControllerName = controllerName;
			export var EventName = eventName;
			export var RoleGroupDetails = roleGroupDetails;
			export var TenantDetails = tenantDetails;
			export var CustomEvents = customEvent;
			export var ApplicationConstants = applicationConstants;
			export var FxpConstants = fxpContants;
			export var PerfMarkers = perfMarkers;
			export var RoleGroupInfo = roleGroupInfo;
			export var TenantInfo = tenantInfo;
			export var customErrors = customErrors;
		}
	}
	export module Constants {
		export var AuthorNotificationConstant = authorNotificationConstant;
		export var CreateAskOpsModalConstant = createAskOpsModalConstant;
		export var helpArticleImageModalConstant = helpArticleImageModalConstant;
		export var SessionTimeoutModalConstant = sessionTimeoutModalConstant;
		export var SYSTEM_MESSAGE_UI = SYSTEM_MESSAGE_UI_Alias;

	}

	export module Context {
		export var FxpContext = fxpContext;
	}

	export module Core {
		export var RouteConfig = routeConfig;
	}

	export module Utils {
		export var CommonUtils = commonUtils;
		export module Services {
			export var AdalLoginHelperService = adalLoginHelperService;
			export var DataService = dataService;

		}
	}

	export module Services {
		export var FxpHttpService = fxpHttpService;
		export var FxpBroadcastedEvents=fxpBroadcastedEvents;
		export var FxpEventBroadCastService = fxpEventBroadCastService;
		export var FxpStateTransitionService = fxpStateTransitionService;
		export var AdminLandingService = adminLandingService;
		export var DashboardService = dashboardService;
		export var FxpAuthorizationService = fxpAuthorizationService;
		export var FxpBreadcrumbService = fxpBreadcrumbService;
		export var FxpConfigurationService = fxpConfigurationService;
		export var FxpFeedbackService = fxpFeedbackService;
		export var FxpMessageService = fxpMessageService;
		export var FxpRouteService = fxpRouteService;
		export var FxpStorageService = fxpStorageService;
		export var FxpToastNotificationService = fxpToastNotificationService;
		export var HelpCentralService = helpCentralService;
		export var NotificationActionCenter = notificationActionCenter;
		export var NotificationService = notificationService;
		export var NotificationStore = notificationStore;
		export var OBOUserService = oBOUserService;
		export var PageLoaderService = pageLoaderService;
		export var pageTourEventService = pageTourEventServiceAlias;
		export var PersonalizationService = personalizationService;
		export var PlannedDownTimeService = plannedDownTimeService;
		export var SystemMessagesService = systemMessagesService;
		export var TimeZoneHelper = timeZoneHelper;
		export var UserInfoService = userInfoService;
		export var UserProfileService = userProfileService;
		export var UserClaimsService = UserClaimsService;
		export var FxpBotService = fxpBotService;
		export var FxpBotServiceProvider = fxpBotServiceProvider;
		export var SettingsServiceProvider = settingsServiceProvider;
		export var FxpComponentRegistrationService = fxpComponentRegistrationService;
		export var PartnerAppRegistrationService = partnerAppRegistrationService;
		export var ConFitService = confitService;
		export var FeatureFlagService = featureFlagService;


	}

	export module Boot {
		export var FxpBootstrap = fxpBootstrap;
	}


	export module Filters {
		export var UnCamelCase = unCamelCase;
	}

	export namespace External.Constants {
		export var IframeAppMessage = iframeAppMessage;
		export var IframeAppRequestType = iframeAppRequestType;
	}

	export module External.App {
		export var IframeAppController = iframeAppController;
		export type IframeAppCtrlScope = iframeAppController;
		export var IframeBridgeService = iframeBridgeService;
	}

	export module Factory {
		export var ActOnBehalfOfHelper = actOnBehalfOfHelper;
		export var AppControllerHelper = appControllerHelper;
		export var AuthorNotificationRoleGroupHelper = authorNotificationRoleGroupHelper;
		export var DashBoardHelper = dashBoardHelper;
		export var httpCorrelationInterceptor = httpCorrelationInterceptorAlias;
		export var httpRetryInterceptor = httpRetryInterceptorAlias;
		export var FxpUIData = fxpUIData;
		export var SessionTimeoutModalFactory = sessionTimeoutModalFactory;
	}

	window["Fxp"] = Fxp;

}

module FxpSDK {
	export type FxpMessageEvent = fxpMessageEvent;
	export type FxpResponseEventData = fxpResponseEventData;
	export type RequestMessageType = requestMessageType;
	export type FxpServiceFuncRequest = fxpServiceFuncRequest;
	export type FxpRequestMessage = fxpRequestMessage<any>;
	export type FxpContextInfo = fxpContextInfo;
	export type FxpResponseCallback = fxpResponseCallback;
	export var FxpIframeClient = fxpIframeClient;
}

window["FxpSDK"] = FxpSDK;