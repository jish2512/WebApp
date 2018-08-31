import { LogPropertyBag } from "../telemetry/LogPropertyBag";
import { LogMetricBag } from "../telemetry/LogMetricBag";

export interface ILoggingStrategy {
	logError(message: string,
		errorCode: string,
		stackTrace: string,
		properties?: LogPropertyBag,
		measurements?: LogMetricBag,
		transactionId?: string): void;

	logException(exception: Error,
		properties?: LogPropertyBag,
		measurements?: LogMetricBag,
		transactionId?: string): void;

	logWarning(message: string,
		properties?: LogPropertyBag,
		measurements?: LogMetricBag,
		transactionId?: string): void;

	logInformation(message: string,
		properties?: LogPropertyBag,
		measurements?: LogMetricBag,
		transactionId?: string): void;

	logTrace(message: string,
		properties?: LogPropertyBag,
		transactionId?: string): void;

	logEvent(eventName: string,
		properties?: LogPropertyBag,
		measurements?: LogMetricBag,
		transactionId?: string): void;

	logMetric(metricName: string,
		metricValue: number,
		properties?: LogPropertyBag,
		transactionId?: string): void;

	trackPageView(pageName: string,
		url?: string,
		properties?: LogPropertyBag,
		measurements?: LogMetricBag,
		duration?: number,
		transactionId?: string): void;

	startTrackEvent(eventName: string): void;

	stopTrackEvent(eventName: string, properties?: LogPropertyBag,
		measurements?: LogMetricBag,
		transactionId?: string): void;
}