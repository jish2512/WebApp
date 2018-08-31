import { IRootScope } from "../interfaces/IRootScope";
import { ILogger } from "../interfaces/ILogger";
import { TelemetryContext } from "../telemetry/telemetrycontext";
import { CommonUtils } from "../utils/CommonUtils";
import { ApplicationConstants, FxpConstants } from "../common/ApplicationConstants";
import { FxpLogHelper } from "../telemetry/FxpLogHelper";
import { FxpStorageService } from "./FxpStorageService";
import { UserInfoService } from "./UserInfoService";
import { DashboardService } from "./dashboardService";
import { FxpConfigurationService } from "./FxpConfiguration";
import {StateService} from "@uirouter/core"
/**
 * @application  Fxp
 */
/**
 * @module Fxp.Services
 */
/**
  * A service to connect to FxpBreadcrumbService to maintain breadcrumb across all routes
  * @class Fxp.Services.FxpBreadcrumbService
  * @classdesc A service to connect to FxpBreadcrumbService to maintain breadcrumb
  * @example <caption> Example to create an instance of FxpBreadcrumbService</caption>
  *  //Initializing FxpBreadcrumbService
  *  angular.module('FxPApp').controller('LeftNavController', ['FxpBreadcrumbService', LeftNavController]);
  *  function LeftNavController(FxpBreadcrumbService){ FxpBreadcrumbService.setBreadcrumbsObj(userAlias,roleGroupId); }
  */
export class FxpBreadcrumbService {
	private $state;
	private $rootScope: IRootScope;
	private $q: angular.IQService;
	private fxpStorageService: FxpStorageService;
	private static _instance: FxpBreadcrumbService;
	private userInfoService: UserInfoService;
	private dashboardService: DashboardService;
	private fxpConfigurationService: FxpConfigurationService;
	private fxpLogger: ILogger;
	private fxpTelemetryContext: TelemetryContext;
	private breadcrumbServiceClassName = "Fxp.FxpBreadcrumbService";
	public isLeftNavItemClicked: boolean;

	constructor($state: StateService, $q: angular.IQService, $rootScope: IRootScope, fxpStorageService: FxpStorageService, userInfoService: UserInfoService, dashboardService: DashboardService, fxpConfigurationService: FxpConfigurationService, fxpLogger: ILogger, fxpTelemetryContext: TelemetryContext) {
		this.$state = $state;
		this.$q = $q;
		this.fxpStorageService = fxpStorageService;
		this.userInfoService = userInfoService;
		this.dashboardService = dashboardService;
		this.fxpConfigurationService = fxpConfigurationService;
		this.fxpTelemetryContext = fxpTelemetryContext;
		this.fxpLogger = fxpLogger;
		this.$rootScope = $rootScope;
		this.isLeftNavItemClicked = false;
	}

	/**
	* Create the breadcrumb item and update the breadcrumb Array
	* @method Fxp.Services.FxpBreadcrumbService.setBreadcrumbFromRoute
	* @param {toState } toState current state object.
	* @example <caption> Example to invoke setBreadcrumbFromRoute</caption>
	*  FxpBreadcrumbService.setBreadcrumbFromRoute();
	*/
	setBreadcrumbFromRoute(toState: any): void {
		var self = this;
		var breadcrumbText = !CommonUtils.isNullOrEmpty(toState.data.breadcrumbText) ? toState.data.breadcrumbText : '';
		var href = self.$state.href(toState.name);
		if (!breadcrumbText || !href || href.indexOf('//') > -1) //Don't update breadcrumb for invalid urls'
			return;
		self.setCurrentPageBreadcrumb({
			displayName: breadcrumbText,
			href: href
		});
	}

