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
import { DashboardService } from "../services/dashboardService";
import { CommonUtils } from "../utils/CommonUtils";
import { ActOnBehalfOfHelper } from "../factory/ActOnBehalfOfHelper";
import { ILeftNavControllerScope } from "../interfaces/ILeftNavControllerScope";
import { FxpRouteService } from "../services/FxpRouteService";
import { AdminLandingService } from "../services/AdminLandingService";
import { SettingsServiceProvider } from "../provider/SettingsServiceProvider";
import { FxpContext } from "../context/FxpContext";
import { SettingsType } from "../common/SettingsType";
import { Resiliency } from "../resiliency/FxpResiliency";
import { IRoleNavPersonalizationController } from "../interfaces/IRoleNavPersonalizationController";
import { PersonalizationService } from "../services/PersonalizationService";
import { ControllerName, EventName } from "../telemetry/TelemetryConst";
import { FxpLogHelper } from "../telemetry/FxpLogHelper";
import { FxpBroadcastedEvents } from "../services/FxpBroadcastedEvents";

/**
   * A main controller for FxpApp module. This is the controller having basic models and events.
   * @class Fxp.Controllers.RoleNavPersonalizationController
   * @classdesc A Manage RoleNav Personalization Controllercontroller of FxpApp module
   * @example <caption> 
   *  //To Use AppController
   *  angular.module('FxPApp').controller('RoleNavPersonalizationController', ['AnyDependency']);
   *  function RoleNavPersonalizationController(AnyDependency){ AnyDependency.doSomething(); }
   */
