import { ILogger } from "../interfaces/ILogger";
import { ILoggingStrategy } from "../interfaces/ILoggingStrategy";
import { ICorrelationProvider } from "../interfaces/ICorrelationProvider";
import { TelemetryConfiguration } from "./TelemetryConfiguration";
import { FxpLoggerServiceExtension } from "./FxpLoggerServiceExtension";
import { FxpConfigurationService } from "../services/FxpConfiguration";
import { LogPropertyBag } from "./LogPropertyBag";
import { FxpLogHelper } from "./FxpLogHelper";
import { LogMetricBag } from "./LogMetricBag";
import { RoleGroupInfo, TenantInfo } from "../common/ApplicationConstants";
import { TelemetryConstants, EnvironmentData, DiagnosticLevel, RoleGroupDetails, TenantDetails } from "./TelemetryConst";
import { TelemetryContext } from "./telemetrycontext";
import { CommonUtils } from "../utils/CommonUtils";
import { FeatureUsageEvent } from "./FeatureUsageEvent";
import { SystemEvent } from "./SystemEvent";
import { BusinessProcessEvent } from "./BusinessProcessEvent";
import { FxpLoggingStrategyFactory } from "./FxpLoggingStrategyFactory";
//import './../lib/msit.jquery.ajax.correlator.0.1.0-build26041';

/**
   * A service to connect to Fxp logger service to log erros,exceptions,info,events and metrics etc.,
   * @class Fxp.Telemetry.FxpLoggerService
   * @classdesc A service to connect to Fxp logger service to log erros,exceptions,info,events and metrics etc.,
   * @example <caption> Example to create an instance of Fxp logger service</caption>
   *  //Initializing Fxp Logger Service
   *  angular.module('FxPApp').controller('AppController', ['FxpLoggerService', AppController]);
   *  function AppController(FxpLoggerService){ FxpLoggerService.logError(source); }
   */
export class FxpLoggerService implements ILogger {
	private static _fxpLoggerService: FxpLoggerService;
	private loggingStrategy: ILoggingStrategy;
	private correlationProvider: ICorrelationProvider;
	private telemetryConfig: TelemetryConfiguration;
	private fxpLoggerServiceExtension: FxpLoggerServiceExtension;
	private pageLoadMetric: any;
	private loggedInUserContext: any;
	private OBOUserContext: any;
	private isObo: boolean;
	private _events: {
		[key: string]: number;
	};
	private static PerfMarkerPrefix: string = "Perf"
	private static PerfMarkerSuffix: string = "DurationMilliSeconds"

	/**
	 * Exposes methods to log diagnostics of FXP    
	 * @class ecoApi.telemetry.fxpLogger       
	 * @classdesc Exposes diagnostic and performance methods to be consumed FXP
	*/
	constructor(telemetryConfig: TelemetryConfiguration, private fxpLoggingStrategyFactory: FxpLoggingStrategyFactory, fxpConfigurationService: FxpConfigurationService, fxpLoggerServiceExtension: FxpLoggerServiceExtension) {
		if (FxpLoggerService._fxpLoggerService) {
			return FxpLoggerService._fxpLoggerService;
		}
		var defaults = telemetryConfig;
		this.telemetryConfig = fxpConfigurationService.FxpBaseConfiguration.Telemetry;

		if (this.telemetryConfig != undefined) {
			for (var field in defaults) {
				if (this.telemetryConfig[field] === undefined) {
					this.telemetryConfig[field] = defaults[field];
				}
			}
		}
		else {
			this.telemetryConfig = defaults;
		}

		this.loggingStrategy = this.fxpLoggingStrategyFactory.GetLoggingStrategy(this.telemetryConfig);
		this.fxpLoggerServiceExtension = fxpLoggerServiceExtension;
		FxpLoggerService._fxpLoggerService = this;
		this._events = {};
	}

