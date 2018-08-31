/**
 * @application  Fxp
 */
/**
 * @module Fxp.Controllers
 */
declare type IStateService = any;
import { IActOnBehalfOfControllerScope } from "../interfaces/IActOnBehalfOfControllerScope";
import { ILogger } from "../interfaces/ILogger";
import { FxpMessageService } from "../services/FxpMessageService";
import { FxpConstants, ApplicationConstants } from "../common/ApplicationConstants";
import { OBOUserService } from "../services/OBOUserService";
import { IFxpContext } from "../interfaces/IFxpContext";
import { IRootScope } from "../interfaces/IRootScope";
import { UserProfileService } from "../services/userProfileService";
import { UserInfoService } from "../services/UserInfoService";
import { LogPropertyBag } from "../telemetry/LogPropertyBag";
import { TelemetryContext } from "../telemetry/telemetrycontext";
import { FxpConfigurationService } from "../services/FxpConfiguration";
import { PageLoaderService } from "../services/pageLoaderService";
import { CommonUtils } from "../utils/CommonUtils";
import { ILeftNavControllerScope } from "../interfaces/ILeftNavControllerScope";
import { FxpRouteService } from "../services/FxpRouteService";
import { AdminLandingService } from "../services/AdminLandingService";
import { SettingsServiceProvider } from "../provider/SettingsServiceProvider";
import { FxpContext } from "../context/FxpContext";
import { SettingsType } from "../common/SettingsType";
import { Resiliency } from "../resiliency/FxpResiliency";
import { ILeftNavPersonalizationControllerScope } from "../interfaces/ILeftNavPersonalizationControllerScope";
import { NotificationStore } from "../services/NotificationStore";
import { PersonalizationService } from "../services/PersonalizationService";
import { ControllerName, EventName } from "../telemetry/TelemetryConst";
import { FxpBroadcastedEvents } from "../services/FxpBroadcastedEvents";

