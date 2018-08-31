import { LogPropertyBag } from "./LogPropertyBag";
import { LogMetricBag } from "./LogMetricBag";
import { FxpLogHelper } from "./FxpLogHelper";
import { TelemetryContext } from "./telemetrycontext";
import { TracingLevel } from "./TelemetryConst";


/**
   * Telmetry helper file to hold the object of telemetry.
   * @class Fxp.Telemetry.Helper.TelemetryData
   * @classdesc A telmetry helper file to hold the object of telemetry.
   * @example <caption> 
   * //To Use Telemetry.Helper.TelemetryData
   * var telemetryData = new Fxp.Telemetry.Helper.TelemetryData();
   */
export class TelemetryData {
	logType: string = "";
	errorMsg: string = "";
	errorCode: string = "";
	stackTrace: string = "";
	metricName: string = "";
	metricValue: number;
	warnMsg: string = "";
	traceMsg: string = "";
	infoMsg: string = "";
	eventName: string = "";
	propertyBag: LogPropertyBag = null;
	metricBag: LogMetricBag = null;
	transactionID: string = "";

	/**
	* Method to get the telemetry data object in json format.
	* @method Fxp.Telemetry.Helper.TelemetryData().toJsonString()
	* @example Example to use new Fxp.Telemetry.Helper.TelemetryData().toJsonString()
	*/
	toJsonString(): string {
		var jsonObject = this.toJson();

		return JSON.stringify(jsonObject);
	}

	/**
	* Method to get the telemetry data object in json format.
	* @method Fxp.Telemetry.Helper.TelemetryData().toJson()
	* @example Example to use new Fxp.Telemetry.Helper.TelemetryData().toJson()
	*/
	private toJson(): any {
		var jsonObject: any = {};
		var context = new TelemetryContext();

		jsonObject.LogData = {
			LogInfo: {
				TransactionId: this.transactionID,
				TransactionTime: FxpLogHelper.getTimeStamp(),
				LogId: FxpLogHelper.getTelemetryUniqueKey()
			},
			Context: {
				SessionId: context.getSessionID(),
				UserId: context.getUserID(),
				UserRole: context.getUserRole(),
				AppName: context.getAppName(),
				AppVersion: context.getAppVersion(),
				Geography: context.getGeography()
			},
			TelemetryInfo: {
				Type: this.logType,
				Properties: {}
			}
		};

		if (this.propertyBag != null) {
			jsonObject.LogData.TelemetryInfo.Properties = this.propertyBag.getItems();
		}

		//METRICS
		if (this.metricBag != null) {
			jsonObject.LogData.TelemetryInfo.Metrics = this.metricBag.getItems();
		}

		switch (this.logType) {
			case TracingLevel.ERROR:
				jsonObject.LogData.TelemetryInfo.ErrorMsg = this.errorMsg;
				jsonObject.LogData.TelemetryInfo.ErrorCode = this.errorCode;
				break;
			case TracingLevel.WARNING:
				jsonObject.LogData.TelemetryInfo.WarnMsg = this.warnMsg;
				break;
			case TracingLevel.TRACE:
				jsonObject.LogData.TelemetryInfo.TraceMsg = this.traceMsg;
				break;
			case TracingLevel.INFORMATION:
				jsonObject.LogData.TelemetryInfo.InfoMsg = this.infoMsg;
				break;
			case TracingLevel.CUSTOMEVENT:
				jsonObject.LogData.TelemetryInfo.EventName = this.eventName;
				break;
			case TracingLevel.Metric:
				jsonObject.LogData.TelemetryInfo.MetricName = this.metricName;
				jsonObject.LogData.TelemetryInfo.MetricValue = this.metricValue;
		}

		return jsonObject.LogData;
	}
}