	/**
	* Method to create property bag object which can hold upto 8 key value pairs
	* @method  Fxp.telemetry.fxpLogger#createPropertyBag
	*/
	createPropertyBag(): LogPropertyBag {
		return FxpLogHelper.createPropertyBag();
	}

	createMetricBag(): LogMetricBag {
		return FxpLogHelper.createMetricBag();
	}

	getPageLoadMetrics() {
		return this.pageLoadMetric;
	}
	setPageLoadMetrics(value: any) {
		this.pageLoadMetric = value;
	}
	setLoggedInUserContext(loggedInUserRoleId: string, loggedInUserRoleName: string, isOBO: boolean, loggedInUserTenantKey: string, loggedInUserTenantName: string) {
		this.loggedInUserContext = {
			[RoleGroupInfo.RoleGroupId]: (loggedInUserRoleId) ? loggedInUserRoleId.toString() : loggedInUserRoleId,
			[RoleGroupInfo.RoleGroupName]: loggedInUserRoleName,
			[TenantInfo.TenantKey]: loggedInUserTenantKey,
			[TenantInfo.TenantName]: loggedInUserTenantName
		}
		this.isObo = isOBO;
	}
	setOBOUserContext(OBOUserRoleId: string, OBOUserRoleName: string, isOBO: boolean, OBOUserTenantKey: string, OBOUserTenantName: string) {
		this.OBOUserContext = {
			[RoleGroupInfo.RoleGroupId]: (OBOUserRoleId) ? OBOUserRoleId.toString() : OBOUserRoleId,
			[RoleGroupInfo.RoleGroupName]: OBOUserRoleName,
			[TenantInfo.TenantKey]: OBOUserTenantKey,
			[TenantInfo.TenantName]: OBOUserTenantName
		}
		this.isObo = isOBO;
	}

	logPageLoadMetrics(pageLoadTime?: number) {
		try {
			var pageLoadMetricsCalled = performance.now();
			var propBag = this.createPropertyBag();
			var pageLoadData = this.pageLoadMetric;

			pageLoadData.totalDuration = performance.now() - pageLoadData.startTime;

			if (!CommonUtils.isNullOrEmpty(pageLoadData.sourceRoute) && !CommonUtils.isNullOrEmpty(pageLoadData.destinationRoute)) {
				if (pageLoadTime != null && pageLoadTime != undefined && typeof (pageLoadTime) == "number") {
					pageLoadData.pageLoadDuration = pageLoadTime;
				} else
					pageLoadData.pageLoadDuration = 0;

				propBag.addToBag("pageDisplayName", pageLoadData.pageDisplayName);
				propBag.addToBag("sourceRoute", pageLoadData.sourceRoute);
				propBag.addToBag("sourceRouteURL", CommonUtils.isNullOrEmpty(pageLoadData.sourceRouteURL) ? "No_SourceRouteURL_Found" : pageLoadData.sourceRouteURL);
				propBag.addToBag("destinationRoute", pageLoadData.destinationRoute);
				propBag.addToBag("destinationRouteURL", CommonUtils.isNullOrEmpty(pageLoadData.destinationRouteURL) ? "No_DestinationRouteURL_Found" : pageLoadData.destinationRouteURL);
				propBag.addToBag("pageTransitionStatus", pageLoadData.pageTransitionStatus);
				propBag.addToBag("stateChangeDuration", (pageLoadData.stateChangeDuration).toString());
				propBag.addToBag("preStateDuration", (pageLoadData.preStateDuration).toString());
				propBag.addToBag("error", pageLoadData.pageLoadError);
				propBag.addToBag("partnerPageLoadDuration", (pageLoadData.pageLoadDuration).toString());
				propBag.addToBag("totalDuration", (pageLoadData.totalDuration).toString());
				propBag.addToBag("thresholdCrossed", (pageLoadData.threshold.thresholdCrossed).toString());
				propBag.addToBag("thresholdValue", (pageLoadData.threshold.thresholdValue).toString());

				// Temp properties added for trouble shooting
				propBag.addToBag("startTime", (pageLoadData.startTime).toString());
				propBag.addToBag("$rootScope.startTime", CommonUtils.isNullOrEmpty(pageLoadData.rootscopestartTime) ? "0" : (pageLoadData.rootscopestartTime).toString());
				propBag.addToBag("$rootScope.stateChangeStartTime", CommonUtils.isNullOrEmpty(pageLoadData.stateChangeStartTime) ? "0" : (pageLoadData.stateChangeStartTime).toString());
				propBag.addToBag("pageLoadMetricsCalled", (pageLoadMetricsCalled).toString());

				this.loggingStrategy.logEvent("FxpTelemetry.PageMetrics", this.addPropertyBagValues(propBag));
			}
		}
		catch (exception) {
			this.internalCustomLog(exception);
		}
	}

