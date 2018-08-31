// import "./../../node_modules/applicationinsights-js/dist/ai.js";
// import "./lib/msit.jquery.ajax.correlator.0.1.0-build26041";
// import "./lib/msit.telemetry.extensions.ai.javascript";
// import "./lib/pouchdb";
import { UserInfo as telemetryUserInfo } from './telemetry/UserInfo';
import { EventData as eventData } from './telemetry/EventData';
import { EnvironmentData as environmentData } from './telemetry/EnvironmentData';
import { BusinessProcessEvent as businessProcessEvent } from './telemetry/BusinessProcessEvent';
import { FeatureUsageEvent as featureUsageEvent } from './telemetry/FeatureUsageEvent';
import { SystemEvent as systemEvent } from './telemetry/SystemEvent';
import { ComponentType as componentType } from './telemetry/ComponentType';
import { EventTypes as eventTypes } from './telemetry/EventTypes';

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

import { TelemetryContext as telemetryContext } from './telemetry/TelemetryContext';
import { PouchDbConnection as pouchDbConnection } from './common/PouchDbConnection';
import { PouchDbService as pouchDbService } from './common/PouchDbService';
import { PouchDBProvider as pouchDBProvider } from './common/PouchDBProvider';
import { TelemetryConfiguration as telemetryConfiguration } from './telemetry/TelemetryConfiguration';
import { FxpLogHelper as fxpLogHelper } from './telemetry/FxpLogHelper';
import { LogMetricBag as logMetricBag } from './telemetry/LogMetricBag';
import { LogPropertyBag as logPropertyBag } from './telemetry/LogPropertyBag';
import { TelemetryData as telemetryData } from './telemetry/TelemetryData';
import { FxpOnlineLoggingStrategy as fxpOnlineLoggingStrategy } from './telemetry/FxpOnlineLoggingStrategy';
import { FxpLoggingStrategyFactory as fxpLoggingStrategyFactory } from './telemetry/FxpLoggingStrategyFactory';
import { FxpLoggerServiceExtension as fxpLoggerServiceExtension } from './telemetry/FxpLoggerServiceExtension';
import { FxpLoggerService as fxpLoggerService } from './telemetry/FxpLogger';
import { AdalLoginHelperService as adalLoginHelperService } from './services/AdalLoginHelperService';

export module Fxp {
	export module Telemetry {
		export var UserInfo = telemetryUserInfo;
		export var EventData = eventData;
		export var EnvironmentData = environmentData;
		export var BusinessProcessEvent = businessProcessEvent;
		export var FeatureUsageEvent = featureUsageEvent;
		export var SystemEvent = systemEvent;
		export var ComponentType = componentType;
		export var EventTypes = eventTypes;
		export var TelemetryContext = telemetryContext;
		export var TelemetryConfiguration = telemetryConfiguration;
		export var FxpOnlineLoggingStrategy = fxpOnlineLoggingStrategy;
		export var FxpLoggingStrategyFactory = fxpLoggingStrategyFactory;
		export var FxpLoggerServiceExtension = fxpLoggerServiceExtension;
		export var FxpLoggerService = fxpLoggerService;
		
		export module Helper {
			export var FxpLogHelper = fxpLogHelper;
			export var LogPropertyBag = logPropertyBag;
			export var LogMetricBag = logMetricBag;
			export var TelemetryData = telemetryData;
		}
	}
	export module Common {
		export var PouchDbConnection = pouchDbConnection;
		export var PouchDbService = pouchDbService;
		export var PouchDBProvider = pouchDBProvider;
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
		}

		export module Utils {
			export module Services {
				export var AdalLoginHelperService = adalLoginHelperService;
				
			}
		}
	}

}



