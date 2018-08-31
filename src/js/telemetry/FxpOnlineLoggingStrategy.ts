import { LogPropertyBag } from "./LogPropertyBag";
import { LogMetricBag } from "./LogMetricBag";
import { ILoggingStrategy } from "../interfaces/ILoggingStrategy";
import { ITelemetryContextListener } from "../interfaces/ITelemetryContextListener";
import { TelemetryContext } from "./telemetrycontext";
import { TelemetryConfiguration } from "./TelemetryConfiguration";
import { CommonUtils } from "../utils/CommonUtils";
import { EnvironmentData } from "./TelemetryConst";
declare var FxpAppSettings: any;
import {AppInsights} from "applicationinsights-js";
declare type Envelope = any;

/**
 * @application  Fxp
 */
/** 
    * A service to connect to FxpOnlineLoggingStrategy to log erros while online,exceptions,info,events and metrics etc.,
    * @class Fxp.Telemetry.FxpOnlineLoggingStrategy
    * @classdesc A service to connect to FxpOnlineLoggingStrategy to log erros,exceptions,info,events and metrics etc.,
    * @example <caption> Example to create an instance of FxpOnlineLoggingStrategy service</caption>
    *  //Initializing Fxp Logger Service
    *  angular.module('FxPApp').controller('AppController', ['FxpOnlineLoggingStrategy', AppController]);
    *  function AppController(FxpLoggerService){ FxpLoggerService.logError(source); }
    */
export class FxpOnlineLoggingStrategy implements ILoggingStrategy, ITelemetryContextListener {

	 appInsights: AppInsights;
	context: TelemetryContext;

	constructor(telemetryConfiguration: TelemetryConfiguration, appInsights: AppInsights, fxpTelemetryContext: TelemetryContext) {
		if (!appInsights) {
			this.appInsights = window["appInsight"];
		}
		else {
			this.appInsights = appInsights;
		}
        
		this.appInsights.config.instrumentationKey = telemetryConfiguration.InstrumentationKey;
		fxpTelemetryContext.addContextChangeListener(this);
		this.context = fxpTelemetryContext;
		var telemetryInitializer = {
			init: (envelope: Envelope) => {
				var telemetryItem = (<any>envelope.data).baseData;
				telemetryItem.properties = telemetryItem.properties || {};

				if (CommonUtils.isNullOrEmpty(telemetryItem.properties[EnvironmentData.XCV])) {
					telemetryItem.properties[EnvironmentData.XCV] = $.correlator.getCorrelationId();
				}
				if (CommonUtils.isNullOrEmpty(telemetryItem.properties[EnvironmentData.ENVIRONMENTNAME]))
					telemetryItem.properties[EnvironmentData.ENVIRONMENTNAME] = FxpAppSettings.EnvironmentName == null ? "" : FxpAppSettings.EnvironmentName;
				if (CommonUtils.isNullOrEmpty(telemetryItem.properties[EnvironmentData.SERVICEOFFERING]))
					telemetryItem.properties[EnvironmentData.SERVICEOFFERING] = FxpAppSettings.ServiceOffering == null ? "" : FxpAppSettings.ServiceOffering;
				if (CommonUtils.isNullOrEmpty(telemetryItem.properties[EnvironmentData.SERVICELINE]))
					telemetryItem.properties[EnvironmentData.SERVICELINE] = FxpAppSettings.ServiceLine == null ? "" : FxpAppSettings.ServiceLine;
				if (CommonUtils.isNullOrEmpty(telemetryItem.properties[EnvironmentData.PROGRAM]))
					telemetryItem.properties[EnvironmentData.PROGRAM] = FxpAppSettings.Program == null ? "" : FxpAppSettings.Program;
				if (CommonUtils.isNullOrEmpty(telemetryItem.properties[EnvironmentData.CAPABILITY]))
					telemetryItem.properties[EnvironmentData.CAPABILITY] = FxpAppSettings.Capability == null ? "" : FxpAppSettings.Capability;
				if (CommonUtils.isNullOrEmpty(telemetryItem.properties[EnvironmentData.COMPONENTNAME]))
					telemetryItem.properties[EnvironmentData.COMPONENTNAME] = FxpAppSettings.ComponentName == null ? "" : FxpAppSettings.ComponentName;
				if (CommonUtils.isNullOrEmpty(telemetryItem.properties[EnvironmentData.ICTOID]))
					telemetryItem.properties[EnvironmentData.ICTOID] = FxpAppSettings.IctoId == null ? "" : FxpAppSettings.IctoId;

				return true;
			}
		}

		this.appInsights.context.addTelemetryInitializer(telemetryInitializer.init);
	}

	/**
	 * Diagnostic method to log error
	 * @param {string} message - message which is to be logged
	 * @param {string} errorCode - error code of message which is to be logged
	 * @param {string} stackTrace - stacktrace which is to be logged
	 * @param {Fxp.Telemetry.Helper.LogPropertyBag} properties - log properties
	 * @param {Fxp.Telemetry.Helper.LogMetricBag} measurements - log metrics
	 * @param {string} transactionId - Transaction id to uniquely identify a single transaction.
	 */
	logError(message: string,
		errorCode: string,
		stackTrace: string,
		properties?: LogPropertyBag,
		measurements?: LogMetricBag,
		transactionId?: string) {

		var error = new Error();
		error.message = message;
		error.stack = stackTrace;

		this.logException(error, properties, measurements, transactionId);
	}