	getDefaultPropertyBagValues(properties?: LogPropertyBag) {
		var propBag = properties || this.createPropertyBag();
		propBag = this.addPropertyBagValues(propBag);
		return propBag.getItems();
	}

	/**
	* Diagnostic method to log error
	* @method Fxp.telemetry.fxpLogger#logError
	* @param {string} errorMsg - Message which needs to be logged.
	* @param {string} innerErrorMsg   - inner Error message which needs to be logged.
	* @param {string} stackTrace   - Stack Trace message which needs to be logged.
	* @param {string} transactionId - Transaction id to uniquely identify a single transaction.    
	*/
	logError(source: string,
		message: string,
		errorCode: string,
		stackTrace: string,
		properties?: LogPropertyBag,
		measurements?: LogMetricBag,
		transactionId?: string) {
		if (this.telemetryConfig.DiagnosticLevel >= DiagnosticLevel.Error) {
			transactionId = this.getCorrelationId(transactionId);
			try {
				properties = this.buildCommonLogProperties(properties, source, errorCode, stackTrace);
				this.loggingStrategy.logError(message, errorCode, stackTrace, this.addPropertyBagValues(properties, transactionId, source), measurements, transactionId);
			}
			catch (exception) {
				this.internalCustomLog(exception);
			}
		}
	}

	startTrackPerformance(eventName: string) {
		if (this.telemetryConfig.PerfMarkersEnabled) {
			console.time(eventName);
			eventName = FxpLoggerService.PerfMarkerPrefix + eventName;
			try {
				if (!CommonUtils.isNullOrEmpty(this._events[eventName])) {
					if (this.telemetryConfig.DebugEnabled)
						console.warn("Start was called before calling stop for event : " + eventName);
				}
				else {
					this._events[eventName] = performance.now();
					this.loggingStrategy.startTrackEvent(eventName);
				}
			}
			catch (exception) {
				this.internalCustomLog(exception);
			}
		}
	}

	stopTrackPerformance(eventName: string, source?: string,
		properties?: LogPropertyBag,
		measurements?: LogMetricBag,
		transactionId?: string) {
		if (this.telemetryConfig.PerfMarkersEnabled) {
			console.timeEnd(eventName);
			var metricName = FxpLoggerService.PerfMarkerPrefix + eventName + FxpLoggerService.PerfMarkerSuffix;
			eventName = FxpLoggerService.PerfMarkerPrefix + eventName;
			var start = this._events[eventName];

			if (isNaN(start)) {
				if (this.telemetryConfig.DebugEnabled)
					console.warn("Stop was called before calling start for event : " + eventName);
			}
			else {
				var duration = performance.now() - start;
				delete this._events[eventName];
				this._events[eventName] = undefined;
				transactionId = this.getCorrelationId(transactionId);

				if (CommonUtils.isNullOrEmpty(measurements))
					measurements = new LogMetricBag();
				measurements.addToBag(metricName, duration);

				try {
					properties = this.buildCommonLogProperties(properties, source, null, null);
					this.loggingStrategy.stopTrackEvent(eventName, this.addPropertyBagValues(properties, transactionId, source), measurements, transactionId);
				}
				catch (exception) {
					this.internalCustomLog(exception);
				}
			}
		}
	}

