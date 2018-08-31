import { LogPropertyBag } from "./LogPropertyBag";
import { LogMetricBag } from "./LogMetricBag";

/**
 * @application  Fxp
 */
/**
 * @module Fxp.Telemetry.Helper
 */

/**
   * Telmetry Log helper Class.
   * @class Fxp.Telemetry.Helper.FxpLogHelper
   * @classdesc Telmetry Log helper Class
   * @example <caption> 
   * //To Use Telemetry.Helper.FxpLogHelper
   * var telemetryData = new Fxp.Telemetry.Helper.FxpLogHelper();
   */
export class FxpLogHelper {
	/**
	* Method Create Property Bag Object.
	* @method Fxp.Telemetry.Helper.FxpLogHelper().createPropertyBag()
	* @example Example to use new Fxp.Telemetry.Helper.FxpLogHelper().createPropertyBag()
	*/
	static createPropertyBag(): LogPropertyBag {
		return new LogPropertyBag();
	}

	/**
	* Method Create Metric Bag Object.
	* @method Fxp.Telemetry.Helper.FxpLogHelper().createMetricBag()
	* @example Example to use new Fxp.Telemetry.Helper.FxpLogHelper().createMetricBag()
	*/
	static createMetricBag(): LogMetricBag {
		return new LogMetricBag();
	}

	/**
	* Method to Get Current Time Stamp
	* @method Fxp.Telemetry.Helper.FxpLogHelper().getTimeStamp()
	* @example Example to use new Fxp.Telemetry.Helper.FxpLogHelper().getTimeStamp()
	*/
	static getTimeStamp(): string {
		var currentDate = new Date();
		var day: any = currentDate.getDate(),
			month: any = currentDate.getMonth() + 1,
			year: any = currentDate.getFullYear(),
			hours: any = currentDate.getHours(),
			minutes: any = currentDate.getMinutes(),
			seconds: any = currentDate.getSeconds();
		if (day < 10)
			day = "0" + day;
		if (month < 10)
			month = "0" + month;
		if (minutes < 10)
			minutes = "0" + minutes;
		if (seconds < 10)
			seconds = "0" + seconds;
		var suffix = "AM";
		if (hours >= 12) {
			suffix = "PM";
			hours = hours - 12;
		}
		if (hours == 0) {
			hours = 12;
		}
		if (hours < 10)
			hours = "0" + hours;
		return day + '/' + month + '/' + year + ' ' + hours + ':' + minutes + ':' + seconds + ' ' + suffix;
	}

	/**
	* Method to Get Telemetry Unique Key
	* @method Fxp.Telemetry.Helper.FxpLogHelper().getTelemetryUniqueKey()
	* @example Example to use new Fxp.Telemetry.Helper.FxpLogHelper().getTelemetryUniqueKey()
	*/
	static getTelemetryUniqueKey(): string {
		var date = new Date();

		return date.getFullYear().toString() +
			this.pad2(date.getMonth() + 1) +
			this.pad2(date.getDate()) +
			this.pad2(date.getHours()) +
			this.pad2(date.getMinutes()) +
			this.pad2(date.getSeconds());
	}

	/**
	* Method to Get New SessionId
	* @method Fxp.Telemetry.Helper.FxpLogHelper().getNewSessionId()
	* @example Example to use new Fxp.Telemetry.Helper.FxpLogHelper().getNewSessionId()
	*/
	public static getNewSessionId(): string {
		var d: number = new Date().getTime();
		var guid: string = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
			var r = (d + Math.random() * 16) % 16 | 0;
			d = Math.floor(d / 16);
			return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
		});

		return guid;
	}

	private static pad2(n: number): string {
		return n < 10 ? '0' + n.toString() : n.toString()
	}
}