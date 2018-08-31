import { LogPropertyBag } from './../telemetry/LogPropertyBag';
import { LogMetricBag } from './../telemetry/LogMetricBag';
import { FeatureUsageEvent } from '../telemetry/FeatureUsageEvent';
import { BusinessProcessEvent } from '../telemetry/BusinessProcessEvent';
import { ICorrelationProvider } from './ICorrelationProvider';

export interface ILogger {
	/**
	* Diagnostic method to log error
	* @abstract
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
		transactionId?: string): void;

	/**
	* Diagnostic method to log error
	* @abstract
	* @method Fxp.telemetry.fxpLogger#logError
	* @param {string} errorMsg - Message which needs to be logged.
	* @param {string} innerErrorMsg   - inner Error message which needs to be logged.
	* @param {string} stackTrace   - Stack Trace message which needs to be logged.
	* @param {string} transactionId - Transaction id to uniquely identify a single transaction.       
	*/
	logException(source: string,
		exception: Error,
		properties?: LogPropertyBag,
		measurements?: LogMetricBag,
		transactionId?: string): void;

	createMetricBag(): LogMetricBag

	createPropertyBag(): LogPropertyBag
	/**
	* Diagnostic method to log warning
	* @abstract
	* @method Fxp.telemetry.fxpLogger#logWarning
	* @param {string} warningMessage - Message which needs to be logged.      
	* @param {string} transactionId - Transaction id to uniquely identify a single transaction.       
	*/
	logWarning(source: string,
		message: string,
		properties?: LogPropertyBag,
		measurements?: LogMetricBag,
		transactionId?: string): void;
	/**
	* Diagnostic method to log Information
	* @abstract
	* @method Fxp.telemetry.fxpLogger#logInformation
	* @param {string} informationMessage - Message which needs to be logged.      
	* @param {string} transactionId - Transaction id to uniquely identify a single transaction.       
	*/
	logInformation(source: string,
		message: string,
		properties?: LogPropertyBag,
		measurements?: LogMetricBag,
		transactionId?: string): void;

	/**
	* Diagnostic method to log Custom Events
	 * @abstract
	* @method Fxp.telemetry.fxpLogger#logCustomEvents
	* @param {string} eventName - Event Name to be logged.   
	* @param {Fxp.telemetry.helper.logPropertyBag} propBag - Property bag which can hold key value pairs.    
	* @param {string} transactionId - Transaction id to uniquely identify a single transaction.      
	*/
	logEvent(source: string,
		eventName: string,
		properties?:LogPropertyBag,
		measurements?: LogMetricBag,
		transactionId?: string): void;

	/**
	* Diagnostic method to Track Page Views
	 * @abstract
	* @method Fxp.telemetry.fxpLogger#trackPageView
	* @param {string} pageName - Page Name visited.         
	*/
	trackPageView(pageName: string,
		url?: string,
		properties?: LogPropertyBag,
		measurements?: LogMetricBag,
		duration?: number,
		transactionId?: string): void;

	logMetric(source: string, metricName: string,
		metricValue: number,
		properties?: LogPropertyBag,
		transactionId?: string): void;

	logFeatureUsageEvent(source: string, eventData: FeatureUsageEvent,
		properties?: LogPropertyBag,
		measurements?: LogMetricBag): void;

	logBusinessProcessEvent(source: string, eventData: BusinessProcessEvent,
		properties?: LogPropertyBag,
		measurements?: LogMetricBag): void;

	logTrace(source: string,
		message: string,
		properties?: LogPropertyBag,
		transactionId?: string): void;

	setCorrelationProvider(correlationProvider: ICorrelationProvider): void;

	startTrackPerformance(eventName: string): void;

	stopTrackPerformance(eventName: string, source?: string,
		properties?: LogPropertyBag,
		measurements?: LogMetricBag,
		transactionId?: string): void;

	getPageLoadMetrics(): any;
	setPageLoadMetrics(value:any);

	logPageLoadMetrics(pageLoadTime?: number): void;
	setLoggedInUserContext(loggedInUserRoleId: string, loggedInUserRoleName: string, isOBO: boolean, loggedInUserTenantKey: string, loggedInUserTenantName: string): void;
	setOBOUserContext(OBOUserRoleId: string, OBOUserRoleName: string, isOBO: boolean, OBOUserTenantKey: string, OBOUserTenantName: string): void;
}