	/**
	 * Diagnostic method to log exception
	 * @method Fxp.telemetry.fxpLogger#logException
	 * @param {string} source - Source of the exception
	 * @param {exception} exception - exception which needs to be logged
	 * @param {LogPropertyBag} properties - log properties
	 * @param {LogMetricBag} measurements - log metrics
	 * @param {string} transactionId - Transaction id to uniquely identify a single transaction.
	 */
	logException(source: string,
		exception: Error,
		properties?: LogPropertyBag,
		measurements?: LogMetricBag,
		transactionId?: string) {

		if (this.telemetryConfig.DiagnosticLevel >= DiagnosticLevel.Error) {
			transactionId = this.getCorrelationId(transactionId);
			try {
				properties = this.buildCommonLogProperties(properties, source, null, exception.stack);
				this.loggingStrategy.logException(exception, this.addPropertyBagValues(properties, transactionId, source), measurements, transactionId);
			}
			catch (exception) {
				this.internalCustomLog(exception);
			}
		}
	}

	/**
   * Diagnostic method to log warning
   * @method Fxp.telemetry.fxpLogger#logWarning
   * @param {string} warningMessage - Message which needs to be logged.      
   * @param {string} transactionId - Transaction id to uniquely identify a single transaction.      
   */
	logWarning(source: string,
		message: string,
		properties?: LogPropertyBag,
		measurements?: LogMetricBag,
		transactionId?: string) {
		if (this.telemetryConfig.DiagnosticLevel >= DiagnosticLevel.Warning) {
			transactionId = this.getCorrelationId(transactionId);
			try {
				properties = this.buildCommonLogProperties(properties, source, null, null);
				this.loggingStrategy.logWarning(message, this.addPropertyBagValues(properties, transactionId, source), measurements, transactionId);
			}
			catch (exception) {
				this.internalCustomLog(exception);
			}
		}
	}

	/**
	* Diagnostic method to log Information
	* @method Fxp.telemetry.fxpLogger#logInformation
	* @param {string} informationMessage - Message which needs to be logged.      
	* @param {string} transactionId - Transaction id to uniquely identify a single transaction.       
	*/
	logInformation(source: string,
		message: string,
		properties?: LogPropertyBag,
		measurements?: LogMetricBag,
		transactionId?: string) {
		if (this.telemetryConfig.DiagnosticLevel >= DiagnosticLevel.Info) {
			transactionId = this.getCorrelationId(transactionId);
			try {
				properties = this.buildCommonLogProperties(properties, source, null, null);
				this.loggingStrategy.logInformation(message, this.addPropertyBagValues(properties, transactionId, source), measurements, transactionId);
			}
			catch (exception) {
				this.internalCustomLog(exception);
			}
		}
	}


	/**
	 * Diagnostic method to log Custom Events
	 * @method Fxp.telemetry.fxpLogger#logCustomEvents
	 * @param {string} customEventName - Event Name to be logged.   
	 * @param {logPropertyBag} propBag - Property bag which can hold key value pairs.    
	 * @param {string} transactionId - Transaction id to uniquely identify a single transaction.    
	 */
	logEvent(source: string,
		eventName: string,
		properties?: LogPropertyBag,
		measurements?: LogMetricBag,
		transactionId?: string) {
		if (this.telemetryConfig.EventEnabled) {
			transactionId = this.getCorrelationId(transactionId);
			try {
				properties = this.buildCommonLogProperties(properties, source, null, null);
				this.loggingStrategy.logEvent(eventName, this.addPropertyBagValues(properties, transactionId, source), measurements, transactionId);
			}
			catch (exception) {
				this.internalCustomLog(exception);
			}
		}
	}

