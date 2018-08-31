import { FxpFeedbackService } from "../services/FxpFeedbackService";
import { CommonUtils } from "../utils/CommonUtils";
import { FxpBroadcastedEvents } from "../services/FxpBroadcastedEvents";


/**
 * @application  Fxp
 */

/**
 * A main factory which acts as an helper for AppController. This is the factory having common functionalities.
 * @class Fxp.Factory.FxpUIData
 * @classdesc An factory to get and set main header text
 * @example <caption> 
 *  //How To use this factory
 *  angular.module('FxPApp').controller('AppController', ['FxpUIData', FxpUIData]);
 *  function AppController(AnyDependency){ FxpUIData.getHeaderText(); }
 */
export class FxpUIData {
	private headerText: string;
	private pageTitle: string;
	private $rootScope: angular.IRootScopeService;
	private fxpFeedbackService: FxpFeedbackService;
	constructor($rootScope: angular.IRootScopeService, fxpFeedbackService: FxpFeedbackService) {
		this.$rootScope = $rootScope;
		this.fxpFeedbackService = fxpFeedbackService;
		this.headerText = "";
		this.pageTitle = "";
	}

	/**
	* @method Fxp.Factory.FxpUIData.getHeaderText()
	* @example <caption> Example to use getHeaderText</caption>
	*  FxpUIData.getHeaderText();
	*/
	public getHeaderText() {
		return this.headerText;
	}

	/**
	* A method to set the header text.
	* @method Fxp.Factory.FxpUIData.setHeaderText("Professional Services")
	* @param {string} headerText Header Text
	* @example <caption> Example to use setHeaderText</caption>
	*  FxpUIData.setHeaderText("Professional Services");
	*/
	public setHeaderText(headerText: string) {
		this.headerText = headerText;
		this.$rootScope.$broadcast(FxpBroadcastedEvents.OnAppHeaderChanged, headerText);
	}

	/**
	* A method to get the Page Title.
	* @method Fxp.Factory.FxpUIData.getPageTitle()
	* @example <caption> Example to use getPageTitle</caption>
	*  FxpUIData.getPageTitle();
	*/
	public getPageTitle() {
		return this.pageTitle;
	}

	/**
	* A method to set the Page Title.
	* @method Fxp.Factory.FxpUIData.setPageTitle("Professional Services")
	* @param {string} pageTitle Page Title
	* @example <caption> Example to use setPageTitle</caption>
	*  FxpUIData.setPageTitle("Professional Services");
	*/
	public setPageTitle(pageTitle: string) {
		this.pageTitle = pageTitle;
		this.$rootScope.$broadcast(FxpBroadcastedEvents.OnPageTitleChanged, pageTitle);
	}

	/**
	* A method to set the Page Title RouteChangeSuccess Event.
	* @method Fxp.Factory.FxpUIData.setpageTitleFromRoute()
	* @param {any} toState object from ui router
	* @example <caption> Example to use setpageTitleFromRoute</caption>
	*  FxpUIData.setpageTitleFromRoute();
	*/
	public setPageTitleFromRoute(toState) {
		var self = this;
		self.fxpFeedbackService.setScreenRoute(toState.name);
		var pageTitle = toState.data.pageTitle;
		if (CommonUtils.isNullOrEmpty(pageTitle)) {
			console.log("Page title is not set for " + toState.name + " state");
			pageTitle = "";
		}
		self.fxpFeedbackService.setBrowserTitle(pageTitle);
		self.setPageTitle(pageTitle);
	}

	/**
	 A method to set the AppHeader RouteChangeSuccess Event.
	* @method Fxp.Factory.FxpUIData.seAppHeaderFromRoute()
	* @param {any} toState object from ui router
	* @example <caption>Example to use setAppHeaderFromRoute</caption>
	* FxpUIData.setAppHeaderFromRoute();
	*/
	public setAppHeaderFromRoute(toState) {
		var self = this;
		var headerName = toState.data.headerName;
		if (CommonUtils.isNullOrEmpty(headerName)) {
			console.log("Appheader is not set for " + toState.name + " state");
			headerName = "";
		}
		self.setHeaderText(headerName);
	}

	static getUIDataFactoryObj($rootScope, fxpFeedbackService) {
		return new FxpUIData($rootScope, fxpFeedbackService);
	}
}