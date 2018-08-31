import { IRootScope } from "../interfaces/IRootScope";
import { ILogger } from "../interfaces/ILogger";
import { FxpBreadcrumbService } from "./FxpBreadcrumbService";
import { FxpConstants } from "../common/ApplicationConstants";
import { Resiliency } from "../resiliency/FxpResiliency";
import { UserProfileService } from "./userProfileService";
import { UserInfoService } from "./UserInfoService";
import { StateService } from "@uirouter/core";

/**
 * @application  Fxp
 */
/**
 * @module Fxp.Services
 */
/**
   * A service to connect to user Route users to their configured URLs
   * @class Fxp.Services.FxpRouteService
   * @classdesc A service to Route users to their configured URLs
   * @example <caption> Example to create an instance of Fxp Route Service</caption>
   *  //Initializing Fxp Route Service
   *  angular.module('FxPApp').controller('AppController', ['FxpRouteService', AppController]);
   *  function AppController(FxpRouteService){ FxpRouteService.getAllStates(); }
   */
export class FxpRouteService {
	private stateGo: StateService;
	private rootScope: IRootScope;
	private fxplogger: ILogger;
	private userProfileService: UserProfileService;
	private userInfoService: UserInfoService;
	private fxpBreadcrumbService: FxpBreadcrumbService;
	private classNamePersonalizationService = "Fxp.PersonalizationService";
	private defaultStateName: String;
	constructor($state: StateService, $rootScope: IRootScope, loggerService: ILogger, userProfileService: UserProfileService, userInfoService: UserInfoService, fxpBreadcrumbService: FxpBreadcrumbService) {
		this.stateGo = $state;
		this.rootScope = $rootScope;
		this.userProfileService = userProfileService;
		this.userInfoService = userInfoService;
		this.fxplogger = loggerService;
		this.fxpBreadcrumbService = fxpBreadcrumbService;
		if (this.rootScope.isNewTabAllowed === undefined) {
			this.rootScope.isNewTabAllowed = true;
		}
	}

	/**
	* Gets List of States from URL State Provider
	* @method Fxp.Services.FxpRouteService.getAllStates
	* @example <caption> Example to invoke getAllStates</caption>
	*  FxpRouteService.getAllStates();
	*/
	getAllStates = function (): any {
		var statesList = [];
		for (var i = 0; i < this.states.length; i++) {
			statesList.push(this.states[i].name);
		}
		return statesList;
	}

	get states():any {
		return this.stateGo.get();
	}

	/**
	* Gets URL of mentioned state from URL State Provider
	* @method Fxp.Services.FxpRouteService.getURLfromState
	* @param statename {string} a mandatory string value.
	* @param params {any} $state parameters values
	* @param options {any} an options values.
	* @example <caption> Example to invoke getURLfromState</caption>
	* FxpRouteService.getURLfromState(stateOrName [, params] [, options]);
	* FxpRouteService.getURLfromState($state.current.name, $state.params, {absolute: true});
	*/
	getURLfromState = function (statename: string, params?: any, options?: any) {
		for (var i = 0; i < this.states.length; i++) {
			if (this.states[i].name == statename)
				return this.stateGo.href(this.states[i].name, params, options);
		}
		return null;
	}

	/**
	* @deprecated Use new method FxpRouteService.navigatetoNewWindow('Home')
	*/
	navigatetoState = function (statename: string) {
		console.warn("This method has been deprecated.Please use navigatetoNewWindow(statename) ");
		this.navigatetoNewWindow(statename);
	}
	/**
	* Open a New Browser Window of mentioned state by Picking URL from URL State Provider
	* @method Fxp.Services.FxpRouteService.navigatetoNewWindow
	* @param {string} a mandatory string value.
	* @example <caption> Example to invoke navigatetoNewWindow</caption>
	*  FxpRouteService.navigatetoNewWindow('Home');
	*/

