import { TelemetryContext } from "./telemetrycontext";
import { TelemetryConfiguration } from "./TelemetryConfiguration";
import { ILoggingStrategy } from "../interfaces/ILoggingStrategy";
import { GlobalExceptionHandler } from "./GlobalExceptionHandler";
import { FxpOnlineLoggingStrategy } from "./FxpOnlineLoggingStrategy";

/**
 * @application  Fxp
 */
/**
 * @module Fxp.Telemetry
 */

/**
    * A service for telemetry configuration to have the logging modes
    * @class Fxp.Telemetry.FxpLoggingStrategyFactory
    * @classdesc A service for telemetry configuration to have the logging modes
    * @example <caption> Example to create an instance of FxpLogging Strategy Factory</caption>         
    *  //Initializing FxpLoggingStrategyFactory
    *  angular.module('FxPApp').controller('AppController', ['FxpLoggingStrategyFactory', AppController]);
    *  function AppController(fxpLoggingStrategyFactory){ fxpLoggingStrategyFactory.GetLoggingStrategy(telemetryConfiguration); }
    */
export class FxpLoggingStrategyFactory {
	public GetLoggingStrategy(telemetryConfiguration: TelemetryConfiguration): ILoggingStrategy {
		var loggingStrategy = new FxpOnlineLoggingStrategy(telemetryConfiguration, GlobalExceptionHandler.getAppInsightsInstance(), new TelemetryContext());
		return loggingStrategy;
	}
}