	/**
	 * Diagnostic method to log exception
	 * @param {exception} exception - exception which is to be logged
	 * @param {Fxp.Telemetry.Helper.LogPropertyBag} properties - properties to be logged
	 * @param {Fxp.Telemetry.Helper.LogMetricBag} measurements - metrics to be logged
	 * @param {string} transactionId - Transaction id to uniquely identify a single transaction.
	 */
	logException(exception: Error,
		properties?: LogPropertyBag,
		measurements?: LogMetricBag,
		transactionId?: string) {

		this.appInsights.context.operation.id = transactionId == null ? "" : transactionId;

		this.appInsights.trackException(exception, exception.stack, properties == null ? null : properties.getItems(), measurements == null ? null : measurements.getItems());
	}

	/**
	 * Diagnostic method to log warning
	 * @param {string} message - message which is to be logged
	 * @param {Fxp.Telemetry.Helper.LogPropertyBag} properties - log properties
	 * @param {Fxp.Telemetry.Helper.LogMetricBag} measurements - log metrics
	 * @param {string} transactionId - Transaction id to uniquely identify a single transaction.
	 */
	logWarning(message: string,
		properties?: LogPropertyBag,
		measurements?: LogMetricBag,
		transactionId?: string) {

		this.appInsights.context.operation.id = transactionId == null ? "" : transactionId;

		this.appInsights.trackEvent(message, properties == null ? null : properties.getItems(), measurements == null ? null : measurements.getItems());
	}

	/**
	 * Diagnostic method to log information
	 * @param {string} message - message which is to be logged
	 * @param {Fxp.Telemetry.Helper.LogPropertyBag} properties - log properties
	 * @param {Fxp.Telemetry.Helper.LogMetricBag} measurements - log metrics
	 * @param {string} transactionId - Transaction id to uniquely identify a single transaction.
	 */
	logInformation(message: string,
		properties?: LogPropertyBag,
		measurements?: LogMetricBag,
		transactionId?: string) {

		this.appInsights.context.operation.id = transactionId == null ? "" : transactionId;

		this.appInsights.trackEvent(message, properties == null ? null : properties.getItems(), measurements == null ? null : measurements.getItems());
	}

	/**
	 * Diagnostic method to log trace
	 * @param {string} message - message which is to be logged
	 * @param {Fxp.Telemetry.Helper.LogPropertyBag} properties - log properties
	 * @param {string} transactionId - Transaction id to uniquely identify a single transaction.
	 */
	logTrace(message: string,
		properties?: LogPropertyBag,
		transactionId?: string) {

		this.appInsights.context.operation.id = transactionId == null ? "" : transactionId;

		this.appInsights.trackTrace(message, properties == null ? null : properties.getItems());
	}

	/**
	 * Diagnostic method to log event
	 * @param {string} eventName - event name which is to be logged
	 * @param {Fxp.Telemetry.Helper.LogPropertyBag} properties - log properties
	 * @param {Fxp.Telemetry.Helper.LogMetricBag} measurements - log metrics
	 * @param {string} transactionId - Transaction id to uniquely identify a single transaction.
	 */
	logEvent(eventName: string,
		properties?: LogPropertyBag,
		measurements?: LogMetricBag,
		transactionId?: string) {

		this.appInsights.context.operation.id = transactionId == null ? "" : transactionId;

		this.appInsights.trackEvent(eventName, properties == null ? null : properties.getItems(), measurements == null ? null : measurements.getItems());
	}

	startTrackEvent(eventName: string) {
		this.appInsights.startTrackEvent(eventName);
	}

	stopTrackEvent(eventName: string,
		properties?: LogPropertyBag,
		measurements?: LogMetricBag,
		transactionId?: string) {

		this.appInsights.context.operation.id = transactionId == null ? "" : transactionId;
		this.appInsights.stopTrackEvent(eventName, properties == null ? null : properties.getItems(), measurements == null ? null : measurements.getItems());
	}

	/**
	 * tracking method to track page view
	 * @param {string} pageName - name of the page to be tracked
	 * @param {string} url - url of the page
	 * @param {Fxp.Telemetry.Helper.LogPropertyBag} properties - log properties
	 * @param {Fxp.Telemetry.Helper.LogMetricBag} measurements - log metrics
	 * @param {number} duration - number
	 * @param {string} transactionId - Transaction id to uniquely identify a single transaction.
	 */
	trackPageView(pageName: string,
		url?: string,
		properties?: LogPropertyBag,
		measurements?: LogMetricBag,
		duration?: number,
		transactionId?: string) {

		this.appInsights.context.operation.id = transactionId == null ? "" : transactionId;
		this.appInsights.trackPageView(pageName,
			url,
			properties == null ? null : properties.getItems(), measurements == null ? null : measurements.getItems(),
			duration);
	}

	/**
	 * Diagnostic method to log metrics
	 * @param {string} metricName - name of the metric to be logged
	 * @param {number} metricValue - value of the metric
	 * @param {Fxp.Telemetry.Helper.LogPropertyBag} properties - log properties
	 * @param {string} transactionId - Transaction id to uniquely identify a single transaction.
	 */
	logMetric(metricName: string,
		metricValue: number,
		properties?: LogPropertyBag,
		transactionId?: string) {

		this.appInsights.context.operation.id = transactionId == null ? "" : transactionId;
		this.appInsights.trackMetric(metricName, metricValue, 0, 0, 0, properties == null ? null : properties.getItems());
	}

	/**
	 * notify method
	 */
	notify() {
		this.setContextInfo();
	}

	private setContextInfo() {
		var userId = this.context.getUserID();
		if (!CommonUtils.isNullOrEmpty(userId))
			this.appInsights.setAuthenticatedUserContext(userId, this.context.getUserRole());

		this.appInsights.context.user.accountId = this.context.getUserRole();
		this.appInsights.context.session.id = this.context.getSessionID();
		this.appInsights.context.application.ver = this.context.getAppVersion();
		this.appInsights.context.location.ip = this.context.getGeography();
	}
}