/**
* A main controller for FxpApp module. This is the controller having basic models and events.
* @class Fxp.Controllers.LeftNavPersonalizationController
* @classdesc A Left Navigation Personlization controller of FxpApp module
* @example <caption> 
*  //To Use AppController
*  angular.module('FxPApp').controller('LeftNavPersonalizationController', ['AnyDependency']);
*  function LeftNavPersonalizationController(AnyDependency){ AnyDependency.doSomething(); }
*/
export class LeftNavPersonalizationController {
	private $rootScope: IRootScope;
	private $scope: ILeftNavPersonalizationControllerScope;
	private $state: IStateService;
	private fxpLogger: ILogger;
	private fxpConstants: FxpConstants;
	private pageLoaderService: PageLoaderService;
	private personalizationService: PersonalizationService;
	private fxpMessage: FxpMessageService;
	private personalizedUserNav: any;
	private userNavPersonalizationList: any;
	private globalNavMasterList: any;
	private parallelRequsetCounter: number;
	private userInfo: any;
	private userProfileService: UserProfileService;
	private timeout: any;
	private pageLoadStartTime: number;
	private $window: angular.IWindowService;
	private fxpRouteService: FxpRouteService;
	private isStateChanged: boolean;
	private toState: any;
	private toParams: any;
	private notificationStore: NotificationStore;
	private fxpConfigurationService: FxpConfigurationService;
	constructor($rootScope: IRootScope, $scope: ILeftNavPersonalizationControllerScope, $state: IStateService, $timeout, fxpLoggerService: ILogger,
		pageLoaderService: PageLoaderService, fxpMessage: FxpMessageService, personalizationService: PersonalizationService, userProfileService: UserProfileService, $window: angular.IWindowService, fxpRouteService: FxpRouteService, notificationStore: NotificationStore, fxpConfigurationService: FxpConfigurationService) {
		this.pageLoadStartTime = performance.now();
		this.$rootScope = $rootScope;
		this.$rootScope.showLoader = true;
		this.$scope = $scope;
		this.$state = $state;
		this.timeout = $timeout;
		this.fxpLogger = fxpLoggerService;
		this.notificationStore = notificationStore;
		this.fxpConfigurationService = fxpConfigurationService;
		this.$window = $window;
		this.fxpRouteService = fxpRouteService;
		this.fxpConstants = FxpConstants;
		this.userNavPersonalizationList = [];
		this.globalNavMasterList = [];
		this.fxpMessage = fxpMessage;
		this.pageLoaderService = pageLoaderService;
		this.personalizationService = personalizationService;
		this.$scope.personalizationUser = this.getUserPersonalization();
		if (CommonUtils.isNullOrEmpty(this.$scope.personalizationUser)) {
			return;
		}
		this.$scope.adminUIStrings = this.$rootScope.fxpUIConstants.UIStrings.AdminUIStrings;
		this.$scope.buttonStrings = this.$rootScope.fxpUIConstants.UIStrings.ButtonStrings;
		this.personalizedUserNav = { "AddedItems": [], "RemovedItems": [] };
		this.isStateChanged = false;
		this.$scope.selectedGlobalLeftNavItems = this.selectedGlobalLeftNavItems.bind(this);
		this.$scope.addToUserNavPersonalizationList = this.addToUserNavPersonalizationList.bind(this);
		this.$scope.removeUserNavPresonalization = this.removeUserNavPresonalization.bind(this);
		this.$scope.submitUserNavPresonalization = this.submitUserNavPresonalization.bind(this);
		this.$scope.selectedUserNavItems = this.selectedUserNavItems.bind(this);
		this.$scope.navigateToUserLookup = this.navigateToUserLookup.bind(this);
		this.$scope.showConfirmPopup = this.showConfirmPopup.bind(this);
		this.$scope.hideConfirmPopup = this.hideConfirmPopup.bind(this);
		this.$scope.pullFocusToElement = this.pullFocusToElement.bind(this);
		this.parallelRequsetCounter = 0;
		this.userInfo = {};
		this.userProfileService = userProfileService;
		this.pageLoaderService.fnShowPageLoader("Loading...");
		var self = this;
		self.userProfileService.getBasicUserProfile(false).then(function (response) {
			self.userInfo = response;
			self.getGlobalNavMasterList();
			self.getUserNavList();
		}, function (exception) {
			self.showErrorMsgNavigateToUserLookUp(exception, self.$rootScope.fxpUIConstants.UIMessages.GeneralExceptionError);
		});
		self.$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
			if (!CommonUtils.isNullOrEmpty(self.personalizedUserNav.AddedItems) || !CommonUtils.isNullOrEmpty(self.personalizedUserNav.RemovedItems)) {
				self.$scope.displayPopup = true;
				self.isStateChanged = true;
				self.toState = toState;
				self.toParams = toParams;
				event.preventDefault();
				setTimeout(function () { CommonUtils.pullFocusToElement('role-group-popup'); }, 100);
			}
		});
		self.$window.onbeforeunload = function (event) {
			if (!CommonUtils.isNullOrEmpty(self.personalizedUserNav.AddedItems) || !CommonUtils.isNullOrEmpty(self.personalizedUserNav.RemovedItems)) {
				return "";
			}
		}
	}

	/**
	* A method to Get the Pesanalization User Informantion
	* @method Fxp.Controllers.LeftNavPersonalizationController.getUserPersonalization
	* @example <caption> Example to use getUserPersonalization</caption>
	* LeftNavPersonalizationController.getUserPersonalization()
	*/
	getUserPersonalization(): any {
		let self = this;
		let persistedSelectedUser = self.personalizationService.getPersistedPersonalization();
		let selectedUser = null;
		if (!CommonUtils.isNullOrEmpty(persistedSelectedUser)) {
			selectedUser = persistedSelectedUser;
			self.personalizationService.removePersistedUserPersonalization();
		} else {
			//user is null then navigate to user lookup state
			self.navigateToUserLookup();
		}
		return selectedUser;
	}

	/**
	* A method to Get the GlobalNavMasterList for FxpAdmin User
	* @method Fxp.Controllers.LeftNavPersonalizationController.getGlobalNavMasterList
	* @example <caption> Example to use getGlobalNavMasterList</caption>
	* LeftNavPersonalizationController.getGlobalNavMasterList()
	*/
	getGlobalNavMasterList(): void {
		let self = this;
		self.parallelRequsetCounter++;
		self.personalizationService.getMasterLeftNavItems().then(function (response) {
			if (!CommonUtils.isNullOrEmpty(response.data.result)) {
				self.globalNavMasterList = response.data.result;
				self.fxpLogger.logInformation(ControllerName.LEFTNAVPERSONALIZATIONCONTROLLER, EventName.GETMASTERLEFTNAVITEMSSUCCESS);
				self.parallelRequsetCounter--;
				if (self.parallelRequsetCounter == 0) {
					self.mergeGlobalAndUserPreferenceNavigationList();
				}
			}
		}, function (exception) {
			self.showErrorMsgNavigateToUserLookUp(exception, self.$rootScope.fxpUIConstants.UIMessages.GeneralExceptionError);
		});
	}

	/**
	* A method to navigate To UserLookup screen
	* @method Fxp.Controllers.LeftNavPersonalizationController.navigateToUserLookup
	* @example <caption> Example to use navigateToUserLookup</caption>
	* LeftNavPersonalizationController.navigateToUserLookup()
	*/
	navigateToUserLookup(): void {
		var self = this;
		self.personalizedUserNav = { "AddedItems": [], "RemovedItems": [] };
		if (self.isStateChanged) {
			self.fxpRouteService.navigatetoSpecificState(self.toState.name, self.toParams);
		} else {
			self.personalizationService.removePersistedUserPersonalization();
			self.fxpRouteService.navigatetoSpecificState("UserLookupPersonalization");
		}
	}

	/**
	* A method to Get the UserNavList
	* @method Fxp.Controllers.LeftNavPersonalizationController.getUserNavList
	* @example <caption> Example to use getUserNavList</caption>
	* LeftNavPersonalizationController.getUserNavList()
	*/
	getUserNavList(): void {
		let self = this;
		self.parallelRequsetCounter++;
		let userAlias = self.$scope.personalizationUser.Alias;
		let roleGroupId = self.$scope.personalizationUser.RoleGroupID.toString();
		let userRoleId = self.$scope.personalizationUser.BusinessRoleId.toString();
		self.personalizationService.getPersonalizedNavItems(userAlias, roleGroupId, userRoleId)
			.then(function (response) {
				self.pageLoaderService.fnHidePageLoader();
				if (!CommonUtils.isNullOrEmpty(response.data.result)) {
					self.fxpLogger.logInformation(ControllerName.LEFTNAVPERSONALIZATIONCONTROLLER,
						EventName.GETPERSONALIZEDNAVITEMSSUCCESS);
					self.userNavPersonalizationList = response.data.result;
					self.parallelRequsetCounter--;
					if (self.parallelRequsetCounter == 0) {
						self.mergeGlobalAndUserPreferenceNavigationList();
					}
				}
			},
			function (exception) {
				self.showErrorMsgNavigateToUserLookUp(exception, self.$rootScope.fxpUIConstants.UIMessages.GeneralExceptionError);
			});
	}

	/**
	* A method used to merge Global And User Preference Navigation List
	* @method Fxp.Controllers.LeftNavPersonalizationController.mergeGlobalAndUserPreferenceNavigationList
	* @example <caption> Example to use mergeGlobalAndUserPreferenceNavigationList</caption>
	* LeftNavPersonalizationController.mergeGlobalAndUserPreferenceNavigationList()
	*/
	mergeGlobalAndUserPreferenceNavigationList(): void {
		let self = this;
		self.$scope.navigationList = angular.copy(self.globalNavMasterList);
		console.log(self.$scope.navigationList);
		let userNavlength = self.userNavPersonalizationList.length;
		for (let i = 0; i < userNavlength; i++) {
			let globalNavIndex = self.getIndexOfObject(self.$scope.navigationList, "id", self.userNavPersonalizationList[i].id);
			//if applicableDevice of any item in userNavPersonalizationList is mobile then no need to add into the User Navigation List
			if (globalNavIndex > -1 && self.userNavPersonalizationList[i].applicableDevice != FxpConstants.applicableDevice.mobile) {
				self.$scope.navigationList[globalNavIndex].isPersonaDefault = self.userNavPersonalizationList[i].isPersonaDefault;
				self.$scope.navigationList[globalNavIndex].isUserRoleDefault = self.userNavPersonalizationList[i].isUserRoleDefault;
				self.$scope.navigationList[globalNavIndex].isUserLeftNavItem = true;
				if (self.userNavPersonalizationList[i].hasChildren && self.userNavPersonalizationList[i].children != null) {
					let userChildNavLength = self.userNavPersonalizationList[i].children.length;
					for (let j = 0; j < userChildNavLength; j++) {
						let globalNavChildIndex = self.getIndexOfObject(self.$scope.navigationList[globalNavIndex].children, "id", self.userNavPersonalizationList[i].children[j].id);
						if (globalNavChildIndex > -1) {
							self.$scope.navigationList[globalNavIndex].children[globalNavChildIndex].isPersonaDefault = self.userNavPersonalizationList[i].children[j].isPersonaDefault;
							self.$scope.navigationList[globalNavIndex].children[globalNavChildIndex].isUserRoleDefault = self.userNavPersonalizationList[i].children[j].isUserRoleDefault;
							self.$scope.navigationList[globalNavIndex].children[globalNavChildIndex].isUserLeftNavItem = true;
						}
					}
				}
			}
		}
		self.setFocusToGlobalNavMasterItem(true);
		self.logPageLoadMetricsForCurrentPage();
	}

	/**
	* A method to use log Error And NavigateToUserSelectionPage
	* @method Fxp.Controllers.LeftNavPersonalizationController.showErrorMsgNavigateToUserLookUp
	* @example <caption> Example to use showErrorMsgNavigateToUserLookUp</caption>
	* LeftNavPersonalizationController.showErrorMsgNavigateToUserLookUp()
	*/
	showErrorMsgNavigateToUserLookUp(exception, exceptionMessage): void {
		var self = this;
		self.navigateToUserLookup();
		self.fxpMessage.addMessage(exceptionMessage.ErrorMessage, FxpConstants.messageType.error);
		if (exception == null) {
			exception = {};
			exception.message = exceptionMessage.ErrorMessage;
		}
		var propbag = self.fxpLogger.createPropertyBag();
		propbag.addToBag("exception", exception.message);
		propbag.addToBag("personalizationUser", self.$scope.personalizationUser.Alias);
		self.fxpLogger.logError(ControllerName.LEFTNAVPERSONALIZATIONCONTROLLER, exceptionMessage.ErrorMessageTitle, null, null, propbag);
	}


	/**
	* A method to use Add/Remove Selected Global Left Nav Items. 
	* @method Fxp.Controllers.LeftNavPersonalizationController.selectedGlobalLeftNavItems
	* @example <caption> Example to use selectedGlobalLeftNavItems</caption>
	* LeftNavPersonalizationController.selectedGlobalLeftNavItems(parentItem,childItem)
	*/
	selectedGlobalLeftNavItems(parentItem, childItem): void {
		let self = this;
		let isRemoveParent = false;
		if (CommonUtils.isNullOrEmpty(childItem)) {
			angular.forEach(parentItem.children, function (item) {
				item.isChildSelected = parentItem.isParentSelected;
			});
		} else {
			parentItem.isParentSelected = parentItem.children.every(function (item) { return item.isChildSelected; });
		}
		self.$scope.isAddPersonalizeAllow = self.isItemAllowToAdd();
	}

	/**
	* A method to use Enable/Disable Add Button. 
	* @method Fxp.Controllers.LeftNavPersonalizationController.isItemAllowToAdd
	* @example <caption> Example to use isItemAllowToAdd</caption>
	* LeftNavPersonalizationController.isItemAllowToAdd()
	*/
	isItemAllowToAdd(): boolean {
		var self = this;
		var flag = false;
		var navigationListLength = self.$scope.navigationList.length;
		for (let i = 0; i < navigationListLength; i++) {
			var parentItem = self.$scope.navigationList[i];
			// check if parent items are selected.
			if (parentItem.isParentSelected) {
				flag = true;
				break;
			} else {
				// check if child items are selected
				if (parentItem.hasChildren && parentItem.children != null) {
					var parentItemChildrenLength = parentItem.children.length;
					for (var j = 0; j < parentItemChildrenLength; j++) {
						var childItem = parentItem.children[j];
						if (childItem.isChildSelected) {
							flag = true;
							break;
						}
					}
				}
			}
		}
		return flag;
	}

	/**
	* A method to use Add selected Global Left Nav Items to User Navigation List
	* @method Fxp.Controllers.LeftNavPersonalizationController.selectedGlobalLeftNavItems
	* @example <caption> Example to use addToUserNavPersonalizationList</caption>
	* LeftNavPersonalizationController.addToUserNavPersonalizationList()
	*/
	addToUserNavPersonalizationList(): void {
		var self = this;
		let focusIndex = false;
		let isFocusedElement = false;
		// sorting navigation list object
		self.sortObject(self.$scope.navigationList, "sortOrder");
		let length = self.$scope.navigationList.length;
		let isParentToAdd = false;
		for (let i = 0; i < length; i++) {
			if (self.$scope.navigationList[i].hasChildren && self.$scope.navigationList[i].children != null) {
				let childLength = self.$scope.navigationList[i].children.length;
				let childNav = self.$scope.navigationList[i].children;
				isParentToAdd = false;
				for (let j = 0; j < childLength; j++) {
					if ((childNav[j].isChildSelected) && (!angular.isDefined(childNav[j].isUserLeftNavItem))) {
						childNav[j].isPersonaDefault = false;
						childNav[j].isUserLeftNavItem = true;
						isParentToAdd = true;
						if (!isFocusedElement)
							self.$scope.navigationList[i].isFocusedElement = isFocusedElement = true;
						self.manageUserNavChildItem(childNav[j], FxpConstants.ActionTypes.Add);
					}
					childNav[j].isChildSelected = false;
				}
				if (isParentToAdd) {
					if ((!angular.isDefined(self.$scope.navigationList[i].isUserLeftNavItem))) {
						self.$scope.navigationList[i].isPersonaDefault = false;
						self.$scope.navigationList[i].isUserLeftNavItem = true;
					}
					self.$scope.navigationList[i].isHideButtonVisible = true;
				}
			} else {
				if ((self.$scope.navigationList[i].isParentSelected) && (self.$scope.navigationList[i].isPersonalizationAllowed) && (!angular.isDefined(self.$scope.navigationList[i].isUserLeftNavItem))) {
					self.$scope.navigationList[i].isPersonaDefault = false;
					self.$scope.navigationList[i].isUserLeftNavItem = true;
					self.$scope.navigationList[i].isHideButtonVisible = true;
					if (!isFocusedElement)
						self.$scope.navigationList[i].isFocusedElement = isFocusedElement = true;

					self.manageUserNavParentItem(self.$scope.navigationList[i], FxpConstants.ActionTypes.Add);
				}
			}
			self.$scope.navigationList[i].isParentSelected = false;
		}
		self.$scope.isAddPersonalizeAllow = false;
		if (!isFocusedElement)
			self.setFocusToGlobalNavMasterItem(true);
	}

	/**
	* A method to use Remove Selected Items from User Navigation List
	* @method Fxp.Controllers.LeftNavPersonalizationController.removeUserNavPresonalization
	* @example <caption> Example to use removeUserNavPresonalization</caption>
	* LeftNavPersonalizationController.removeUserNavPresonalization()
	*/
	removeUserNavPresonalization(): void {
		var self = this;
		self.$scope.isRemovePersonalizeAllow = false;
		let navigationListLength = self.$scope.navigationList.length;
		for (let i = 0; i < navigationListLength; i++) {
			if (self.$scope.navigationList[i].hasChildren && self.$scope.navigationList[i].children != null) {
				let childLength = self.$scope.navigationList[i].children.length;
				let childNav = self.$scope.navigationList[i].children;
				for (let j = 0; j < childLength; j++) {
					if ((childNav[j].isSelected) && (angular.isDefined(childNav[j].isUserLeftNavItem)) && (!childNav[j].isPersonaDefault)) {
						delete childNav[j].isUserLeftNavItem;
						self.manageUserNavChildItem(childNav[j], FxpConstants.ActionTypes.Remove);
					}
					childNav[j].isSelected = false;
				}
				var childlength = self.$scope.navigationList[i].children.reduce(function (item, navItem) {
					return item + ((angular.isDefined(navItem.isUserLeftNavItem)));
				}, 0);
				if (childlength === 0) {
					if (!self.$scope.navigationList[i].isPersonaDefault) {
						delete self.$scope.navigationList[i].isUserLeftNavItem;
					}
				}
				self.$scope.navigationList[i].isSelected = false;
			} else {
				if ((self.$scope.navigationList[i].isSelected) && (!self.$scope.navigationList[i].isPersonaDefault)) {
					delete self.$scope.navigationList[i].isUserLeftNavItem;
					self.$scope.navigationList[i].isSelected = false;
					self.manageUserNavParentItem(self.$scope.navigationList[i], FxpConstants.ActionTypes.Remove);
				}
			}
		}
		self.setFocusToGlobalNavMasterItem(true);
		self.changeTabIndexOfUserList();
	}

	/**
	* A method to use Select/Unselect from User Navigation List
	* @method Fxp.Controllers.LeftNavPersonalizationController.selectedUserNavItems
	* @example <caption> Example to use selectedUserNavItems</caption>
	* LeftNavPersonalizationController. selectedUserNavItems(parentItem, isParent)
	*/
	selectedUserNavItems(parentItem, isParent): void {
		var self = this;
		if (isParent) {
			angular.forEach(parentItem.children, function (item, key) {
				if (!item.isPersonaDefault) {
					item.isSelected = parentItem.isSelected;
				}
			});
		} else {
			parentItem.isSelected = (!parentItem.isPersonaDefault) ? parentItem.children.filter(function (item)
			{ return (angular.isDefined(item.isUserLeftNavItem) && (item.isPersonaDefault == false)); }).every(function (item)
			{ return item.isSelected; }) : false;
			//parentItem.isSelected = parentItem.children.filter(function (item) { return (angular.isDefined(item.isUserLeftNavItem)&&(item.isPersonaDefault == false)); }).every(function (item) { return item.isSelected; });
		}
		self.$scope.isRemovePersonalizeAllow = self.isItemAllowToRemove();
		//removing/changing focus atrribute value of global nav list
		self.setFocusToGlobalNavMasterItem(false);
	}

	/**
	* A method to use submit User Navigation Preferences
	* @method Fxp.Controllers.LeftNavPersonalizationController.submitUserNavPresonalization
	* @example <caption> Example to use submitUserNavPresonalization</caption>
	* LeftNavPersonalizationController. submitUserNavPresonalization()
	*/
	submitUserNavPresonalization(): void {
		var self = this;
		if (!CommonUtils.isNullOrEmpty(self.personalizedUserNav.AddedItems) || !CommonUtils.isNullOrEmpty(self.personalizedUserNav.RemovedItems)) {
			self.pageLoaderService.fnShowPageLoader("Loading...");
			var savePersonalizedUserNav = { "AddedItems": [], "RemovedItems": [] };
			savePersonalizedUserNav.AddedItems = self.personalizedUserNav.AddedItems.map(function (result) {
				return result.id;
			});
			savePersonalizedUserNav.RemovedItems = self.personalizedUserNav.RemovedItems.map(function (result) {
				return result.id;
			});
			var userUpn = CommonUtils.generateUPN(self.$scope.personalizationUser, self.fxpConfigurationService.FxpAppSettings);
			self.personalizationService.savePersonalizedNavItems(userUpn, savePersonalizedUserNav, true).then(response => {
				var successBannerTimeout = 1000;
				self.fxpLogger.logInformation(ControllerName.LEFTNAVPERSONALIZATIONCONTROLLER, EventName.SUBMITUSERNAVPRESONALIZATIONSUCCESS);
				self.pageLoaderService.fnHidePageLoader();
				self.logAdminTelemetry(self.personalizedUserNav.AddedItems, "Added");
				self.logAdminTelemetry(self.personalizedUserNav.RemovedItems, "Remove");
				self.personalizedUserNav = {};

				self.fxpMessage.addMessage(self.$rootScope.fxpUIConstants.UIMessages.UserNavigationListSaved.SuccessMessage + " " +
					self.$scope.personalizationUser.DisplayName + " - " + self.$scope.personalizationUser.BusinessRole, FxpConstants.messageType.success);
				this.timeout(function () {
					self.navigateToUserLookup();
				}, successBannerTimeout);

			}, (exception) => {
				self.pageLoaderService.fnHidePageLoader();
				if (self.$rootScope.actOnBehalfOfUserActive)
					self.fxpMessage.addMessage(self.$rootScope.fxpUIConstants.UIMessages.UserNavigationListNotSavedForOBOUser.ErrorMessage, FxpConstants.messageType.error);
				else
					self.fxpMessage.addMessage(self.$rootScope.fxpUIConstants.UIMessages.UserNavigationListNotSaved.ErrorMessage, FxpConstants.messageType.error);
				var propbag = self.fxpLogger.createPropertyBag();
				propbag.addToBag("personalizationUser", self.$scope.personalizationUser.Alias);
				propbag.addToBag("exception", exception.message);
				self.fxpLogger.logError(ControllerName.LEFTNAVPERSONALIZATIONCONTROLLER, self.$rootScope.fxpUIConstants.UIMessages.UserNavigationListNotSaved.ErrorMessageTitle, null, null, propbag);
			});
		}
	}

	logAdminTelemetry(personalizationUserList: any, action: string): void {
		if (personalizationUserList.length > 0) {
			var self = this;
			var propBag = self.fxpLogger.createPropertyBag();
			propBag.addToBag("UserAlias", self.userInfo.alias);
			propBag.addToBag("RoleGroupName", self.userInfo.roleGroupName);
			propBag.addToBag("RoleGroupId", self.userInfo.roleGroupId);
			propBag.addToBag("PersonalizationUser", self.$scope.personalizationUser.Alias);
			propBag.addToBag(action + "Count", (personalizationUserList.length).toString());
			for (let i = 0; i < personalizationUserList.length; i++) {
				propBag.addToBag("L0" + action, personalizationUserList[i].displayName);
				self.fxpLogger.logMetric(ControllerName.LEFTNAVPERSONALIZATIONCONTROLLER, "AdminPersonalizationUserNavLinks" + action, 1, propBag);
			}
		}
	}

	/**
	* A method to use Enable/Disable remove Button
	* @method Fxp.Controllers.LeftNavPersonalizationController.isItemAllowToRemove
	* @example <caption> Example to use isItemAllowToRemove</caption>
	* LeftNavPersonalizationController.isItemAllowToRemove()
	*/
	isItemAllowToRemove(): boolean {
		var self = this;
		var flag;
		var userNavPersonalizationListLength = self.$scope.navigationList.length;
		for (let i = 0; i < userNavPersonalizationListLength; i++) {
			var parentItem = self.$scope.navigationList[i];
			// check if parent items are selected.
			if (parentItem.isSelected) {
				flag = true;
				break;
			} else {
				// check if child items are selected
				if (parentItem.hasChildren && parentItem.children != null) {
					var parentItemChildrenLength = parentItem.children.length;
					for (var j = 0; j < parentItemChildrenLength; j++) {
						var childItem = parentItem.children[j];
						if (childItem.isSelected) {
							flag = true;
							break;
						}
					}
				}
			}
		}
		return flag;
	}

	/**
	* A method to use show Confirm Popup
	* @method Fxp.Controllers.LeftNavPersonalizationController.showConfirmPopup
	* @example <caption> Example to use showConfirmPopup</caption>
	* LeftNavPersonalizationController.showConfirmPopup()
	*/
	showConfirmPopup(): void {
		var self = this;
		if (!CommonUtils.isNullOrEmpty(self.personalizedUserNav.AddedItems) || !CommonUtils.isNullOrEmpty(self.personalizedUserNav.RemovedItems)) {
			this.$scope.displayPopup = true;
			setTimeout(function () { CommonUtils.pullFocusToElement('role-group-popup'); }, 100);
		} else
			self.navigateToUserLookup();
	}

	/**
	* A method to use  hide Confirm Popup
	* @method Fxp.Controllers.LeftNavPersonalizationController.hideConfirmPopup
	* @example <caption> Example to use hideConfirmPopup</caption>
	* LeftNavPersonalizationController.hideConfirmPopup()
	*/
	hideConfirmPopup(): void {
		var self = this;
		this.$scope.displayPopup = false;
		if (self.isStateChanged) {
			self.$rootScope.$broadcast(FxpBroadcastedEvents.OnLeftNavHighlightByStateName, "UserLookupPersonalization");
		}
		self.isStateChanged = false;
		setTimeout(function () { CommonUtils.pullFocusToElement('secndryBtn'); }, 100);
	}

	/**
	* A method to use set focus the Selected Item
	* @method Fxp.Controllers.LeftNavPersonalizationController.setFocusToGlobalNavMasterItem
	* @example <caption> Example to use setFocusToGlobalNavMasterItem</caption>
	* LeftNavPersonalizationController.setFocusToGlobalNavMasterItem()
	*/
	setFocusToGlobalNavMasterItem(status) {
		let self = this;
		let index = self.getIndexOfObject(this.$scope.navigationList, "isPersonalizationAllowed", true);
		if (index > -1) {
			this.$scope.navigationList[index].isFocused = status;
		}
	};

	/**
	* A method to use set focus to the html element based on item  
	* @method Fxp.Controllers.LeftNavPersonalizationController.pullFocusToElement
	* @example <caption> Example to use pullFocusToElement</caption>
	* LeftNavPersonalizationController.pullFocusToElement(element,navItem)
	*/
	pullFocusToElement(element, navItem, itemType): void {
		if (itemType.toLowerCase() === "usernav" && navItem.isFocusedElement) {
			CommonUtils.pullFocusToElement(element);
			navItem.isFocusedElement = false;
		} else if (itemType.toLowerCase() === "globalnav" && navItem.isFocused) {
			navItem.isFocused = false;
		}
	}

	/**
	* A method is used to set the tabindex of first elements of User list to 0
	* @method Fxp.Controllers.LeftNavPersonalizationController.changeTabIndexOfUserList
	* LeftNavPersonalizationController.changeTabIndexOfUserList()
	*/
	changeTabIndexOfUserList(): void {
		var allMenuElements = $("#UserPersonalNavigationListForm").find(".fxpTabbableElem");
		if (allMenuElements.length > 0) {
			$(allMenuElements[0]).attr('tabindex', 0);
		}
	}

	/**
	* A method to use sorting the list of Items from collection
	* @method Fxp.Controllers.LeftNavPersonalizationController.sortObject
	* @example <caption> Example to use sortObject</caption>
	* LeftNavPersonalizationController.sortObject(srtObject, srtElement)
	*/
	sortObject(srtObject, srtElement): void {
		srtObject.sort(function (a, b) {
			return a[srtElement] > b[srtElement] ? 1 : a[srtElement] < b[srtElement] ? -1 : 0;
		});
	};

	/**
	* A method to use sget the Index of the macthing Item in the List
	* @method Fxp.Controllers.LeftNavPersonalizationController.getIndexOfObject
	* @example <caption> Example to use getIndexOfObject</caption>
	* LeftNavPersonalizationController.getIndexOfObject(source, compareKey, value)
	*/
	getIndexOfObject(source, compareKey, value): number {
		var index = -1;
		var length = source.length;
		for (let i = 0; i < length; i++) {
			if (source[i][compareKey] === value) {
				index = i;
				break;
			}
		}
		return index;
	}

	/**
	* A method to use  maintain audit infromation of  UserNavPrefList based on parent action track
	* @method Fxp.Controllers.LeftNavPersonalizationController.manageUserNavParentItem
	* @example <caption> Example to use manageUserNavParentItem</caption>
	* LeftNavPersonalizationController.manageUserNavParentItem(parent, action)
	*/
	manageUserNavParentItem(parent, action): void {
		let self = this;
		if (parent.hasChildren && parent.children != null) {
			//if parent have Childrens then we add childs
			let childrenLength = parent.children.length;
			for (let i = 0; i < childrenLength; i++) {
				self.manageUserNavChildItem(parent.children[i], action);
			}
		} else {
			//if parent does not have Childrens then we add parent
			self.manageUserNavChildItem(parent, action);
		}
	}

	/**
	* A method to use maintain audit infromation of  UserNavPrefList based on Child action track
	* @method Fxp.Controllers.LeftNavPersonalizationController.manageUserNavChildItem
	* @example <caption> Example to use manageUserNavChildItem</caption>
	* LeftNavPersonalizationController.manageUserNavChildItem(id, action)
	*/
	manageUserNavChildItem(item, action): void {
		let self = this;
		let constantActions = FxpConstants.ActionTypes;
		let oldAction = (action == constantActions.Add) ? constantActions.Remove : constantActions.Add;
		let index = self.getIndexOfObject(self.personalizedUserNav[oldAction], "id", item.id);
		if (index > -1) {
			self.personalizedUserNav[oldAction].splice(index, 1);
		} else {
			self.personalizedUserNav[action].push(angular.copy(item));
		}
	}

	/**
	* A method to measure pageloadduration and log pageloadmetrics
	* @method Fxp.Controllers.LeftNavPersonalizationController.logPageLoadMetricsForCurrentPage
	* @example <caption> Example to use logPageLoadMetricsForCurrentPage</caption>
	* LeftNavPersonalizationController.logPageLoadMetricsForCurrentPage(id, action)
	*/
	logPageLoadMetricsForCurrentPage(): void {
		var self = this;
		var pageLoadEndTime = performance.now();
		var pageLoadDuration = pageLoadEndTime - self.pageLoadStartTime;
		self.fxpLogger.logPageLoadMetrics(pageLoadDuration);
	}

}
LeftNavPersonalizationController.$inject = ['$rootScope', '$scope', '$state', '$timeout', 'FxpLoggerService', 'PageLoaderService', 'FxpMessageService', 'PersonalizationService', 'UserProfileService', '$window', 'FxpRouteService', 'NotificationStore', 'FxpConfigurationService'];