	/**
	* Set the Breadcrumb for Current Page
	* @method Fxp.Services.FxpBreadcrumbService.setCurrentPageBreadcrumb
	* @param {breadcrumbItem } breadcrumbItem breadcrumbItem of current page.
	* @example <caption> Example to invoke setCurrentPageBreadcrumb</caption>
	*  FxpBreadcrumbService.setCurrentPageBreadcrumb(breadcrumbItem);
	*/
	setCurrentPageBreadcrumb(breadcrumbItem: any): void {
		var self = this;
		var currentStateName = self.$state.current.name;
		self.startNewBreadcrumbOnSpecificState(currentStateName);
		if (self.isLeftNavItemClicked) {
			self.$rootScope.fxpBreadcrumb = new Array();
		}
		self.setBreadcrumb(breadcrumbItem);
		self.isLeftNavItemClicked = false;
	}

	/**
   * Add breadcrumb item by partners
   * @method Fxp.Services.FxpBreadcrumbService.setBreadcrumbItem
   * @param {breadcrumbItem } breadcrumbItem breadcrumbItem object.        
   * @example <caption> Example to invoke setBreadcrumbItem</caption>
   *  FxpBreadcrumbService.setBreadcrumbItem(breadcrumbItem);
   */
	setBreadcrumbItem(breadcrumbItem: any): void {
		var self = this;
		self.setBreadcrumb(breadcrumbItem);
	}

	/**
	* Save and Get the breadcrumb array in $rootScope.fxpBreadcrumb and localStorage
	* @method Fxp.Services.FxpBreadcrumbService.setBreadcrumb
	* @param {breadcrumbItem } breadcrumbItem breadcrumbItem object.        
	* @example <caption> Example to invoke setBreadcrumb</caption>
	*  FxpBreadcrumbService.setBreadcrumb(breadcrumbItem);
	*/
	private setBreadcrumb(breadcrumbItem: any): void {
		var self = this;
		var storageKey = self.userInfoService.getCurrentUser() + "-" + ApplicationConstants.FxpBreadcrumbStorageKey;
		var userNavigatedStatesWithBreadcrumb = self.fxpStorageService.getFromLocalStorage(storageKey) || {};
		var newTabBreadcrumbStorageKey = CommonUtils.hashCode(breadcrumbItem.href);
		var prevSessionBreadcrumbArray = self.fxpStorageService.getFromLocalStorage(newTabBreadcrumbStorageKey);
		if (prevSessionBreadcrumbArray) {
			self.$rootScope.fxpBreadcrumb = prevSessionBreadcrumbArray;
			self.fxpStorageService.deleteFromLocalStorage(newTabBreadcrumbStorageKey);
		}
		if (!self.$rootScope.fxpBreadcrumb)
			self.$rootScope.fxpBreadcrumb = new Array();
		var expectedBreadcrumbForCurrentState = self.getExpectedBreadcrumbForCurrentState(self.$rootScope.fxpBreadcrumb, breadcrumbItem);
		var breadcrumbArraySearchKey = CommonUtils.hashCode(self.$state.current.name.toLowerCase() + "_" + (breadcrumbItem.href ? breadcrumbItem.href.toLowerCase() : "") + "_" + breadcrumbItem.displayName.toLowerCase());
		var isBreadcrumbStateExist = userNavigatedStatesWithBreadcrumb.hasOwnProperty(breadcrumbArraySearchKey);
		if (!isBreadcrumbStateExist) {
			self.$rootScope.fxpBreadcrumb = self.updateBreadcrumb(self.$rootScope.fxpBreadcrumb, breadcrumbItem);
			userNavigatedStatesWithBreadcrumb[breadcrumbArraySearchKey] = self.$rootScope.fxpBreadcrumb;
			self.fxpStorageService.saveInLocalStorage(storageKey, userNavigatedStatesWithBreadcrumb);
		}
		else {
			if ((self.$rootScope.fxpBreadcrumb === undefined || self.$rootScope.fxpBreadcrumb.length == 0) && (!self.isLeftNavItemClicked)) {
				self.$rootScope.fxpBreadcrumb = userNavigatedStatesWithBreadcrumb[breadcrumbArraySearchKey];
				return;
			}
			var storedBreadcrumbForCurrentState = userNavigatedStatesWithBreadcrumb[breadcrumbArraySearchKey];
			if (CommonUtils.hashCode(JSON.stringify(expectedBreadcrumbForCurrentState)) === CommonUtils.hashCode(JSON.stringify(storedBreadcrumbForCurrentState))) {
				self.$rootScope.fxpBreadcrumb = storedBreadcrumbForCurrentState;
			}
			else {
				self.$rootScope.fxpBreadcrumb = expectedBreadcrumbForCurrentState;
				userNavigatedStatesWithBreadcrumb[breadcrumbArraySearchKey] = expectedBreadcrumbForCurrentState;
				self.fxpStorageService.saveInLocalStorage(storageKey, userNavigatedStatesWithBreadcrumb);
			}
		}
	}