	/**
	 * Diagnostic method to log trace
	 * @param {string} source - Source
	 * @param {string} message - Message which needs to be logged.
	 * @param {LogPropertyBag} properties - log properties        
	 * @param {string} transactionId - Transaction id to uniquely identify a single transaction.
	 */
	logTrace(source: string,
		message: string,
		properties?: LogPropertyBag,
		transactionId?: string) {
		if (this.telemetryConfig.DiagnosticLevel == DiagnosticLevel.Verbose) {
			transactionId = this.getCorrelationId(transactionId);
			try {
				properties = this.buildCommonLogProperties(properties, source, null, null);
				this.loggingStrategy.logTrace(message, this.addPropertyBagValues(properties, transactionId, source), transactionId);
			}
			catch (exception) {
				this.internalCustomLog(exception);
			}
		}
	}

	/**
	 * Diagnostic method to log Track page view
	 * @method Fxp.telemetry.fxpLogger#trackPageView
	 * @param {string} source - Source
	 * @param {string} url - url of the view
	 * @param {LogPropertyBag} properties - log properties
	 * @param {LogMetricBag} measurements - log metrics
	 * @param {string} transactionId - Transaction id to uniquely identify a single transaction.
	 */
	trackPageView(pageName: string,
		url?: string,
		properties?: LogPropertyBag,
		measurements?: LogMetricBag,
		duration?: number,
		transactionId?: string) {

		transactionId = this.getCorrelationId(transactionId);
		try {
			this.loggingStrategy.trackPageView(pageName, url, this.addPropertyBagValues(properties, transactionId), measurements, duration, transactionId);
		}
		catch (exception) {
			this.internalCustomLog(exception);
		}
	}
	/**
	* Diagnostic method to log metrics
	* @method Fxp.telemetry.fxpLogger#trackPageView
	* @param {string} source - Source
	* @param {string} metricName - name of the metric to be logged
	* @param {LogPropertyBag} properties - log properties        
	* @param {string} transactionId - Transaction id to uniquely identify a single transaction.
	*/
	logMetric(source: string, metricName: string,
		metricValue: number,
		properties?: LogPropertyBag,
		transactionId?: string) {
		if (this.telemetryConfig.PerformanceMetricEnabled) {
			transactionId = this.getCorrelationId(transactionId);
			try {
				properties = this.buildCommonLogProperties(properties, source, null, null);
				this.loggingStrategy.logMetric(metricName, metricValue, this.addPropertyBagValues(properties, transactionId, source), transactionId);
			}
			catch (exception) {
				this.internalCustomLog(exception);
			}
		}
	}

	/**
	* Diagnostic method to log feature usage events
	* @method Fxp.telemetry.fxpLogger#logFeatureUsageEvent
	* @param {string} source - Source
	* @param {FeatureUsageEvent} eventData - event data that is to be logged
	* @param {LogPropertyBag} properties - log properties
	* @param {LogMetricBag} measurements - log metrics
	*/
	logFeatureUsageEvent(source: string, eventData: FeatureUsageEvent,
		properties?: LogPropertyBag,
		measurements?: LogMetricBag) {
		if (this.telemetryConfig.EventEnabled) {
			try {
				properties = this.buildCommonLogProperties(properties, source, null, null);
				this.fxpLoggerServiceExtension.logFeatureUsageEvent(eventData, this.addPropertyBagValues(properties, eventData.Xcv, source), measurements)
			}
			catch (exception) {
				this.internalCustomLog(exception);
			}
		}
	}

