import { IStateConfig } from "../interfaces/IStateConfig";

export class FxpComponentRegistrationService {

	private static _partnerRoutes = {};
	private static _partnerEndpoints = {};
	private static _registeredNG1Modules: Array<string> = new Array<string>();  
	private static _registeredNG2Modules: Array<any> = new Array<any>();  
	
	public static registerEndpoints(endpoint: string, clientId: string) {
		if (!this._partnerEndpoints[endpoint])
			this._partnerEndpoints[endpoint] = clientId;
	}
	public static getRegisterEndpoints(){
		return this._partnerEndpoints;
	}

	public static registerRoute(routeConfig: IStateConfig):void {
		if (!this._partnerRoutes[routeConfig.name] && this.isValidRoute(routeConfig)) {
			this._partnerRoutes[routeConfig.name] = routeConfig;
		}
	}

	public static getRegisteredRoutes() {
		return this._partnerRoutes;
	}

	public static registerAngular1Module(moduleName: string) {
		if (!moduleName || moduleName.trim().length === 0) {
			console.log("Failed to register module as Module Name is missing");
			return; 
		}
		if (!this._registeredNG1Modules.includes(moduleName)) {
			this._registeredNG1Modules.push(moduleName);
		}
	}

	public static getRegisteredAngular1Modules() {
		this._registeredNG1Modules;
	}

	public static registerAngular2Module(module: any) {
		if (!module) {
			console.log("Failed to register module as Module is missing");
			return;
		}
		if (! this.isModuleAlreadyRegistered(module, this._registeredNG2Modules)) {
			this._registeredNG2Modules.push(module);
		}
		
	}

	private static isModuleAlreadyRegistered(module: any, container: any): boolean {
		for (let i = 0; i < container.length; i++) {
			if (container[i].name === module.name) return true;
		}
		return false;
	}

	public static getRegisteredAngular2Modules() {
		return this._registeredNG2Modules;
	}

	private static isValidRoute(stateConfig: IStateConfig) {
		const stateName: string = "name";
		const appHeader: string = "headerName";
		const breadcrumbText: string = "breadcrumbText";
		const pageTitle: string = "pageTitle";
		const url: string = "url";
		const component: string = "component";
		const templateUrl: string = "templateUrl";

		if (!this.hasValue(stateConfig, stateName)) {
			this.logToConsole(stateName);
			return false;
		}
		if (!this.hasValue(stateConfig.data, appHeader)) {
			this.logToConsole(appHeader);
			return false;
		}
		if (!this.hasValue(stateConfig.data, breadcrumbText)) {
			this.logToConsole(breadcrumbText);
			return false;
		}
		if (!this.hasValue(stateConfig.data, pageTitle)) {
			this.logToConsole(pageTitle);
			return false;
		}

		if (!this.hasValue(stateConfig, url)) {
			this.logToConsole(url);
			return false;
		}
	
		if (!this.hasValue(stateConfig, component) && !this.hasValue(stateConfig, templateUrl)) {
			this.logToConsole(component + " or " + templateUrl);
			return false;
		}
		return true;
	}

	private static logToConsole(propertyName: string): void {
		console.log(propertyName + " is a mandatory parameter for route which is missing. ");
	}

	private static hasValue(configObject: any, propertyName: string): boolean {
		if (!configObject[propertyName] || configObject[propertyName].toString().trim().length === 0) {
			return false;
		}
		return true;
	}

}
