
/**
 * @application  Fxp
 */
/**
 * @module Fxp.Services
 */
/**
 * A service to keep all the configurations used for the application in 
 * @class Fxp.Services.FxpConfiguration
 * @classdesc A service to keep all the settings required for base, application and telemetry settings  
 * @example <caption> Example to use one from FxpConfiguration</caption>    
 *  //Using in a Controller
 *  angular.module('FxPApp').controller('AppController', ['FxpConfigurationService', AppController]);
 *  function AppController(fxpConfigurationService){ var appSettings = fxpConfigurationService.fxpAppSettings; }
 */
export class FxpConfigurationService {

	private fxpAppSettings = window["FxpAppSettings"];
	//TODO: Below two config's should be fetched through Confit service connected from client side
	private fxpBaseConfiguration = window["FxpBaseConfiguration"];
	private modelConfiguration = window["ModelConfiguration"];

	get FxpAppSettings(): any {
		return this.fxpAppSettings;
	}

	get FxpBaseConfiguration(): any {
		return this.fxpBaseConfiguration;
	}

	get ModelConfiguration(): any {
		return this.modelConfiguration;
	}

	GetConfiguration(config: string): any {

		if (window["tenantConfiguration"] && window["tenantConfiguration"][config]) {
			return window["tenantConfiguration"][config];
		}
		else if (this.FxpBaseConfiguration && this.FxpBaseConfiguration[config]) {
			return this.FxpBaseConfiguration[config];
		}
		else if (this.FxpAppSettings && this.FxpAppSettings[config]) {
			return this.FxpAppSettings[config];
		}
		else return;

	}

}