	/**
	 * Diagnostic method to log System events
	 * @method Fxp.telemetry.fxpLogger#logSystemEvent
	 * @param {string} source - Source
	 * @param {FeatureUsageEvent} eventData - event data that is to be logged
	 * @param {LogPropertyBag} properties - log properties
	 * @param {LogMetricBag} measurements - log metrics
	 */
	logSystemEvent(source: string, eventData: SystemEvent,
		properties?: LogPropertyBag,
		measurements?: LogMetricBag) {
		if (this.telemetryConfig.EventEnabled) {
			try {
				properties = this.buildCommonLogProperties(properties, source, null, null);
				this.fxpLoggerServiceExtension.logTrackSystemEvent(eventData, this.addPropertyBagValues(properties, eventData.Xcv, source), measurements)
			}
			catch (exception) {
				this.internalCustomLog(exception);
			}
		}
	}
	/**
	 * Diagnostic method to log business process events
	 * @method Fxp.telemetry.fxpLogger#logBusinessProcessEvent
	 * @param {string} source - Source
	 * @param {FeatureUsageEvent} eventData - event data that is to be logged
	 * @param {LogPropertyBag} properties - log properties
	 * @param {LogMetricBag} measurements - log metrics
	 */
	logBusinessProcessEvent(source: string, eventData: BusinessProcessEvent,
		properties?: LogPropertyBag,
		measurements?: LogMetricBag) {
		if (this.telemetryConfig.EventEnabled) {
			try {
				properties = this.buildCommonLogProperties(properties, source, null, null);
				this.fxpLoggerServiceExtension.logBusinessProcessEvent(eventData, this.addPropertyBagValues(properties, eventData.Xcv, source), measurements)
			}
			catch (exception) {
				this.internalCustomLog(exception);
			}
		}
	}
	/**
	 * Diagnostic method to set Correlation Provider
	 * @method Fxp.telemetry.fxpLogger#setCorrelationProvider
	 * @param {Fxp.Interfaces.ICorrelationProvider} correlationProvider        
	 */
	public setCorrelationProvider(correlationProvider: ICorrelationProvider) {
		this.correlationProvider = correlationProvider;
	}

	/**
	 * To Builds log properties that are common to all methods
	 * @param properties
	 * @param source
	 * @param errorCode
	 * @param stackTrace
	 */
	private buildCommonLogProperties(properties: LogPropertyBag, source: string,
		errorCode: string, stackTrace: string) {
		var logProperties;
		logProperties = properties || this.createPropertyBag();
		logProperties.addToBag('Source', source);

		if (!CommonUtils.isNullOrEmpty(errorCode))
			logProperties.addToBag('ErrorCode', errorCode);

		if (!CommonUtils.isNullOrEmpty(stackTrace))
			logProperties.addToBag('StackTrace', stackTrace);

		return logProperties;
	}
	/**
	 * To add User Role Group Details  properties that are common to all methods
	 * @param properties
	 */
	private addUserRoleGroupDetails(eventProperties: LogPropertyBag) {
		if (this.loggedInUserContext) {
			eventProperties.addToBag(RoleGroupDetails.LOGGEDINUSERROLEGROUPID, this.loggedInUserContext.RoleGroupId == undefined ? "" : this.loggedInUserContext.RoleGroupId);
			eventProperties.addToBag(RoleGroupDetails.LOGGEDINUSERROLEGROUPNAME, this.loggedInUserContext.RoleGroupName == undefined ? "" : this.loggedInUserContext.RoleGroupName);
		}
		if (this.isObo && this.OBOUserContext) {
			eventProperties.addToBag(RoleGroupDetails.OBOROLEGROUPID, this.OBOUserContext.RoleGroupId == undefined ? "" : this.OBOUserContext.RoleGroupId);
			eventProperties.addToBag(RoleGroupDetails.OBOROLEGROUPNAME, this.OBOUserContext.RoleGroupName == undefined ? "" : this.OBOUserContext.RoleGroupName);
		}
		return eventProperties;
	}

