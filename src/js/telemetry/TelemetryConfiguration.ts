import { DiagnosticLevel, TelemetryConfigDefaults } from "./TelemetryConst";


/**
    * A service for creating an object of default telemetry configuration
    * @class Fxp.Telemetry.TelemetryConfiguration
    * @classdesc A service for creating an object of default telemetry configuration
    * @example <caption> Example to create an instance of this service</caption>         
    *  //Initializing this Service
    *  var configuration = new Fxp.Telemetry.TelemetryConfiguration();
    */
export class TelemetryConfiguration {
	constructor() {

	}
	//DiagnosticLevel value should be 'Error' OR 'Information' OR 'Warning' OR 'Off'
	DiagnosticLevel: DiagnosticLevel = DiagnosticLevel.Error;
	//EventEnabled value should be true OR false
	EventEnabled: boolean = true;
	//PerformanceMetricEnabled value should be true OR false
	PerformanceMetricEnabled: boolean = true;
	PerfMarkersEnabled: boolean = false;
	InstrumentationKey: string = TelemetryConfigDefaults.InstrumentationKey;
	DebugEnabled: boolean = false;
	EndPointUrl: string = TelemetryConfigDefaults.EndPointUrl;

	/**
	* Gets Default Configuration of telemetry  
	* @method Fxp.Telemetry.TelemetryConfiguration.getDefaultConfiguration()
	* @example <caption> Example to invoke getUserThumbnail</caption>
	* var defaultConfig = Fxp.Telemetry.TelemetryConfiguration.getDefaultConfiguration();
	*/
	getDefaultConfiguration() {
		return this;
	}
}