	navigatetoNewWindow = function (statename: string) {

		//Check if the requested state is missing any dependencies.
		if (Resiliency.statesWithMissingModules && Resiliency.statesWithMissingModules.indexOf(statename) > -1) {
			throw new Error('The requested state cannot be navigated due to missing dependencies.');
		}

		for (var i = 0; i < this.states.length; i++) {
			if (this.states[i].name == statename) {
				window.open("#" + this.states[i].url, "Popup", "location=1,status=1,scrollbars=1, resizable=1, directories=1, toolbar=1, titlebar=1, width=" + screen.width + ", height=" + screen.height);
			}
		}
	}
	/**
   * Navigates to a the specific state which is passed as a parameter,also can pass optional parameters like params,target,features,replace
   * @method Fxp.Services.FxpRouteService.navigatetoSpecificState
   * @param {string} statename string specifies the name of the state.
   * @param {any} params any specifies the object.
   * @example <caption> Example to invoke navigatetoSpecificState</caption>
   *  FxpRouteService.navigatetoSpecificState('Home');
   */
	navigatetoSpecificState = function (statename: string, params?: any) {

		//Check if the requested state is missing any dependencies.
		if (Resiliency.statesWithMissingModules && Resiliency.statesWithMissingModules.indexOf(statename) > -1) {
			throw new Error('The requested state cannot be navigated due to missing dependencies.');
		}

		if (params != undefined && params != null)
			this.stateGo.go(statename, params);
		else
			this.stateGo.go(statename);
	}

	/**
	* Navigates to a the specific URL which is passed as a parameter,also can pass optional parameters like target,features,replace
	* @method Fxp.Services.FxpRouteService.navigateToSpecificUrl
	* @param {string} url string that specifies the URL of the document to display.
	* @param {string} target string that specifies the name of the window.
	* @param {string} features string that contains a list of items separated by commas.
	* @param {boolean} replace boolean that specifies whether the url creates a new entry or replaces the current entry in the window's history list.
	* @example <caption> Example to invoke navigateToSpecificUrl</caption>
	*  FxpRouteService.navigateToSpecificUrl('#/Home');
	*/
	navigateToSpecificUrl = function (url: string, target?: string, features?: string, replace?: boolean) {
		var self = this;
		self.navigateToUrl(url, target, features, replace);
	}

	/**
	* Navigates to a the URL which is passed as a parameter,also can pass optional parameters like target,features,replace
	* @method Fxp.Services.FxpRouteService.navigateToSpecificUrl
	* @param {string} url string that specifies the URL of the document to display.
	* @param {string} target string that specifies the name of the window.
	* @param {string} features string that contains a list of items separated by commas.
	* @param {boolean} replace boolean that specifies whether the url creates a new entry or replaces the current entry in the window's history list.
	* @example <caption> Example to invoke navigateToUrl</caption>
	*  FxpRouteService.navigateToUrl('#/Home');
	*/
	private navigateToUrl(url: string, target?: string, features?: string, replace?: boolean) {
		var self = this;
		target = self.rootScope.isNewTabAllowed && target != undefined ? target : "_self";
		features = features || "";
		replace = replace || false;
		if (target === "_blank") {
			self.fxpBreadcrumbService.setTempBreadcrumbArray(url);
		}
		window.open(url, target, features, replace);
	}

	/**
	* getDefaultStateName
	* @method Fxp.Services.FxpRouteService.getDefaultStateName
	* @example <caption> Example to invoke getDefaultStateName</caption>
	*  FxpRouteService.getDefaultStateName();
	*/
	getDefaultStateName = function () {
		return this.defaultStateName;
	}

	/**
	* setDefaultStateName
	* @method Fxp.Services.FxpRouteService.setDefaultStateName
	* @param {string} value mandatory string value to set as default StateName.
	* @example <caption> Example to invoke setDefaultStateName</caption>
	*  FxpRouteService.setDefaultStateName('Home');
	*/
	setDefaultStateName = function (value: string) {
		this.defaultStateName = value;
	}

}
