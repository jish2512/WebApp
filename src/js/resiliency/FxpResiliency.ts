import { GlobalExceptionHandler } from "../telemetry/GlobalExceptionHandler";

///*Fxp.Resiliency can be used to method when Angular boot fails*/
export class Resiliency {
	private static resilientModules: any;
	private static failedModules: any;
	private static unavailablePartnerModules: any;
	private static hasChildren: boolean = false;
	public static statesWithMissingModules: any = [];

	public static get UnavailablePartnerModules() {
		return this.unavailablePartnerModules;
	}
	public static set UnavailablePartnerModules(value: any) {
		this.unavailablePartnerModules = value;
	}
	/**
   * @method Fxp.Resiliency.externalResourceLoadFailed to log Global Event when js cdn files is mispelled or not available.
   * @param {string} scriptName - name of the script file
   */
	static externalResourceLoadFailed(scriptName): void {
		var logMsg = "Unable to load resource: " + scriptName;
		GlobalExceptionHandler.logEvent("Fxp.ExternalResourceLoadFailed", "Fxp.Resiliency", { Details: logMsg }, false);
		console.error("Fxp Resiliency: ", logMsg);
	}


	/**
   * @method Fxp.Resiliency.getResilientModules to fetch modules which are resilient.
   * @param {any} modules -list of modules which needs to be injected
   */
	static getResilientModules(modules): any {
		// to capture all resilient modules 
		this.statesWithMissingModules = [];
		this.unavailablePartnerModules = [];
		this.resilientModules = [];
		modules.forEach(function (moduleName, i) {
			this.failedModules = [];
			if (this.checkModuleResiliency(moduleName))
				this.resilientModules.push(moduleName);
			else {
				this.unavailablePartnerModules.push(moduleName);
				this.failedModules.push(moduleName);
				this.logFailedModulesInfo(moduleName);
			}
		}, this);
		return this.resilientModules;
	}

	/**
	* @method Fxp.Resiliency.checkModuleResiliency to check if the modules are avaialble for FXP module injection .
	* @param {any} modules - modules whose resiliency needs to be checked
	*/
	private static checkModuleResiliency(module): boolean {
		try {
			var app = angular.module(module);
			if (app.requires.length > 0) {
				for (var i = 0; i < app.requires.length; i++) {
					if (!this.checkModuleResiliency(app.requires[i])) {
						this.failedModules.push(app.requires[i]);
						return false;
					}
				}
				return true;
			}
			return true;
		}
		catch (e) {
			return false;
		}

	}
	/**
   * @method Fxp.Resiliency.logFailedModulesInfo call global event and log property bag value .
   * @param {any} moduleName - modules whose resiliency needs to be checked
   */
	private static logFailedModulesInfo(moduleName) {
		var msg = this.failedModules.length > 1 ? " due to " + this.failedModules[0] + ", " + this.failedModules.reverse().join(" <- ") : ".";
		var logMsg = "Failed to instantiate module " + moduleName + `${msg}`;
		GlobalExceptionHandler.logEvent("Fxp.ModulesRemoved", "Fxp.Resiliency", { Details: logMsg }, false)
		console.error("Fxp Resiliency: ", logMsg);
	}
}
