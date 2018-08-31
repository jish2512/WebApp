/**
    * A service to connect to FxpLoggerServiceExtension to log businessprocess,featureusage,systemevent etc.,
    * @class FxpTelemetry.FxpLoggerServiceExtension
    * @classdesc A service to connect to FxpLoggerServiceExtension to log businessprocess,featureusage,systemevent etc.,
    * @example <caption> Example to create an instance of FxpLoggerServiceExtension service</caption>
    *  //Initializing Fxp FxpLoggerServiceExtension Service
    *  angular.module('FxPApp').controller('AppController', ['FxpLoggerServiceExtension', AppController]);
    *  function AppController(FxpLoggerServiceExtension){ FxpLoggerServiceExtension.logBusinessProcessEvent(); }
    */

import { LogPropertyBag } from './LogPropertyBag';
import { LogMetricBag } from './LogMetricBag';
import { BusinessProcessEvent } from './BusinessProcessEvent';
import { FeatureUsageEvent } from './FeatureUsageEvent';
import { SystemEvent } from './SystemEvent';
import { GlobalExceptionHandler } from './GlobalExceptionHandler';
//import 'script-loader!./../lib/msit.telemetry.extensions.ai.javascript';

declare module Telemetry {
	module Extensions {
		module AI {
			class AppInsights {
			}
		}
	}
}

var MsitTelemetry:any= Telemetry.Extensions.AI;


export class FxpLoggerServiceExtension {
	private msitInstance: any;
	private appIngishtInstance: any;
	constructor() {
		this.msitInstance = new MsitTelemetry.AppInsights();
		this.appIngishtInstance = GlobalExceptionHandler.getAppInsightsInstance();
	}

	/**
	* Diagnostic method to log business process events
	* @method FxpTelemetry.fxpLogger#logBusinessProcessEvent
	* @param {string} source - Source
	* @param {FeatureUsageEvent} eventData - event data that is to be logged
	* @param {Fxp.Telemetry.Helper.LogPropertyBag} properties - log properties
	* @param {Fxp.Telemetry.Helper.LogMetricBag} measurements - log metrics
	*/
	logBusinessProcessEvent(eventData: BusinessProcessEvent, properties?: LogPropertyBag,
		measurements?:LogMetricBag) {
		this.msitInstance.TrackBusinessProcessEvent(this.appIngishtInstance, eventData, properties == null ? null : properties.getItems(), measurements == null ? null : measurements.getItems());
	}

	/**
	* Diagnostic method to log Feature Usage events
	* @method FxpTelemetry.FxpLoggerServiceExtension#logFeatureUsageEvent
	* @param {string} source - Source
	* @param {FeatureUsageEvent} eventData - event data that is to be logged
	* @param {Fxp.Telemetry.Helper.LogPropertyBag} properties - log properties
	* @param {Fxp.Telemetry.Helper.LogMetricBag} measurements - log metrics
	*/
	logFeatureUsageEvent(eventData: FeatureUsageEvent, properties?: LogPropertyBag,
		measurements?: LogMetricBag) {
		this.msitInstance.TrackFeatureUsageEvent(this.appIngishtInstance, eventData, properties == null ? null : properties.getItems(), measurements == null ? null : measurements.getItems());
	}

	/**
	* Diagnostic method to log Track System events
	* @method FxpTelemetry.FxpLoggerServiceExtension#logTrackSystemEvent
	* @param {string} source - Source
	* @param {FeatureUsageEvent} eventData - event data that is to be logged
	* @param {Fxp.Telemetry.Helper.LogPropertyBag} properties - log properties
	* @param {Fxp.Telemetry.Helper.LogMetricBag} measurements - log metrics
	*/
	logTrackSystemEvent(eventData: SystemEvent, properties?: LogPropertyBag,
		measurements?: LogMetricBag) {
		this.msitInstance.TrackSystemEvent(this.appIngishtInstance, event, properties == null ? null : properties.getItems(), measurements == null ? null : measurements.getItems());
	}
}