	/**
   * check if breadcrumb item is exist or not in current breadcrumb list
   * @method Fxp.Services.FxpBreadcrumbService.updateBreadcrumb
   * @param {breadcrumbList } breadcrumbList breadcrumb list
   * @param {breadcrumbItem } breadcrumbItem breadcrumbItem
   * @example <caption> Example to invoke updateBreadcrumb</caption>
   * FxpBreadcrumbService.updateBreadcrumb(breadcrumbList, breadcrumbItem);
   */
	private updateBreadcrumb(breadcrumbList: any, breadcrumbItem: any): any {
		var self = this;
		var breadcrumbItemIndex = -1;
		for (let i = 0, length = breadcrumbList.length; i < length; i++) {
			if (breadcrumbList[i].displayName.toLowerCase() === breadcrumbItem.displayName.toLowerCase()) {
				breadcrumbItemIndex = i;
				breadcrumbList[i].href = breadcrumbItem.href;
				break;
			}
		}
		if (breadcrumbItemIndex > -1) {
			breadcrumbList.splice(breadcrumbItemIndex + 1);
		}
		else {
			breadcrumbList.push(breadcrumbItem);
		}
		return breadcrumbList;
	}

	/**
	* expected breadcrumb when we visit the page.
	* @method Fxp.Services.FxpBreadcrumbService.getExpectedBreadcrumbForCurrentState
	* @param {breadcrumbList } breadcrumbList breadcrumb list
	* @param {breadcrumbItem } breadcrumbItem breadcrumbItem
	* @example <caption> Example to invoke getExpectedBreadcrumbForCurrentState</caption>
	* FxpBreadcrumbService.getExpectedBreadcrumbForCurrentState(breadcrumbList, breadcrumbItem);
	*/
	private getExpectedBreadcrumbForCurrentState(breadcrumbList: any, breadcrumbItem: any): any {
		var self = this;
		return self.updateBreadcrumb(angular.copy(breadcrumbList), breadcrumbItem);
	}

	/**
	* in special case where a breadcrumb start as fresh 
	* @method Fxp.Services.FxpBreadcrumbService.startNewBreadcrumbOnSpecificState
	* @param {currentStateName } currentStateName current state name.
	* @example <caption> Example to invoke startNewBreadcrumbOnSpecificState</caption>
	* FxpBreadcrumbService.startNewBreadcrumbOnSpecificState(currentStateName);
	*/
	private startNewBreadcrumbOnSpecificState(currentStateName): void {
		var self = this;
		var nonGLNStateCollectionForBreadcrumb = self.fxpConfigurationService.FxpBaseConfiguration.NonGLNStateCollectionForBreadcrumb;
		var isStateAvailable = nonGLNStateCollectionForBreadcrumb.some((item) => {
			return (item.toLowerCase() === currentStateName.toLowerCase());
		});
		if (isStateAvailable) {
			self.$rootScope.fxpBreadcrumb = new Array();
		}
	}