	/**
	 * To add loggedIn user tenant properties that are common to all methods
	 * @param properties
	 */
	private addUserTenantDetails(eventProperties: LogPropertyBag) {
		if (this.loggedInUserContext) {
			eventProperties.addToBag(TenantDetails.LOGGEDINUSERTENANTKEY, this.loggedInUserContext == undefined ? "" : this.loggedInUserContext.TenantKey);
			eventProperties.addToBag(TenantDetails.LOGGEDINUSERTENANTNAME, this.loggedInUserContext.TenantName == undefined ? "" : this.loggedInUserContext.TenantName);
		}
		if (this.isObo && this.OBOUserContext) {
			eventProperties.addToBag(TenantDetails.OBOTENANTKEY, this.OBOUserContext == undefined ? "" : this.OBOUserContext.TenantKey);
			eventProperties.addToBag(TenantDetails.OBOTENANTNAME, this.OBOUserContext.TenantName == undefined ? "" : this.OBOUserContext.TenantName);
		}
		return eventProperties;
	}
	private addPropertyBagValues(eventProperties: LogPropertyBag, transactionId?: string, source?: string) {
		var eventProperties = eventProperties || new LogPropertyBag();
		eventProperties = this.addEnvironmentDetails(eventProperties, transactionId, source);
		eventProperties = this.addUserRoleGroupDetails(eventProperties);
		eventProperties = this.addUserTenantDetails(eventProperties);
		return eventProperties
	}
	/**
	 * Adds environment detials to property bag
	 * @param properties
	 * @param transactionId
	 */
	private addEnvironmentDetails(eventProperties: LogPropertyBag, transactionId?: string, source?: string) {
		var appName = (CommonUtils.isNullOrEmpty(source)) ? "FXP" : source.split('.')[0];
		//get Environment details based on appName if environment details is not avilable then getting fxp environment details 
		var environmentData = TelemetryContext.CurrentContext.getEnvironmentDetails(appName) || TelemetryContext.CurrentContext.getEnvironmentDetails("FXP");
		var globalProperties = TelemetryContext.CurrentContext.getGlobalPropertyBag();
		eventProperties.addRange(globalProperties);
		if (environmentData != null) {
			eventProperties.addToBag(EnvironmentData.ENVIRONMENTNAME, environmentData.EnvironmetName == null ? "" : environmentData.EnvironmetName);
			eventProperties.addToBag(EnvironmentData.SERVICEOFFERING, environmentData.ServiceOffering == null ? "" : environmentData.ServiceOffering);
			eventProperties.addToBag(EnvironmentData.SERVICELINE, environmentData.ServiceLine == null ? "" : environmentData.ServiceLine);
			eventProperties.addToBag(EnvironmentData.PROGRAM, environmentData.Program == null ? "" : environmentData.Program);
			eventProperties.addToBag(EnvironmentData.CAPABILITY, environmentData.Capability == null ? "" : environmentData.Capability);
			eventProperties.addToBag(EnvironmentData.COMPONENTNAME, environmentData.ComponentName == null ? "" : environmentData.ComponentName);
			eventProperties.addToBag(EnvironmentData.XCV, transactionId == null ? "" : transactionId);
			eventProperties.addToBag(EnvironmentData.AIAPPKEY, this.telemetryConfig.InstrumentationKey == null ? "" : this.telemetryConfig.InstrumentationKey);
			eventProperties.addToBag(EnvironmentData.LOGGEDFROM, environmentData.AppName == null ? "" : environmentData.AppName);
			eventProperties.addToBag(EnvironmentData.ICTOID, environmentData.IctoId == null ? "" : environmentData.IctoId);
			eventProperties.addToBag(EnvironmentData.BUSINESSPROCESSNAME, environmentData.BusinessProcessName == null ? "" : environmentData.BusinessProcessName);
		}
		return eventProperties;
	}
	/**
	 * logs error to console
	 * @param exception
	 */
	private internalCustomLog(exception) {
		if (this.telemetryConfig.DebugEnabled)
			console.error(TelemetryConstants.ERRORPREFIX + JSON.stringify(exception));
	}
	/**
	 * gets correlationId
	 * @param correlationId
	 */
	private getCorrelationId(correlationId: string): string {
		if (CommonUtils.isNullOrEmpty(correlationId)) {
			if (CommonUtils.isNullOrEmpty(this.correlationProvider))
				return $.correlator.getCorrelationId();
			else
				return this.correlationProvider.getCorrelationId();
		}

		return correlationId;
	}
}