export class RoleNavPersonalizationController {
	private $rootScope: IRootScope;
	private $scope: IRoleNavPersonalizationController;
	private state: IStateService;
	private fxpLogger: ILogger;
	private pageLoaderService: PageLoaderService;
	private personalizationService: PersonalizationService;
	private fxpMessage: FxpMessageService;
	private fxpConfiguration: any;
	private roleGroupNavPersonalizationList: any;
	private globalNavMasterList: any;
	private parallelRequsetCounter: number;
	private personalizationConstants: any;
	private fxpConstants: FxpConstants;
	private pageLoadStartTime: number;
	private personalizedRoleGroupNav: any;
	private businessRoleId: any;
	private roleGroupId: any;
	private previousSelectedRole: any;
	private isRolePersonalizedListChanged: boolean = false;
	private isRoleGroupPersonalizedListChanged: boolean = false;
	private previousSelectedRoleGroup: any;
	private defaultRoleGroup: any;
	private timeout: any;
	private isStateChanged: boolean;
	private toState: any
	private toParams: any;
	private window: angular.IWindowService;
	private fxpRouteService: FxpRouteService;
	constructor($rootScope: IRootScope, $state: IStateService, $scope: IRoleNavPersonalizationController, fxpLoggerService: ILogger,
		pageLoaderService: PageLoaderService, fxpMessage: FxpMessageService, personalizationService: PersonalizationService, fxpConfiguration: FxpConfigurationService, $timeout: any, $window: angular.IWindowService, fxpRouteService: FxpRouteService) {
		this.pageLoadStartTime = performance.now();
		this.$rootScope = $rootScope;
		this.$scope = $scope;
		this.state = $state;
		this.timeout = $timeout;
		this.window = $window;
		this.fxpLogger = fxpLoggerService;
		this.fxpConstants = FxpConstants;
		this.roleGroupNavPersonalizationList = [];
		this.globalNavMasterList = [];
		this.personalizedRoleGroupNav = [];
		this.fxpMessage = fxpMessage;
		this.pageLoaderService = pageLoaderService;
		this.personalizationService = personalizationService;
		this.fxpRouteService = fxpRouteService;
		this.$scope.selectedGlobalLeftNavItems = this.selectedGlobalLeftNavItems.bind(this);
		this.$scope.addToRoleNavPersonalizationList = this.addToRoleNavPersonalizationList.bind(this);
		this.$scope.removeRoleGroupNavPresonalization = this.removeRoleGroupNavPresonalization.bind(this);
		this.$scope.submitRoleGroupNavPresonalization = this.submitRoleGroupNavPresonalization.bind(this);
		this.$scope.selectedRoleGroupNavItems = this.selectedRoleGroupNavItems.bind(this);
		this.$scope.showConfirmPopup = this.showConfirmPopup.bind(this);
		this.$scope.pullFocusToElement = this.pullFocusToElement.bind(this);
		this.$scope.isParentLinkEnabled = this.isParentLinkEnabled.bind(this);
		this.$scope.showConfirmSavePopup = this.showConfirmSavePopup.bind(this);
		this.$scope.hideConfirmSavePopup = this.hideConfirmSavePopup.bind(this);
		this.$scope.hideUnsavedConfirmPopup = this.hideUnsavedConfirmPopup.bind(this);
		this.$scope.leaveConfirmPopup = this.leaveConfirmPopup.bind(this);
		this.$scope.submitButtonDisabled = this.submitButtonDisabled.bind(this);
		this.$scope.selectedRoleDetails = this.selectedRoleDetails.bind(this);
		this.$scope.getRoleDetails = this.getRoleDetails.bind(this);
		this.parallelRequsetCounter = 0;
		this.defaultRoleGroup = fxpConfiguration.FxpBaseConfiguration.DefaultRoleGroup;
		this.isStateChanged = false;
		this.toState = null;
		this.toParams = null;
		var self = this;
		self.pageLoaderService.fnShowPageLoader("Loading...");
		self.getRoleGroupDetails();
		self.$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
			if (!CommonUtils.isNullOrEmpty(self.personalizedRoleGroupNav.AddedItems) || !CommonUtils.isNullOrEmpty(self.personalizedRoleGroupNav.RemovedItems)) {
				self.isRolePersonalizedListChanged = false;
				self.isRoleGroupPersonalizedListChanged = false;
				self.$scope.displayUnsavedChangesPopup = true;
				self.isStateChanged = true;
				self.toState = toState;
				self.toParams = toParams;
				event.preventDefault();
				self.timeout(function () { CommonUtils.pullFocusToElement('role-group-popup'); });
			}
		});
		self.window.onbeforeunload = function (event) {
			if (!CommonUtils.isNullOrEmpty(self.personalizedRoleGroupNav.AddedItems) || !CommonUtils.isNullOrEmpty(self.personalizedRoleGroupNav.RemovedItems)) {
				return "";
			}
		}
	}

	/**
	* A method to Get the getRoleGroupDetails
	* @method Fxp.Controllers.RoleNavPersonalizationController.getRoleGroupDetails
	* @example <caption> Example to use getRoleGroupDetails</caption>
	* RoleNavPersonalizationController.getRoleGroupDetails()
	*/
	getRoleGroupDetails(): void {
		var self = this;
		self.$scope.selectedRoleGroup = null;
		self.$scope.selectedRole = null;
		self.resetPersonalizedRoleGroupNav();
		if (!self.$scope.roleGroupDetails) {
			var getRoleGroupDetailsAPIStartTime = performance.now();
			self.personalizationService.getRoleGroupDetails().then(function (response) {
				self.logTelemetryForRolePersonalization("getRoleGroupDetailsAPIDuration", getRoleGroupDetailsAPIStartTime);
				self.logTelemetryForRolePersonalization("ManageRoleNavigationPageLoadDuration", self.pageLoadStartTime);
				if (!CommonUtils.isNullOrEmpty(response.data)) {
					self.$scope.roleGroupDetails = response.data.tenantRoles[Object.keys(response.data.tenantRoles)[0]].roles;
					
					self.pageLoaderService.fnHidePageLoader();
				}
			}, function (error) {
				self.logTelemetryForRolePersonalization("getRoleGroupDetailsAPIDuration", getRoleGroupDetailsAPIStartTime);
				self.logTelemetryForRolePersonalization("ManageRoleNavigationPageLoadDuration", self.pageLoadStartTime);
				var exceptionMessage = {
					ErrorMessage: self.$rootScope.fxpUIConstants.UIMessages.GeneralExceptionError.ErrorMessage,
					ErrorMessageTitle: self.$rootScope.fxpUIConstants.UIMessages.RoleGroupsPersonalisationExceptionError.ErrorMessageTitle
				}
				self.showAndLoggingErrorMsg(error, exceptionMessage, "2921");
			});
		}
	}

		/**
		 * A method to Get the getRoleDetails of the selected rolegroup
		 * @method Fxp.Controllers.RoleNavPersonalizationController.getRoleDetails
		 * @example <caption> Example to use getRoleDetails</caption>
		 * RoleNavPersonalizationController.getRoleDetails()
		 */
		getRoleDetails(): void {
			let self = this, totalDuration;
			var getRoleDetailsStartTime = performance.now();
			if(!CommonUtils.isNullOrEmpty(self.personalizedRoleGroupNav.AddedItems) || !CommonUtils.isNullOrEmpty(self.personalizedRoleGroupNav.RemovedItems)) {
			self.isRoleGroupPersonalizedListChanged = true;
			self.$scope.displayUnsavedChangesPopup = true;
			self.timeout(function () { CommonUtils.pullFocusToElement('role-group-popup'); });
			return;
		}
		self.previousSelectedRoleGroup = self.$scope.selectedRoleGroup;
		self.bindBusinessRoles();
		self.logTelemetryForRolePersonalization("RoleDetailsDropdownUIRenderDuration", getRoleDetailsStartTime);
		self.resetRolePersonalization();
	}

	/**
	 * A method to reset the Personalized RoleGroup Navigation
	 * @method Fxp.Controllers.RoleNavPersonalizationController.bindBusinessRoles
	 * @example <caption> Example to use bindBusinessRoles</caption>
	 * RoleNavPersonalizationController.bindBusinessRoles()
	 */
	bindBusinessRoles(): void {
		var self = this;
		self.$scope.selectedRole = null;
		self.resetPersonalizedRoleGroupNav();		
	}

	/**
	* A method to is used to get getRolesNavList/ getRoleGroupNavList
	* @method Fxp.Controllers.RoleNavPersonalizationController.selectedRoleDetails
	* @example <caption> Example to use showRoleDetails</caption>
	* RoleNavPersonalizationController.selectedRoleDetails()
	*/
	selectedRoleDetails(): void {
		let self = this;
		if (!CommonUtils.isNullOrEmpty(self.personalizedRoleGroupNav.AddedItems) || !CommonUtils.isNullOrEmpty(self.personalizedRoleGroupNav.RemovedItems)) {
			self.isRolePersonalizedListChanged = true;
			self.$scope.displayUnsavedChangesPopup = true;
			self.timeout(function () { CommonUtils.pullFocusToElement('role-group-popup'); });
			return;
		}
		self.previousSelectedRole = self.$scope.selectedRole;
		self.resetRolePersonalization();
	}


	/**
	* A method to reset the Personalized Role Group Navigation
	* @method Fxp.Controllers.RoleNavPersonalizationController.resetRolePersonalization
	* @example <caption> Example to use resetRolePersonalization</caption>
	* RoleNavPersonalizationController.resetRolePersonalization()
	*/
	resetRolePersonalization(): void {
		var self = this;
		self.parallelRequsetCounter = 0;
		self.resetPersonalizedRoleGroupNav();
		if (self.$scope.selectedRoleGroup) {
			self.pageLoaderService.fnShowPageLoader("Loading...");
			if (self.globalNavMasterList.length == 0)
				self.getGlobalNavMasterList();
			self.getRoleGroupNavList();
		}
	}

	/**
	* A method to reset the Personalized Role Group Navigation
	* @method Fxp.Controllers.RoleNavPersonalizationController.resetPersonalizedRoleGroupNav
	* @example <caption> Example to use resetPersonalizedRoleGroupNav</caption>
	* RoleNavPersonalizationController.resetPersonalizedRoleGroupNav()
	*/
	resetPersonalizedRoleGroupNav(): void {
		var self = this;
		self.$scope.navigationList = [];
		self.personalizedRoleGroupNav = { "AddedItems": [], "RemovedItems": [] };
		self.$scope.isAddPersonalizeAllow = false;
		self.$scope.isRemovePersonalizeAllow = false;
	}

	/**
	* A method to Get the GlobalNavMasterList for FxpAdmin User
	* @method Fxp.Controllers.RoleNavPersonalizationController.getGlobalNavMasterList
	* @example <caption> Example to use getGlobalNavMasterList</caption>
	* RoleNavPersonalizationController.getGlobalNavMasterList()
	*/
	getGlobalNavMasterList(): void {
		let self = this;
		self.parallelRequsetCounter++;
		var getMasterLeftNavAPIStartTime = performance.now();
		self.personalizationService.getMasterLeftNavItems().then(function (response) {
			self.logTelemetryForRolePersonalization("getGlobalNavMasterListAPIDuration", getMasterLeftNavAPIStartTime);
			if (!CommonUtils.isNullOrEmpty(response.data.result)) {
				self.globalNavMasterList = response.data.result;
				self.fxpLogger.logInformation(ControllerName.MANAGEROLENAVPERSONALIZATIONCONTROLLER, EventName.GETMASTERLEFTNAVITEMSSUCCESS);
				self.parallelRequsetCounter--;
				if (self.parallelRequsetCounter == 0) {
					self.mergeGlobalAndRolePreferenceNavigationList();
				}
			}
		}, function (exception) {
			self.logTelemetryForRolePersonalization("getGlobalNavMasterListAPIDuration", getMasterLeftNavAPIStartTime);
			var exceptionMessage = {
				ErrorMessage: self.$rootScope.fxpUIConstants.UIMessages.GeneralExceptionError.ErrorMessage,
				ErrorMessageTitle: self.$rootScope.fxpUIConstants.UIMessages.RoleGroupsMasterListExceptionError.ErrorMessageTitle
			}
			self.showAndLoggingErrorMsg(exception, exceptionMessage, "2917");
		});
	}

	/**
	*A method to Get the RolesNavList
	* @method Fxp.Controllers.RoleNavPersonalizationController.getUserNavList
	* @example <caption> Example to use getUserNavList</caption>
	* RoleNavPersonalizationController.getUserNavList()
	*/
	getRolesNavList(): void {
		let self = this, totalDuration;
		self.parallelRequsetCounter++;
		var getRolePersonalizedNavItemsAPIStartTime = performance.now()
		self.personalizationService.getRolePersonalizedNavItems(self.businessRoleId, self.roleGroupId).then(function (response) {
			self.logTelemetryForRolePersonalization("getRolePersonalizedNavItemsAPIDuration", getRolePersonalizedNavItemsAPIStartTime);
			if (!CommonUtils.isNullOrEmpty(response.data.result)) {
				self.roleGroupNavPersonalizationList = response.data.result;
				self.fxpLogger.logInformation(ControllerName.MANAGEROLENAVPERSONALIZATIONCONTROLLER,
					EventName.GETPERSONALIZEDROLEGROUPNAVITEMSSUCCESS);
				self.parallelRequsetCounter--;
				if (self.parallelRequsetCounter == 0) {
					self.mergeGlobalAndRolePreferenceNavigationList();
				}
			}
		},
			function (exception) {
				self.logTelemetryForRolePersonalization("getRolePersonalizedNavItemsAPIDuration", getRolePersonalizedNavItemsAPIStartTime);
				var exceptionMessage = {
					ErrorMessage: self.$rootScope.fxpUIConstants.UIMessages.GeneralExceptionError.ErrorMessage,
					ErrorMessageTitle: self.$rootScope.fxpUIConstants.UIMessages.RolesNavListExceptionError.ErrorMessageTitle
				}
				self.showAndLoggingErrorMsg(exception, exceptionMessage, "2918");
			});
	}


	/**
	*A method to Get the RoleGroupNavList
	* @method Fxp.Controllers.RoleNavPersonalizationController.getUserNavList
	* @example <caption> Example to use getUserNavList</caption>
	* RoleNavPersonalizationController.getUserNavList()
	*/
	getRoleGroupNavList(): void {
		let self = this;
		self.parallelRequsetCounter++;
		var getRoleGroupNavListAPIStartTime = performance.now();
		self.personalizationService.getRoleGroupPersonalizedList(self.$scope.selectedRoleGroup.roleName).then(function (response) {
			self.logTelemetryForRolePersonalization("getRoleGroupNavListAPIDuration", getRoleGroupNavListAPIStartTime);
			if (!CommonUtils.isNullOrEmpty(response.data.result)) {
				self.fxpLogger.logInformation(ControllerName.MANAGEROLENAVPERSONALIZATIONCONTROLLER,
					EventName.GETPERSONALIZEDROLEGROUPNAVITEMSSUCCESS);
				self.roleGroupNavPersonalizationList = response.data.result;
				self.parallelRequsetCounter--;
				if (self.parallelRequsetCounter == 0) {
					self.mergeGlobalAndRolePreferenceNavigationList();
				}
			}
			else{
				self.mergeGlobalAndRolePreferenceNavigationList();
			}
		}, function (exception) {
			self.logTelemetryForRolePersonalization("getRoleGroupNavListAPIDuration", getRoleGroupNavListAPIStartTime);
			var exceptionMessage = {
				ErrorMessage: self.$rootScope.fxpUIConstants.UIMessages.GeneralExceptionError.ErrorMessage,
				ErrorMessageTitle: self.$rootScope.fxpUIConstants.UIMessages.RoleGroupsDefaultListExceptionError.ErrorMessageTitle
			}
			self.showAndLoggingErrorMsg(exception, exceptionMessage, "2916");
		});
	}

	/**
	* A method used to merge Global And Role Preference Navigation List
	* @method Fxp.Controllers.RoleNavPersonalizationController.mergeGlobalAndRolePreferenceNavigationList
	* @example <caption> Example to use mergeGlobalAndRolePreferenceNavigationList</caption>
	* RoleNavPersonalizationController.mergeGlobalAndRolePreferenceNavigationList()
	*/
	mergeGlobalAndRolePreferenceNavigationList(): void {
		let self = this;
		var renderMasterAndRoleGroupListStartTime = performance.now();
		self.$scope.navigationList = angular.copy(self.globalNavMasterList);
		console.log(self.$scope.navigationList);
		let userNavlength = self.roleGroupNavPersonalizationList.length;
		for (let i = 0; i < userNavlength; i++) {
			let globalNavIndex = self.getIndexOfObject(self.$scope.navigationList, "id", self.roleGroupNavPersonalizationList[i].id);
			if (globalNavIndex > -1 && self.roleGroupNavPersonalizationList[i].applicableDevice != FxpConstants.applicableDevice.mobile) {
				if (self.roleGroupNavPersonalizationList[i].targetUIStateName && self.roleGroupNavPersonalizationList[i].targetUIStateName.toLowerCase() === "dashboard") {
					self.$scope.navigationList[globalNavIndex].isPersonaDefault = self.roleGroupNavPersonalizationList[i].isPersonaDefault;
				} else {
					self.$scope.navigationList[globalNavIndex].isPersonaDefault = !self.roleGroupNavPersonalizationList[i].isPersonaDefault;
				}

				self.$scope.navigationList[globalNavIndex].isRoleGroupLeftNavItem = true;
				if (self.roleGroupNavPersonalizationList[i].hasChildren && self.roleGroupNavPersonalizationList[i].children != null) {
					let roleGroupChildNavLength = self.roleGroupNavPersonalizationList[i].children.length;
					for (let j = 0; j < roleGroupChildNavLength; j++) {
						let globalNavChildIndex = self.getIndexOfObject(self.$scope.navigationList[globalNavIndex].children, "id", self.roleGroupNavPersonalizationList[i].children[j].id);
						if (globalNavChildIndex > -1) {
							self.$scope.navigationList[globalNavIndex].children[globalNavChildIndex].isPersonaDefault = self.roleGroupNavPersonalizationList[i].children[j].isPersonaDefault;
							self.$scope.navigationList[globalNavIndex].children[globalNavChildIndex].isRoleGroupLeftNavItem = true;
							self.$scope.navigationList[globalNavIndex].children[globalNavChildIndex].isChildSelected = true;
						}
					}
				}
			}
		}

		self.pageLoaderService.fnHidePageLoader();
		self.logTelemetryForRolePersonalization("renderUIMasterAndRoleOrRoleGroupList", renderMasterAndRoleGroupListStartTime);
	}

	/**
	 *A method to use log Error And NavigateToUserSelectionPage
	 * @method Fxp.Controllers.RoleNavPersonalizationController.showAndLoggingErrorMsg
	 * @param {any} exception contains catch block exception
	 * @param {any} exceptionMessage contains errorMessage and errorMessageTitle
	 * @example <caption> Example to use showAndLoggingErrorMsg</caption>
	 * RoleNavPersonalizationController.showAndLoggingErrorMsg()
	 */
	showAndLoggingErrorMsg(exception, exceptionMessage, errorCode): void {
		var self = this;
		self.parallelRequsetCounter--;
		self.pageLoaderService.fnHidePageLoader();
		self.fxpMessage.addMessage(exceptionMessage.ErrorMessage, FxpConstants.messageType.error);
		var propbag = self.fxpLogger.createPropertyBag();
		if (exception == null) {
			exception = {};
			exception.message = exceptionMessage.ErrorMessage;
			propbag.addToBag(FxpConstants.metricConstants.ErrorText, exception.message);
		} else {
			propbag.addToBag(FxpConstants.metricConstants.Status, exception.status);
			propbag.addToBag(FxpConstants.metricConstants.StatusText, exception.statusText);
			propbag.addToBag(FxpConstants.metricConstants.ErrorUrl, exception.config ? exception.config.url : '');
		}

		var selectedRoleOrRoleGroup = self.$scope.selectedRoleGroup.roleName;
		propbag.addToBag("personalizationRoleOrRoleGroup", selectedRoleOrRoleGroup);
	
		self.fxpLogger.logError(ControllerName.MANAGEROLENAVPERSONALIZATIONCONTROLLER, exceptionMessage.ErrorMessageTitle, errorCode, null, propbag);
	}

	/**
	*A method to use Add/Remove Selected Global Left Nav Items. 
	* @method Fxp.Controllers.RoleNavPersonalizationController.selectedGlobalLeftNavItems
	* @param {any} parentItem selected parent item from master list 
	* @param {any} childItem selected child item from master list
	* @example <caption> Example to use selectedGlobalLeftNavItems</caption>
	* RoleNavPersonalizationController.selectedGlobalLeftNavItems(parentItem,childItem)
	*/
	selectedGlobalLeftNavItems(parentItem, childItem): void {
		let self = this;
		if (CommonUtils.isNullOrEmpty(childItem)) {
			angular.forEach(parentItem.children, function (item) {
				if (!angular.isDefined(item.isRoleGroupLeftNavItem)) {
					item.isChildSelected = parentItem.isParentSelected;
				}
			});

		} else {
			//length is verifying for if any element is checked under Lo if not splice Lo from selected list
			parentItem.isParentSelected = parentItem.children.every(function (item) { return item.isChildSelected; });
		}
		self.$scope.isAddPersonalizeAllow = self.isItemAllowToAdd();

	}
	/**
	* A method to use Enable/Disable Add Button. 
	* @method Fxp.Controllers.RoleNavPersonalizationController.isItemAllowToAdd
	* @example <caption> Example to use isItemAllowToAdd</caption>
	* RoleNavPersonalizationController.isItemAllowToAdd()
	*/
	isItemAllowToAdd(): boolean {
		var self = this;
		var flag;
		var navigationListLength = self.$scope.navigationList.length;
		for (let i = 0; i < navigationListLength; i++) {
			var parentItem = self.$scope.navigationList[i];
			// check if parent items are selected.
			if (parentItem.isParentSelected && !angular.isDefined(parentItem.isRoleGroupLeftNavItem)) {
				flag = true;
				break;
			} else {
				// check if child items are selected
				if (parentItem.hasChildren && parentItem.children != null) {
					var parentItemChildrenLength = parentItem.children.length;
					for (var j = 0; j < parentItemChildrenLength; j++) {
						var childItem = parentItem.children[j];
						if (childItem.isChildSelected && !angular.isDefined(childItem.isRoleGroupLeftNavItem)) {
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
	*A method to use Add selected Global Left Nav Items to RoleGroup Navigation List
	* @method Fxp.Controllers.RoleNavPersonalizationController.selectedGlobalLeftNavItems
	* @example <caption> Example to use addToRoleNavPersonalizationList</caption>
	* RoleNavPersonalizationController.addToRoleNavPersonalizationList()
	*/
	addToRoleNavPersonalizationList(): void {
		var self = this;
		let focusIndex = false;
		let isFocusedElement = false;
		// sorting navigation list object
		self.sortObject(self.$scope.navigationList, "sortOrder");
		let navigationListLength = self.$scope.navigationList.length;
		let isParentToAdd = false;
		for (let i = 0; i < navigationListLength; i++) {
			if (self.$scope.navigationList[i].hasChildren && self.$scope.navigationList[i].children != null) {
				let childLength = self.$scope.navigationList[i].children.length;
				let childNav = self.$scope.navigationList[i].children;
				isParentToAdd = false;
				for (let j = 0; j < childLength; j++) {
					if ((childNav[j].isChildSelected) && (!angular.isDefined(childNav[j].isRoleGroupLeftNavItem))) {
						childNav[j].isPersonaDefault = false;
						childNav[j].isRoleGroupLeftNavItem = true;
						isParentToAdd = true;
						if (!isFocusedElement)
							self.$scope.navigationList[i].isFocusedElement = isFocusedElement = true;
						self.manageRoleGroupNavChildItem(childNav[j], FxpConstants.ActionTypes.Add);
					}
					childNav[j].isChildSelected = self.isParentLinkEnabled(childNav[j]);
				}
				if (isParentToAdd) {
					if ((!angular.isDefined(self.$scope.navigationList[i].isRoleGroupLeftNavItem))) {
						self.$scope.navigationList[i].isPersonaDefault = false;
						self.$scope.navigationList[i].isRoleGroupLeftNavItem = true;
					}
					self.$scope.navigationList[i].isHideButtonVisible = true;
				}
			} else {
				if ((self.$scope.navigationList[i].isParentSelected) && (self.$scope.navigationList[i].isPersonalizationAllowed) && (!angular.isDefined(self.$scope.navigationList[i].isRoleGroupLeftNavItem))) {
					self.$scope.navigationList[i].isPersonaDefault = false;
					self.$scope.navigationList[i].isRoleGroupLeftNavItem = true;
					self.$scope.navigationList[i].isHideButtonVisible = true;
					if (!isFocusedElement)
						self.$scope.navigationList[i].isFocusedElement = isFocusedElement = true;

					self.manageRoleGroupParentItem(self.$scope.navigationList[i], FxpConstants.ActionTypes.Add);
				}
			}
			self.$scope.navigationList[i].isParentSelected = self.isParentLinkEnabled(self.$scope.navigationList[i]);
		}
		self.$scope.isAddPersonalizeAllow = false;
		if (!isFocusedElement)
			self.setFocusToGlobalNavMasterItem(true);
		self.changeTabIndexOfUserList("#role-group-master-navigation-list");
	}

	/**
	 *A method to use Remove Selected Items from RoleGroup Navigation List
	 * @method Fxp.Controllers.RoleNavPersonalizationController.removeRoleGroupNavPresonalization
	 * @example <caption> Example to use removeRoleGroupNavPresonalization</caption>
	 * RoleNavPersonalizationController.removeRoleGroupNavPresonalization()
	 */
	removeRoleGroupNavPresonalization(): void {
		var self = this;
		self.$scope.isRemovePersonalizeAllow = false;
		let navigationListLength = self.$scope.navigationList.length;
		for (let i = 0; i < navigationListLength; i++) {
			if (self.$scope.navigationList[i].hasChildren && self.$scope.navigationList[i].children != null) {
				let childLength = self.$scope.navigationList[i].children.length;
				let childNav = self.$scope.navigationList[i].children;
				for (let j = 0; j < childLength; j++) {
					if ((childNav[j].isSelected) && (angular.isDefined(childNav[j].isRoleGroupLeftNavItem)) && (!childNav[j].isPersonaDefault)) {
						delete childNav[j].isRoleGroupLeftNavItem;
						self.manageRoleGroupNavChildItem(childNav[j], FxpConstants.ActionTypes.Remove);
					}
					childNav[j].isSelected = false;
					childNav[j].isChildSelected = self.isParentLinkEnabled(childNav[j]);
				}
				var childlength = self.$scope.navigationList[i].children.reduce(function (item, navItem) {
					return item + ((angular.isDefined(navItem.isRoleGroupLeftNavItem)));
				}, 0);
				if (childlength === 0) {
					if (!self.$scope.navigationList[i].isPersonaDefault) {
						delete self.$scope.navigationList[i].isRoleGroupLeftNavItem;
					}
				}
				self.$scope.navigationList[i].isSelected = false;
				self.$scope.navigationList[i].isParentSelected = self.isParentLinkEnabled(self.$scope.navigationList[i]);
			} else {
				if ((self.$scope.navigationList[i].isSelected) && (!self.$scope.navigationList[i].isPersonaDefault)) {
					delete self.$scope.navigationList[i].isRoleGroupLeftNavItem;
					self.$scope.navigationList[i].isSelected = false;
					self.$scope.navigationList[i].isParentSelected = self.isParentLinkEnabled(self.$scope.navigationList[i]);
					self.manageRoleGroupParentItem(self.$scope.navigationList[i], FxpConstants.ActionTypes.Remove);
				}
			}
		}
		self.setFocusToGlobalNavMasterItem(true);
		self.changeTabIndexOfUserList("#default-navigation-container");
	}

	/**
	 *A method to use Select/Unselect from User Navigation List
	 * @method Fxp.Controllers.RoleNavPersonalizationController.selectedRoleGroupNavItems
	 * @param {any} parentItem selected item from default rolegroup
	 * @param {boolean} isParent selected item is parent or not
	 * @example <caption> Example to use selectedRoleGroupNavItems</caption>
	 * RoleNavPersonalizationController. selectedRoleGroupNavItems(parentItem, isParent)
	 */
	selectedRoleGroupNavItems(parentItem, isParent): void {
		var self = this;
		if (isParent) {
			angular.forEach(parentItem.children, function (item, key) {
				if (!item.isPersonaDefault) {
					item.isSelected = parentItem.isSelected;
				}
			});
		} else {
			parentItem.isSelected = (!parentItem.isPersonaDefault) ? parentItem.children.filter(function (item) { return (angular.isDefined(item.isRoleGroupLeftNavItem) && (item.isPersonaDefault == false)); }).every(function (item) { return item.isSelected; }) : false;
		}
		self.$scope.isRemovePersonalizeAllow = self.isItemAllowToRemove();
		self.setFocusToGlobalNavMasterItem(false);
	}

	/**
	*A method to use submit RoleGroup Navigation Preferences
	* @method Fxp.Controllers.RoleNavPersonalizationController.submitRoleGroupNavPresonalization
	* @example <caption> Example to use submitRoleGroupNavPresonalization</caption>
	* RoleNavPersonalizationController. submitRoleGroupNavPresonalization()
	*/
	submitRoleGroupNavPresonalization(): void {
		var self = this, totalDuration;
		if (!CommonUtils.isNullOrEmpty(self.personalizedRoleGroupNav.AddedItems) || !CommonUtils.isNullOrEmpty(self.personalizedRoleGroupNav.RemovedItems)) {
			self.pageLoaderService.fnShowPageLoader("Loading...");
			var savePersonalizedRoleGroupNav = { "AddedItems": [], "RemovedItems": [], "AppRole": self.$scope.selectedRoleGroup.roleName };
			savePersonalizedRoleGroupNav.AddedItems = self.personalizedRoleGroupNav.AddedItems.map(function (result) {
				return result.id;
			});
			savePersonalizedRoleGroupNav.RemovedItems = self.personalizedRoleGroupNav.RemovedItems.map(function (result) {
				return result.id;
			});

			var submitRoleGroupNavPresonalizationAPISatrtTime = performance.now()
			self.personalizationService.saveRoleGroupPersonalizedNavItems(savePersonalizedRoleGroupNav, true).then(response => {
				self.logTelemetryForRolePersonalization("submitRoleGroupNavPresonalizationAPIDuartion", submitRoleGroupNavPresonalizationAPISatrtTime);
				self.fxpLogger.logInformation(ControllerName.MANAGEROLENAVPERSONALIZATIONCONTROLLER, EventName.SUBMITROLEGROUPNAVPRESONALIZATIONSUCCESS);
				self.pageLoaderService.fnHidePageLoader();
				self.$scope.displaySavePopup = false;
				var role = self.$scope.selectedRoleGroup.roleName;
				var stringType = " Role Group";
				CommonUtils.pullFocusToElement('role-group-selection');
				self.fxpMessage.addMessage(self.$rootScope.fxpUIConstants.UIMessages.RoleGroupNavigationListSaved.SuccessMessage.replace('{0}', role).replace('{1}', stringType), FxpConstants.messageType.success);
				self.auditLogRoleGroupOrRolePersonalization();
				self.getRoleGroupDetails();
			}, (exception) => {
				self.logTelemetryForRolePersonalization("submitRoleGroupNavPresonalizationAPIDuartion", submitRoleGroupNavPresonalizationAPISatrtTime);
				self.$scope.displaySavePopup = false;
				var errorMessage;
				if (exception.status === 401) {
					errorMessage = self.$rootScope.fxpUIConstants.UIMessages.RoleGroupPersonalizationSubmitUnAuthorization;
				} else {
					errorMessage = self.$rootScope.fxpUIConstants.UIMessages.RoleGroupPersonalizationSubmitError;
				}
				self.showAndLoggingErrorMsg(exception, errorMessage, "2921");
			});
		}
	}



	/**
	*A method to use Enable/Disable remove Button
	* @method Fxp.Controllers.RoleNavPersonalizationController.isItemAllowToRemove
	* @example <caption> Example to use isItemAllowToRemove</caption>
	* RoleNavPersonalizationController.isItemAllowToRemove()
	*/
	isItemAllowToRemove(): boolean {
		var self = this;
		var flag;
		var roleGroupNavPersonalizationListLength = self.$scope.navigationList.length;
		for (let i = 0; i < roleGroupNavPersonalizationListLength; i++) {
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
	*A method to use audit the personalized of Role/RoleGroup 
	* @method Fxp.Controllers.RoleNavPersonalizationController.auditLogRoleGroupOrRolePersonalization
	* @example <caption> Example to use auditLogRoleGroupOrRolePersonalization</caption>
	* RoleNavPersonalizationController.auditLogRoleGroupOrRolePersonalization()
	*/
	auditLogRoleGroupOrRolePersonalization(): void {
		var self = this;
		var propBag = self.fxpLogger.createPropertyBag();
		if (self.$scope.selectedRole.BusinessRoleName === self.$scope.defaultBusinessRoleGroup) {
			propBag.addToBag(FxpConstants.metricConstants.ModifiedRoleGroupName, self.$scope.selectedRoleGroup.RoleGroupName);
			propBag.addToBag(FxpConstants.metricConstants.ModifiedRoleGroupID, self.roleGroupId);
		} else {
			propBag.addToBag(FxpConstants.metricConstants.ModifiedBusinessRoleName, self.$scope.selectedRole.BusinessRoleName);
			propBag.addToBag(FxpConstants.metricConstants.ModifiedBusinessRoleID, self.businessRoleId);
		}

		propBag.addToBag(FxpConstants.metricConstants.TimeStamp, FxpLogHelper.getTimeStamp());

		var leftNavLinksValuesBeforeModification = self.getRoleGroupFlatDataStructure(self.roleGroupNavPersonalizationList).filter(function (item) {
			return item.applicableDevice != FxpConstants.applicableDevice.mobile;
		}).map(function (result) {
			return result.id;
		});
		propBag.addToBag(FxpConstants.metricConstants.LeftNavLinksValueBeforeModification, JSON.stringify(leftNavLinksValuesBeforeModification));

		var leftNavLinksValueAfterModification = self.getRoleGroupFlatDataStructure(self.$scope.navigationList).filter(function (item) {
			return angular.isDefined(item.isRoleGroupLeftNavItem);
		}).map(function (result) {
			return result.id;
		});

		if (leftNavLinksValueAfterModification.length > 0) {
			propBag.addToBag(FxpConstants.metricConstants.LeftNavLinksValueAfterModification, JSON.stringify(leftNavLinksValueAfterModification));
		}
		self.fxpLogger.logInformation(ControllerName.MANAGEROLENAVPERSONALIZATIONCONTROLLER, "Fxp.ManageRoleNavPersonalizationController.AuditLogs", propBag);
	}


	/**
   * Get the flat structure of getRoleGroupFlatDataStructure data
   * @method Fxp.Controllers.RoleNavPersonalizationController.getRoleGroupFlatDataStructure
   * @param {roleGroupNavPersonalizationList } roleGroupNavPersonalizationList roleGroupNavPersonalizationList data of the role/role group.
   * @example <caption> Example to invoke getRoleGroupFlatDataStructure</caption>
   *  RoleNavPersonalizationController.getRoleGroupFlatDataStructure();
   */
	getRoleGroupFlatDataStructure(roleGroupNavPersonalizationList: any) {
		var list = new Array();
		for (var i = 0, L0length = roleGroupNavPersonalizationList.length; i < L0length; i++) {
			if (roleGroupNavPersonalizationList[i].hasChildren) {
				list.push(roleGroupNavPersonalizationList[i]);
				for (var j = 0, L1length = roleGroupNavPersonalizationList[i].children.length; j < L1length; j++) {
					list.push(roleGroupNavPersonalizationList[i].children[j]);
				}
			}
			else {
				list.push(roleGroupNavPersonalizationList[i]);
			}
		}
		return list;
	}

	/**
	*A method to use Enable/Disable the Parrent Link
	* @method Fxp.Controllers.RoleNavPersonalizationController.isParentLinkEnabled
	* @param {any} navItem object whichj we are going to dispaly in UI
	* @example <caption> Example to use isParentLinkEnabled</caption>
	* RoleNavPersonalizationController.isParentLinkEnabled()
	*/
	isParentLinkEnabled(navItem): boolean {
		if (!navItem.hasChildren) {
			return angular.isDefined(navItem.isRoleGroupLeftNavItem);
		}
		else {
			var childlength = navItem.children.reduce(function (item, childItem) {
				return item + ((angular.isDefined(childItem.isRoleGroupLeftNavItem)));
			}, 0);
			return navItem.children.length === childlength;
		}
	}

	/**
	*A method to use show Confirm Popup
	* @method Fxp.Controllers.RoleNavPersonalizationController.showConfirmPopup
	* @example <caption> Example to use showConfirmPopup</caption>
	* RoleNavPersonalizationController.showConfirmPopup()
	*/
	showConfirmPopup(): void {
		var self = this;
		if (CommonUtils.isNullOrEmpty(self.personalizedRoleGroupNav.AddedItems) && CommonUtils.isNullOrEmpty(self.personalizedRoleGroupNav.RemovedItems)) {
			self.getRoleGroupDetails();
			return;
		}

		self.$scope.displayUnsavedChangesPopup = true;
		self.timeout(function () { CommonUtils.pullFocusToElement('role-group-popup'); });
	}

	/**
	*A method to use show Confirm save popup
	* @method Fxp.Controllers.RoleNavPersonalizationController.showConfirmSavePopup
	* @example <caption> Example to use showConfirmSavePopup</caption>
	* RoleNavPersonalizationController.showConfirmSavePopup()
	*/
	showConfirmSavePopup(): void {
		var self = this;
		self.$scope.displaySavePopup = true;
		self.timeout(function () { CommonUtils.pullFocusToElement('savepopup'); });
	}

	/**
	*A method to use  hide Confirm save popup
	* @method Fxp.Controllers.RoleNavPersonalizationController.hideConfirmSavePopup
	* @example <caption> Example to use hideConfirmSavePopup</caption>
	* RoleNavPersonalizationController.hideConfirmSavePopup()
	*/
	hideConfirmSavePopup(): void {
		var self = this;
		self.$scope.displaySavePopup = false;
		self.timeout(function () { CommonUtils.pullFocusToElement('role-group-save-btn'); });
	}

	/**
	*A method to use  Leave Unsaved changes popup
	* @method Fxp.Controllers.RoleNavPersonalizationController.leaveConfirmPopup
	* @example <caption> Example to use leaveConfirmPopup</caption>
	* RoleNavPersonalizationController.leaveConfirmPopup()
	*/
	leaveConfirmPopup(): void {
		var self = this, totalDuration;
		self.$scope.displayUnsavedChangesPopup = false;
		//this is triggered when there is any state changed and there is unsaved changes due to GLN click or Fxp Header click
		if (self.isStateChanged && !(self.toState.name == self.state.current.name)) {
			self.resetPersonalizedRoleGroupNav();
			self.fxpRouteService.navigatetoSpecificState(self.toState.name, self.toParams);
		} else {
			self.isStateChanged = false;
			if (self.isRoleGroupPersonalizedListChanged) {
				self.isRoleGroupPersonalizedListChanged = false;
				self.bindBusinessRoles();
				self.timeout(function () { CommonUtils.pullFocusToElement('role-group-selection'); });
				return;
			}

			if (self.isRolePersonalizedListChanged) {
				self.isRolePersonalizedListChanged = false;
				self.resetRolePersonalization();
				self.timeout(function () { CommonUtils.pullFocusToElement('role-selection'); });
				return;
			}
			self.getRoleGroupDetails();
			self.timeout(function () { CommonUtils.pullFocusToElement('role-group-cancel-btn'); });
		}
	}

	/**
	*A method to use  hide hide UnsavedConfirmPopup Popup
	* @method Fxp.Controllers.RoleNavPersonalizationController.hideUnsavedConfirmPopup
	* @example <caption> Example to use hideUnsavedConfirmPopup</caption>
	* RoleNavPersonalizationController.hideUnsavedConfirmPopup()
	*/
	hideUnsavedConfirmPopup(): void {
		var self = this;
		if (self.isStateChanged) {
			//when we click on GLN highlight changes to return back to the existing highlight we are broadcasting this method
			self.$rootScope.$broadcast(FxpBroadcastedEvents.OnLeftNavHighlightByStateName, self.state.current.name);
		}
		self.isStateChanged = false;
		self.$scope.displayUnsavedChangesPopup = false;
		if (self.isRoleGroupPersonalizedListChanged) {
			self.isRoleGroupPersonalizedListChanged = false;
			self.$scope.selectedRoleGroup = self.previousSelectedRoleGroup;
			self.$scope.selectedRole = self.previousSelectedRole;
			self.timeout(function () { CommonUtils.pullFocusToElement('role-group-selection'); });
			return;
		}

		if (self.isRolePersonalizedListChanged) {
			self.isRolePersonalizedListChanged = false;
			self.$scope.selectedRole = self.previousSelectedRole;
			self.timeout(function () { CommonUtils.pullFocusToElement('role-selection'); });
			return;
		}
		self.timeout(function () { CommonUtils.pullFocusToElement('role-group-cancel-btn'); });
	}

	/**
	*A method to use  hide hide UnsavedConfirmPopup Popup
	* @method Fxp.Controllers.RoleNavPersonalizationController.submitButtonDisabled
	* @example <caption> Example to use submitButtonDisabled</caption>
	* RoleNavPersonalizationController.submitButtonDisabled()
	*/
	submitButtonDisabled(): boolean {
		var self = this;
		return (CommonUtils.isNullOrEmpty(self.$scope.selectedRoleGroup)) || (self.personalizedRoleGroupNav.AddedItems.length === 0 && self.personalizedRoleGroupNav.RemovedItems.length == 0)
	}

	/**
	*A method to use set focus the Selected Item
	* @method Fxp.Controllers.RoleNavPersonalizationController.setFocusToGlobalNavMasterItem
	* @param {boolean} status 
	* @example <caption> Example to use setFocusToGlobalNavMasterItem</caption>
	* RoleNavPersonalizationController.setFocusToGlobalNavMasterItem()
	*/
	setFocusToGlobalNavMasterItem(status) {
		let self = this;
		let index = self.getIndexOfObject(this.$scope.navigationList, "isPersonalizationAllowed", true);
		if (index > -1) {
			this.$scope.navigationList[index].isFocused = status;
		}
	};

	/**
	*A method to use set focus to the html element based on item  
	* @method Fxp.Controllers.RoleNavPersonalizationController.pullFocusToElement
	* @param {string} element which element to focus
	* @param {any} navItem object whichj we are going to dispaly in UI
	* @param {string} itemType is master or role/Rolegroup
	* @example <caption> Example to use pullFocusToElement</caption>
	* RoleNavPersonalizationController.pullFocusToElement(element,navItem)
	*/
	pullFocusToElement(element, navItem, itemType): void {
		if (itemType.toLowerCase() === "rolegroupnav" && navItem.isFocusedElement) {
			CommonUtils.pullFocusToElement(element);
			navItem.isFocusedElement = false;
		} else if (itemType.toLowerCase() === "globalnav" && navItem.isFocused) {
			navItem.isFocused = false;
		}
	}
	/**
	*A method is used to set the tabindex of first elements of User list to 0
	* @method Fxp.Controllers.RoleNavPersonalizationController.changeTabIndexOfUserList
	* @param {string} containerId contains id of an element
	* RoleNavPersonalizationController.changeTabIndexOfUserList()
	*/
	changeTabIndexOfUserList(containerId): void {
		var allMenuElements = $(containerId).find(".fxpTabbableElem");
		if (allMenuElements.length > 0) {
			$(allMenuElements[0]).attr('tabindex', 0);
		}
	}

	/**
   *A method to use sorting the list of Items from collection
   * @method Fxp.Controllers.RoleNavPersonalizationController.sortObject
   * @param {any} srtObject contains a collection which we need to sort
   * @param {string} srtElement string based on which sort will be done
   * @example <caption> Example to use sortObject</caption>
   * RoleNavPersonalizationController.sortObject(srtObject, srtElement)
   */
	sortObject(srtObject, srtElement): void {
		srtObject.sort(function (a, b) {
			return a[srtElement] > b[srtElement] ? 1 : a[srtElement] < b[srtElement] ? -1 : 0;
		});
	};

	/**
	*A method to use sget the Index of the macthing Item in the List
	* @method Fxp.Controllers.RoleNavPersonalizationController.getIndexOfObject
	* @param {any} source pass source as a collection for comparision
	* @param {string} compareKey string based on which comaprison will be done
	* @param {string} value is an object with which we need to compare
	* @example <caption> Example to use getIndexOfObject</caption>
	* RoleNavPersonalizationController.getIndexOfObject(source, compareKey, value)
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
	*A method to use  maintain audit infromation of  manageRoleGroupNavChildItem based on parent action track
	* @method Fxp.Controllers.RoleNavPersonalizationController.manageRoleGroupParentItem
	* @param {any} parent collection contains added and removed items
	* @param {string} action string that specifies add or remove
	* @example <caption> Example to use manageRoleGroupParentItem</caption>
	* RoleNavPersonalizationController.manageRoleGroupParentItem(parent, action)
	*/
	manageRoleGroupParentItem(parent, action): void {
		let self = this;
		if (parent.hasChildren && parent.children != null) {
			//if parent have Childrens then we add childs
			let childrenLength = parent.children.length;
			for (let i = 0; i < childrenLength; i++) {
				self.manageRoleGroupNavChildItem(parent.children[i], action);
			}
		} else {
			//if parent does not have Childrens then we add parent
			self.manageRoleGroupNavChildItem(parent, action);
		}
	}

	/**
	*A method to use maintain audit infromation of  manageRoleGroupNavChildItem based on Child action track
	* @method Fxp.Controllers.RoleNavPersonalizationController.manageRoleGroupNavChildItem
	* @param {any} item collection contains added and removed items
	* @param {string} action string that specifies add or remove 
	* @example <caption> Example to use manageRoleGroupNavChildItem</caption>
	* RoleNavPersonalizationController.manageRoleGroupNavChildItem(id, action)
	*/
	manageRoleGroupNavChildItem(item, action): void {
		let self = this;
		let constantActions = FxpConstants.ActionTypes;
		let oldAction = (action == constantActions.Add) ? constantActions.Remove : constantActions.Add;
		let index = self.getIndexOfObject(self.personalizedRoleGroupNav[oldAction], "id", item.id);
		if (index > -1) {
			self.personalizedRoleGroupNav[oldAction].splice(index, 1);
		} else {
			self.personalizedRoleGroupNav[action].push(angular.copy(item));
		}
	}

	/**
	*A method to measure pageloadduration and log pageloadmetrics
	* @method Fxp.Controllers.RoleNavPersonalizationController.logPageLoadMetricsForCurrentPage
	* @param {string} actionType string that specifies the action name performed by user
	* @param {string} totalDuration string that specifies totalDuration
	* @example <caption> Example to use logPageLoadMetricsForCurrentPage</caption>
	* RoleNavPersonalizationController.logPageLoadMetricsForCurrentPage(actionType, totalDuration)
	*/
	logTelemetryForRolePersonalization(actionType, startTime): void {
		var self = this, totalDuration;
		totalDuration = performance.now() - startTime;
		var propBag = self.fxpLogger.createPropertyBag();
		propBag.addToBag(FxpConstants.metricConstants.ScreenRoute, self.state.current.name);
		propBag.addToBag(actionType, totalDuration);
		self.fxpLogger.logInformation(ControllerName.MANAGEROLENAVPERSONALIZATIONCONTROLLER, "Fxp.ManageRoleNavPersonalizationController.ActionDuration", propBag);
	}
}
RoleNavPersonalizationController.$inject = ['$rootScope', '$state', '$scope', 'FxpLoggerService', 'PageLoaderService', 'FxpMessageService', 'PersonalizationService', 'FxpConfigurationService', '$timeout', '$window', 'FxpRouteService'];