	/**
	 * Breadcrumb info capture in Telemetry when user navigate different link options
	 * @method Fxp.Services.FxpBreadcrumbService.logBreadcrumbTelemetryInfo
	 * @example <caption> Example to invoke logBreadcrumbTelemetryInfo</caption>
	 * FxpBreadcrumbService.logBreadcrumbTelemetryInfo();
	 */
	public logBreadcrumbTelemetryInfo(type: string, breadcrumbItem: any): void {
		var self = this, propBag, userInfo, breadcrumbString
		userInfo = sessionStorage[CommonUtils.getSessionStorageUserInfoKey(self.userInfoService.getLoggedInUser())]
		if (!self.$rootScope.fxpBreadcrumb || !userInfo)
			return

		var loginUserInfo = JSON.parse(userInfo);

		if (CommonUtils.isNullOrEmpty(breadcrumbItem)) {
			breadcrumbString = self.$rootScope.fxpBreadcrumb.map(function (breadcrumbItem) {
				return breadcrumbItem.displayName;
			}).join(' > ');
		}
		else {
			//To handle breadcrumb text on breadcrumb Click, Need to build breadcrumb text by the item clicked.
			var breadcrumbForClick = self.updateBreadcrumb(self.$rootScope.fxpBreadcrumb, breadcrumbItem);
			breadcrumbString = breadcrumbForClick.map(function (breadcrumbItem) {
				return breadcrumbItem.displayName;
			}).join(' > ');
		}

		propBag = self.fxpLogger.createPropertyBag();
		propBag.addToBag(FxpConstants.metricConstants.SessionId, self.$rootScope.sessionId);
		propBag.addToBag(FxpConstants.metricConstants.UserBusinessRole, loginUserInfo.businessRole);

		if (self.userInfoService.isActingOnBehalfOf()) {
			var oboUserInfo = sessionStorage[CommonUtils.getSessionStorageUserInfoKey(self.userInfoService.getCurrentUser())]
			if (!oboUserInfo)
				return
			var oboUserData = JSON.parse(oboUserInfo);
			propBag.addToBag(FxpConstants.metricConstants.OBOUserBusinessRole, oboUserData.OBOUserBusinessRole);
		}
		propBag.addToBag(FxpConstants.metricConstants.TimeStamp, FxpLogHelper.getTimeStamp());
		propBag.addToBag(FxpConstants.metricConstants.BreadcrumbString, breadcrumbString);

		if (type === FxpConstants.BreadcrumbEventType.BreadcrumbClick) {
			self.fxpLogger.logInformation(self.breadcrumbServiceClassName, "Fxp.BreadcrumbItemClicked", propBag);
		}
		else {
			self.fxpLogger.logInformation(self.breadcrumbServiceClassName, "Fxp.BreadcrumbLoad", propBag);
		}
	}

	/**
	* Store the current fxpBreadcrumb array into localStorage with newTabBreadcrumbStorageKey
	* Before opening any link in newtab through click action, have to call setTempBreadcrumbArray
	* @method Fxp.Services.FxpBreadcrumbService.setTempBreadcrumbArray
	* @example <caption> Example to invoke setTempBreadcrumbArray</caption>
	* FxpBreadcrumbService.setTempBreadcrumbArray();
	*/
	setTempBreadcrumbArray(url: string): void {
		var self = this;
		var newTabBreadcrumbStorageKey = CommonUtils.hashCode(url);
		self.fxpStorageService.saveInLocalStorage(newTabBreadcrumbStorageKey, self.$rootScope.fxpBreadcrumb);
	}

	/**
	* Partners can override the current State/Url breadcrumbItem displayName using this method
	* @method Fxp.Services.FxpBreadcrumbService.overrideBreadcrumbText
	* @param {breadcrumbText } breadcrumbText of the current state/url.
	* @example <caption> Example to invoke overrideBreadcrumbText</caption>
	* FxpBreadcrumbService.overrideBreadcrumbText(breadcrumbText);
	*/
	overrideBreadcrumbText(breadcrumbText: string): void {
		var self = this;
		self.updateDisplayNameForCurrentBreadcrumbItem(breadcrumbText);
	}

