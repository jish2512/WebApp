/*Fxp.GlobalExceptionHandler can be used to method when Angular boot fails*/
//import 'script-loader!./../lib/msit.jquery.ajax.correlator.0.1.0-build26041';
//import 'script-loader!./../lib/msit.telemetry.extensions.ai.javascript';
//import 'script-loader!./../../../node_modules/applicationinsights-js/dist/ai.js';
import { showSystemDownOverlay } from "../utils/systemDownOverlay";
declare var FxpBaseConfiguration: any;
declare var FxpAppSettings: any
declare var Microsoft: any; 

export class GlobalExceptionHandler {

	/**
   * @method Fxp.GlobalExceptionHandler.getAppInsightsInstance to create a global instance of AI which can be used
			 from anywhere from the application.  
   */
	public static getAppInsightsInstance(): any {
        if (!window["appInsight"])
            window["appInsight"] = this.createAppInsightsInstance();
		return window["appInsight"];
	}
	/**
	* @method Fxp.GlobalExceptionHandler.logEvent to log Global Event
	* @param {any} eventName - Name of the log Event needs to be passed.
	* @param {string} source - source from where it is triggered.
	* @param {any} properties - extra details which needs to be logged.
	* @param {boolean} isDefaultPropertiesAvailable flag to check if default parameters are passed or not
	*/
	static logEvent(eventName: string, source: any, properties?: any, isDefaultPropertiesAvailable?: boolean): void {
		var appInsight = this.getAppInsightsInstance();
		if (appInsight) {
			var properties = properties || {};
			properties.Source = source;
			if (!isDefaultPropertiesAvailable) {
				properties = this.addDefaultProperties(properties);
			}
			appInsight.trackEvent(eventName, properties);
			console.log("Logged Global Event");
		}
	}

	/**
   * @method Fxp.GlobalExceptionHandler.logFxpBootFailure to log Global Event when Fxp App Boot Fails and redirect to System down page.
   * @param {any} properties - extra details which needs to be logged.
   * @param {string} source - source from where it is triggered.
   * @param {boolean} isDefaultPropertiesAvailable flag to check if default parameters are passed or not
   * @param {boolean} headerText for system down page.
   * @param {boolean} descriptionText for system down page.
   */
	static logFxpBootFailure(properties: any, source: string, isDefaultPropertiesAvailable: boolean, headerText: string, descriptionText: string, pageTitle: string) {
		this.logEvent("Fxp Boot App Failure", source, properties, isDefaultPropertiesAvailable);
		console.log("Logged Global Event");
		showSystemDownOverlay(headerText, descriptionText, pageTitle);
	}

	/**
	* Diagnostic method to log error
	* @method Fxp.GlobalExceptionHandler.logError to log Global Error when an exception needs to be logged if Angular Load Fails.
	* @param {any} error - exception object needs to be passed
	* @param {any} properties extra details which needs to be logged
	* @param {string} source - source from where it is triggered.
	*/
	static logError(error: any, properties: any, source: string): void {
		var appInsight = this.getAppInsightsInstance();
		var properties = properties || {};
		properties.Source = source;
		if (appInsight) {
			appInsight.trackException(error, null, this.addDefaultProperties(properties));
			console.log("Logged Exception");
		}
	}

	/**
   * @method Fxp.GlobalExceptionHandler.createAppInsightsObject to create internal AI object.
   */
	private static createAppInsightsInstance(): any {
        if (Microsoft && Microsoft.ApplicationInsights && Microsoft.ApplicationInsights.AppInsights && FxpBaseConfiguration && FxpBaseConfiguration.Telemetry) {
            var appInsight = new Microsoft.ApplicationInsights.AppInsights(Microsoft.ApplicationInsights.AppInsights.defaultConfig);
            appInsight.config.instrumentationKey = FxpBaseConfiguration.Telemetry.InstrumentationKey;
            return appInsight;
        }
		else
			return;
	}

	/**
   * @method Fxp.GlobalExceptionHandler.addDefaultProperties to log Global Event when Fxp App Boot Fails and redirect to System down page.
   * @param {any} properties - extra details which needs to be logged.
   */
	private static addDefaultProperties(properties?): any {
		var properties = properties || {};
		properties.EnvironmentName = FxpAppSettings.EnvironmentName;
		properties.ApplicationName = FxpAppSettings.ApplicationName;
		properties.EnableHttps = FxpAppSettings.EnableHttps;
		properties.ServiceOffering = FxpAppSettings.ServiceOffering;
		properties.FXPPageTitle = FxpAppSettings.FXPPageTitle;
		properties.ServiceLine = FxpAppSettings.ServiceLine;
		properties.Program = FxpAppSettings.Program;
		properties.Capability = FxpAppSettings.Capability;
		properties.AppName = FxpAppSettings.LoggedByApplication;
		properties.ComponentName = FxpAppSettings.ComponentName;
		properties.ApplicationTitle = FxpAppSettings.ApplicationTitle;
		properties.IctoId = FxpAppSettings.IctoId;
		properties.BusinessProcessName = FxpAppSettings.BusinessProcessName;
		return properties;
	}
}