	/**
	* Update the DisplayName of current State/Url breadcrumbItem 
	* @method Fxp.Services.FxpBreadcrumbService.updateDisplayNameForCurrentBreadcrumbItem
	* @param {breadcrumbText } breadcrumbText of the current state/url.
	* @example <caption> Example to invoke updateDisplayNameForCurrentBreadcrumbItem</caption>
	* FxpBreadcrumbService.updateDisplayNameForCurrentBreadcrumbItem(breadcrumbText);
	*/
	updateDisplayNameForCurrentBreadcrumbItem(breadcrumbText: string): void {
		var self = this;
		if (self.$rootScope.fxpBreadcrumb && self.$rootScope.fxpBreadcrumb.length > 0) {
			self.$rootScope.fxpBreadcrumb[self.$rootScope.fxpBreadcrumb.length - 1].displayName = breadcrumbText;
		}
	}

	/**
   * Method to get the index of breadcrumbItem from breadcrumb context.
   * @method Fxp.Services.FxpBreadcrumbService.getBreadcrumbItemIndex
   * @param {fxpBreadcrumbContext } fxpBreadcrumbContext is an array.
   * @param {breadcrumbName } breadcrumbName is the displayName of the breadcrumbItem.
   * @example <caption> Example to invoke getBreadcrumbItemIndex</caption>
   * FxpBreadcrumbService.getBreadcrumbItemIndex(fxpBreadcrumbContext, breadcrumbItem);
   */
	getBreadcrumbItemIndex(fxpBreadcrumbContext: any, breadcrumbName: string): number {
		for (var i = 0; i < fxpBreadcrumbContext.length; i++) {
			if (fxpBreadcrumbContext[i].displayName.toLowerCase() === breadcrumbName.toLowerCase()) {
				return i;
			}
		}
		return -1;
	}

	/**
   * Method to save the context of breadcrumb for the current state/url in local storage.
   * @method Fxp.Services.FxpBreadcrumbService.saveBreadcrumbContextForCurrentState
   * @example <caption> Example to invoke saveBreadcrumbContextForCurrentState</caption>
   * FxpBreadcrumbService.saveBreadcrumbContextForCurrentState(breadcrumbArray);
   */
	saveBreadcrumbContextForCurrentState(): void {
		var self = this;
		var breadcrumbLastItem = self.$rootScope.fxpBreadcrumb[self.$rootScope.fxpBreadcrumb.length - 1];
		var storageKey = self.userInfoService.getCurrentUser() + "-" + ApplicationConstants.FxpBreadcrumbStorageKey;
		var userNavigatedStatesWithBreadcrumb = self.fxpStorageService.getFromLocalStorage(storageKey) || {};
		var breadcrumbArraySearchKey = CommonUtils.hashCode(self.$state.current.name.toLowerCase() + "_" + (breadcrumbLastItem.href ? breadcrumbLastItem.href.toLowerCase() : "") + "_" + breadcrumbLastItem.displayName.toLowerCase());
		userNavigatedStatesWithBreadcrumb[breadcrumbArraySearchKey] = self.$rootScope.fxpBreadcrumb;
		self.fxpStorageService.saveInLocalStorage(storageKey, userNavigatedStatesWithBreadcrumb);
	}

	/**
	* Method to update the url of breadcrumbItem which is sent by partners.
	* @method Fxp.Services.FxpBreadcrumbService.updateBreadcrumbUrlByName
	* @param {breadcrumbName } breadcrumbName is the displayName of the breadcrumbItem.
	* @param {newUrl } newUrl is href of breadcrumbItem.
	* @example <caption> Example to invoke updateBreadcrumbUrlByName</caption>
	* FxpBreadcrumbService.updateBreadcrumbUrlByName(breadcrumbName, newUrl);
	*/
	updateBreadcrumbUrlByName(breadcrumbName: string, newUrl: string): void {
		var self = this;
		var breadcrumbItemIndex = self.getBreadcrumbItemIndex(self.$rootScope.fxpBreadcrumb, breadcrumbName);
		if (breadcrumbItemIndex > -1) {
			self.$rootScope.fxpBreadcrumb[breadcrumbItemIndex].href = newUrl;
		}
		self.saveBreadcrumbContextForCurrentState();
	}

}