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
import { IRootScope } from "../interfaces/IRootScope";
import { UserProfileService } from "../services/userProfileService";
import { LogPropertyBag } from "../telemetry/LogPropertyBag";
import { TelemetryContext } from "../telemetry/telemetrycontext";
import { FxpConfigurationService } from "../services/FxpConfiguration";
import { PageLoaderService } from "../services/pageLoaderService";
import { CommonUtils } from "../utils/CommonUtils";
import { FxpRouteService } from "../services/FxpRouteService";
import { FxpContext } from "../context/FxpContext";
import { SettingsType } from "../common/SettingsType";
import { Resiliency } from "../resiliency/FxpResiliency";
import { NotificationStore } from "../services/NotificationStore";
import { PersonalizationService } from "../services/PersonalizationService";
import { AuthorNotificationConstant } from "../constants/AuthorNotification.constants";
import { FxpConstants } from "../common/ApplicationConstants";
import { AuthorNotificationRoleGroupHelper } from "../factory/AuthorNotificationRoleGroupHelper";
import { FxpBroadcastedEvents } from "../services/FxpBroadcastedEvents";

/**
     * This is the controller having functionality and data for Author Notifications.
     * @class Fxp.Controllers.AuthorNotificationController
     * @classdesc A controller of FxpApp module
     * @example <caption> 
     *  //To Use AuthorNotificationController
     *  angular.module('FxPApp').controller('AuthorNotificationController', ['AnyDependency', NotificationsController]);
     *  function AuthorNotificationController(AnyDependency){ AnyDependency.doSomething(); }
     */
export class AuthorNotificationController {
	// Private variables.
	private typeAheadValue: string;
	private typeAheadErrorMessage: string;
	private typeAheadHasError: boolean;
	private selectedUsers: any;
	private notificationMessage: string;
	private selectedAudienceType: any;
	private previousAudienceType: any;
	private toState: any;
	private toParams: any;
	private fxpConstants: any;
	private originalRoleGroupDetails: any = [];
	private roleGroupDetails: any = [];
	private isAddButtonEnabled: boolean;
	private isRemoveButtonEnabled: boolean;
	// Constructor.
	constructor(
		$scope: any,
		private $rootScope: any,
		private $uibModal: any,
		private $state: IStateService,
		private $timeout: any,
		private userProfileService: UserProfileService,
		private fxpLoggerService: ILogger,
		private fxpRouteService: FxpRouteService,
		private notificationStore: NotificationStore,
		private fxpMessage: FxpMessageService,
		private fxpConfigurationService: FxpConfigurationService,
		private pageLoaderService: PageLoaderService,
		private authorNotificationConstants: AuthorNotificationConstant,
		private personalizationService: PersonalizationService,
		private authorNotificationRoleGroupHelper: AuthorNotificationRoleGroupHelper,
		$window: angular.IWindowService
	) {
		let pageLoadStartTime = performance.now(),
			self = this,
			pageLoadEndTime,
			pageLoadDuration;
		$scope.anCtrl = self;
		// Initialization.
		self.resetToIntialState();
		// Binding function on state change start.
		$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
			if (self.notificationMessage || self.ifNotificationDataAvailable()) {
				self.toState = toState;
				self.toParams = toParams;
				self.confirmNavigation(event);
			}
		});
		//exit Scenario when browser is closed or  refreshed
		$window.onbeforeunload = function (event) {
			//check if notification message is there or any data is there is roles rolegroup array
			if (self.notificationMessage || self.ifNotificationDataAvailable()) {
				return "";
			}
		}
		self.pageLoaderService.fnHidePageLoader();
		// Logging page load metrics.
		self.fxpConstants = FxpConstants;
		pageLoadEndTime = performance.now();
		pageLoadDuration = pageLoadEndTime - pageLoadStartTime;
		self.fxpLoggerService.logPageLoadMetrics(pageLoadDuration);
	}

	/**
	* A method to reset variables to default state and switch screens based on audience type
	* @method Fxp.Controllers.AuthorNotificationController.resetToIntialState
	* @example <caption> Example to use resetToIntialState</caption>
	* NotificationsController.resetToIntialState()
	*/
	resetToIntialState() {
		var self = this;
		self.selectedUsers = [];
		self.authorNotificationRoleGroupHelper.resetSelectedRolesRoleGroupArray();
		self.notificationMessage = "";
		self.typeAheadValue = "";
		// Remove typeahead error.
		self.typeAheadHasError = false;
		self.typeAheadErrorMessage = "";
		//whenever we cancel or leave the existing audience type setting the audience type to null then 
		if (self.selectedAudienceType == self.previousAudienceType)
			self.selectedAudienceType = null;
		self.previousAudienceType = self.selectedAudienceType;
	}

	/**
	*A method to use Add/Remove Selected Roles Role Group Items. 
	* @method Fxp.Controllers.AuthorNotificationController.selectedRolesRoleGroupItems
	* @param {any} roleGroupItem selected roleGroupItem item
	* @param {any} roleItem selected roleItem item
	* @example <caption> Example to use selectedRolesRoleGroupItems</caption>
	* AuthorNotificationController.selectedRolesRoleGroupItems(roleGroupItem, roleItem)
	*/
	selectedRolesRoleGroupItems(roleGroupItem, roleItem): void {
		let self = this;
		self.isAddButtonEnabled = self.authorNotificationRoleGroupHelper.isRolesRoleGroupAvailableToAdd(roleGroupItem, roleItem);
	}

	/**
	* Fetch all role group to send notification based on drop down selection
	* @method Fxp.Controllers.AuthorNotificationController.getRoleGroupDetails
	* @example <caption> Example to use getRoleGroupDetails</caption>
	* AuthorNotificationController.getRoleGroupDetails()
	*/
	getRoleGroupDetails(): void {
		var self = this;
		//if data is available no need to call api
		if (self.roleGroupDetails.length > 0) {
			self.resetToIntialState();
			return;
		}
		self.pageLoaderService.fnShowPageLoader("Loading...");
		var getRoleGroupDetailsAPIStartTime = performance.now();
		self.personalizationService.getRoleGroupDetails().then(function (response) {
			if (!CommonUtils.isNullOrEmpty(response.data)) {
				//make a copy of original item to reset
				self.originalRoleGroupDetails = angular.copy(response.data);
				self.roleGroupDetails = response.data;
				self.resetToIntialState();
				self.pageLoaderService.fnHidePageLoader();
				var propbag = self.fxpLoggerService.createPropertyBag();
				propbag.addToBag("GetRoleGroupDetailsTime", (performance.now() - getRoleGroupDetailsAPIStartTime).toString());
				self.fxpLoggerService.logEvent("Fxp.Controllers.AuthorNotificationController", "OnSuccessGetRoleGroupDetails", propbag);
			}
		}, function (error) {
			self.pageLoaderService.fnHidePageLoader();
			self.fxpMessage.addMessage(self.$rootScope.fxpUIConstants.UIMessages.GeneralExceptionError.ErrorMessage, FxpConstants.messageType.error);
			//logging in AI
			var propbag = self.fxpLoggerService.createPropertyBag();
			propbag.addToBag(self.fxpConstants.metricConstants.Status, error.status);
			propbag.addToBag(self.fxpConstants.metricConstants.StatusText, error.statusText);
			propbag.addToBag(self.fxpConstants.metricConstants.ErrorUrl, error.config ? error.config.url : '');
			self.fxpLoggerService.logError("Fxp.Controllers.AuthorNotificationController", self.$rootScope.fxpUIConstants.UIMessages.RoleGroupsPersonalisationExceptionError.ErrorMessageTitle, "3452", null, propbag);
		});
	}

	/**
	*A method to use Add selected roles, role groups to recepients list
	* @method Fxp.Controllers.AuthorNotificationController.addRolesRoleGroupNotification
	* @example <caption> Example to use addRolesRoleGroupNotification</caption>
	* AuthorNotificationController.addRolesRoleGroupNotification()
	*/
	addRolesRoleGroupNotification(): void {
		var self = this;
		//common function to add/Remove roles/RoleGroup
		var addBtnClickStartTime = performance.now();
		self.roleGroupDetails = self.authorNotificationRoleGroupHelper.addRemoveRolesRoleGroup(self.roleGroupDetails, "Add");
		console.log("AuthorNotificationRoleGroupAddBtnClickTime", performance.now() - addBtnClickStartTime);
		//reset add button array and flag
		self.isAddButtonEnabled = false;
		self.authorNotificationRoleGroupHelper.selectedRolesforAddButton = [];
		self.changeTabIndexOfUserList("#role-group-master-navigation-list");
	}
	/**
	*A method to use Add selected roles role groups to receipts list
	* @method Fxp.Controllers.AuthorNotificationController.removeRolesRoleGroupNotification
	* @example <caption> Example to use removeRolesRoleGroupNotification</caption>
	* AuthorNotificationController.removeRolesRoleGroupNotification()
	*/
	removeRolesRoleGroupNotification(): void {
		var self = this;
		//common function to add/Remove roles/RoleGroup
		var removeBtnClickStartTime = performance.now();
		self.roleGroupDetails = self.authorNotificationRoleGroupHelper.addRemoveRolesRoleGroup(self.roleGroupDetails, "Remove");
		console.log("AuthorNotificationRoleGroupRemoveBtnClickTime", performance.now() - removeBtnClickStartTime);
		//reset remove button array and flag
		self.isRemoveButtonEnabled = false;
		self.authorNotificationRoleGroupHelper.selectedRolesforRemoveButton = [];
		self.changeTabIndexOfUserList("#default-navigation-container");
	}

	/**
	 *A method to use Select/Unselect from Recepients List
	 * @method Fxp.Controllers.AuthorNotificationController.selectedRoleGroupRecepientsItems
	 * @param {any} roleGroupItem contains role group item
	 * @param {boolean} roleItem contains role item
	 * @example <caption> Example to use selectedRoleGroupRecepientsItems</caption>
	 * AuthorNotificationController. selectedRoleGroupRecepientsItems(roleGroupItem, roleItem)
	 */
	selectedRoleGroupRecepientsItems(roleGroupItem, roleItem): void {
		var self = this;
		self.isRemoveButtonEnabled = self.authorNotificationRoleGroupHelper.isRolesRoleGroupAvailableToRemove(roleGroupItem, roleItem);
	}

	/**
	*A method is used to set the tabindex of first elements of recepients list to 0
	* @method Fxp.Controllers.AuthorNotificationController.changeTabIndexOfUserList
	* @param {string} containerId contains id of an element
	* AuthorNotificationController.changeTabIndexOfUserList()
	*/
	changeTabIndexOfUserList(containerId): void {
		var allMenuElements = $(containerId).find(".fxpTabbableElem");
		if (allMenuElements.length > 0) {
			$(allMenuElements[0]).attr('tabindex', 0);
		}
	}
	/**
	*A method to use Enable/Disable the Parent Link in roles Role group list based on items in recepients list
	* @method Fxp.Controllers.AuthorNotificationController.isRolesInReciepientList
	* @param {any} roleGroupItem object whichj we are going to dispaly in UI
	* @example <caption> Example to use isRolesInReciepientList</caption>
	* AuthorNotificationController.isRolesInReciepientList(roleGroupItem)
	*/
	isRolesInReciepientList(roleGroupItem): boolean {
		//check if all child item of parent is added to recepients list
		var self = this;
		return self.authorNotificationRoleGroupHelper.isRolesInReciepientList(roleGroupItem);

	}
	/**
	*A method to use reset focus of selected item  
	* @method Fxp.Controllers.AuthorNotificationController.pullFocusToElement
	* @param {string} element which element to focus
	* @param {any} notifyItem object which we are going to dispaly in UI
	* @param {string} itemType is master or role/Rolegroup
	* @example <caption> Example to use pullFocusToElement</caption>
	* AuthorNotificationController.pullFocusToElement(element,notifyItem)
	*/
	pullFocusToElement(element, roleGroupItem, itemType): void {
		if (itemType.toLowerCase() === "recipients" && roleGroupItem.isFocusedElement) {
			CommonUtils.pullFocusToElement(element);
			roleGroupItem.isFocusedElement = false;
		} else if (itemType.toLowerCase() === "rolegrouplist" && roleGroupItem.isFocused) {
			roleGroupItem.isFocused = false;
		}
	}


	/**
	* A method to search users.
	* @method Fxp.Controllers.AuthorNotificationController.searchUser
	* @param {string} value is a name/id to be serched for.
	* @example <caption> Example to use searchUser</caption>
	* AuthorNotificationController.searchUser("abc")
	*/
	searchUser(value: string) {
		let startTime = performance.now(),
			self = this,
			propbag = self.fxpLoggerService.createPropertyBag();
		// Calling service to search for users.
		return self.userProfileService.searchProfile(value)
			.then((data) => {
				var usersList = [];
				// Checking if service has returned data.
				if (data.data && data.data.length > 0) {
					// Remove error.
					self.typeAheadHasError = false;
					self.typeAheadErrorMessage = "";
					// Assign data.
					usersList = data.data;
				}
				else {
					// Show error if no data is returned.
					self.typeAheadHasError = true;
					self.typeAheadErrorMessage = self.$rootScope.fxpUIConstants.UIMessages.AuthorNotificationProfileMissing.ErrorMessage;
				}
				// Logging info.
				propbag.addToBag("Total Time", (performance.now() - startTime).toString());
				self.fxpLoggerService.logEvent("Fxp.Controllers.AuthorNotificationController", "SearchUser", propbag);
				return usersList;
			}, (err) => {
				self.typeAheadHasError = true;
				// Check if user profile didn't exist.
				if (err.data.ErrorCode == 112) {
					// Show error.
					self.typeAheadErrorMessage = self.$rootScope.fxpUIConstants.UIMessages.AuthorNotificationProfileMissing.ErrorMessage;
					// Logging info.
					propbag.addToBag("Total Time", (performance.now() - startTime).toString());
					self.fxpLoggerService.logEvent("Fxp.Controllers.AuthorNotificationController", "SearchUser", propbag);
				}
				else {
					// Show error.
					self.typeAheadErrorMessage = self.$rootScope.fxpUIConstants.UIMessages.AuthorNotificationProfileServiceError.ErrorMessage;
					// Log error.
					self.fxpLoggerService.logError("Fxp.Controllers.AuthorNotificationController", self.$rootScope.fxpUIConstants.UIMessages.AuthorNotificationProfileServiceError.ErrorMessageTitle, "3450", null);
				}
			});
	}

	/**
	* A method to add users to list.
	* @method Fxp.Controllers.AuthorNotificationController.addUser
	* @param {any} user is a object containeing user info.
	* @example <caption> Example to use addUser</caption>
	* AuthorNotificationController.addUser({})
	*/
	addUser(user: any) {
		let self = this,
			// Check if user is already added.
			userExist = self.selectedUsers.some(function (item) {
				return item.EmailName.toLowerCase() == user.EmailName.toLowerCase();
			});
		// If user is not added, add user.
		if (!userExist) {
			self.selectedUsers.push(user);
		}
		// Make type ahead empty.
		self.typeAheadValue = "";
	}

	/**
	* A method to add users to list.
	* @method Fxp.Controllers.AuthorNotificationController.removeUser
	* @param {number} index of user to be removed.
	* @example <caption> Example to use removeUser</caption>
	* AuthorNotificationController.removeUser({})
	*/
	removeUser(index: number) {
		let self = this;
		// Remove user.
		self.selectedUsers.splice(index, 1);
	}

	/**
	* A method confirm whether to navigate from page or not.
	* @method Fxp.Controllers.AuthorNotificationController.confirmNavigation
	* @param {any} event is event data.
	* @example <caption> Example to use confirmNavigation</caption>
	* AuthorNotificationController.confirmNavigation("abc")
	*/
	confirmNavigation(event) {
		let self = this,
			options = AuthorNotificationConstant.ConfirmationOptions;
		// Check for changes.
		if (self.notificationMessage || self.ifNotificationDataAvailable()) {
			// Check if event is there then stop it.
			if (event)
				event.preventDefault();
			// Show popup.
			let modalInstance = self.$uibModal.open(options);
			// Bind methods to popup.
			modalInstance.result.then(() => {
				self.stayInAuthorNotification();
			}, () => {
				self.leaveAuthorNotification();
			});
		} else {
			//sceen is switched based on audience type i.e either users or roleGroup
			if (self.selectedAudienceType && self.selectedAudienceType.Type == "Role")
				self.getRoleGroupDetails();
			// Reset to default.
			else
				self.resetToIntialState();
		}
	}

	/**
	* A method to leave/reset page.
	* @method Fxp.Controllers.AuthorNotificationController.leaveAuthorNotification
	* @example <caption> Example to use leaveAuthorNotification</caption>
	* AuthorNotificationController.leaveAuthorNotification()
	*/
	leaveAuthorNotification() {
		let self = this;
		// Reset.
		self.resetToIntialState();
		self.roleGroupDetails = angular.copy(self.originalRoleGroupDetails);
		// Check if navigation is needed.
		if (self.toState && self.toParams) {
			// Navigate.
			self.fxpRouteService.navigatetoSpecificState(self.toState.name, self.toParams);
		}
	}

	/**
	* A method to stay in page.
	* @method Fxp.Controllers.AuthorNotificationController.stayInAuthorNotification
	* @example <caption> Example to use stayInAuthorNotification</caption>
	* AuthorNotificationController.stayInAuthorNotification()
	*/
	stayInAuthorNotification() {
		let self = this;
		// Reset state variables.
		self.toState = null;
		self.toParams = null;
		// Reset Audience type.
		self.selectedAudienceType = self.previousAudienceType;
		self.$rootScope.$broadcast(FxpBroadcastedEvents.OnLeftNavHighlightByStateName, self.$state.current.name);
	}

	/**
	* A method to publish notification.
	* @method Fxp.Controllers.AuthorNotificationController.publishNotification
	* @example <caption> Example to use publishNotification</caption>
	* AuthorNotificationController.publishNotification()
	*/
	publishNotification() {
		this.pageLoaderService.fnShowPageLoader("Publishing Notification...");
		let self = this;
		switch (self.selectedAudienceType.Type) {
			case "User":
				self.publishNotificationUsers();
				break;
			case "Role":
				self.publishNotificationRolesRoleGroup();
				break;
		}
	}
	/**
	* A method to publish notification for Users.
	* @method Fxp.Controllers.AuthorNotificationController.publishNotificationUsers
	* @example <caption> Example to use publishNotification</caption>
	* AuthorNotificationController.publishNotificationUsers()
	*/
	publishNotificationUsers(): void {
		let self = this, startTime = performance.now(),
			propbag = self.fxpLoggerService.createPropertyBag(),
			// Comma (,) seperated to list.
			to = self.selectedUsers.map(function (item) { return CommonUtils.generateUPN(item, self.fxpConfigurationService.FxpAppSettings); }).join(),
			// Notification Object.
			notificationArray = [{
				"Status": "UnRead",
				"IsGroup": false,
				"Type": "PullOnly",
				"From": self.fxpConfigurationService.FxpAppSettings.FxPAdminName,
				"To": to,
				"Subject": self.notificationMessage,
				"Content": self.notificationMessage
			}];
		// Calling service to publish notification.
		self.notificationStore.publishNotifications(notificationArray).then((result) => {
			let message = angular.copy(self.notificationMessage);
			self.pageLoaderService.fnHidePageLoader();
			// Reset to initial state.
			self.resetToIntialState();
			// Show success message
			self.$timeout(function () { self.fxpMessage.addMessage(self.$rootScope.fxpUIConstants.UIStrings.AuthorNotificationStrings.SuccessMessage, FxpConstants.messageType.success); });
			// Logging Notification and event info.
			propbag.addToBag("EventId", result.data[0].EventId);
			propbag.addToBag("NotificationMessage", message);
			propbag.addToBag("To", to);
			propbag.addToBag("From", self.fxpConfigurationService.FxpAppSettings.FxPAdminName);
			propbag.addToBag("PublishedUtcDate", result.data[0].PublishedUtcDate);
			propbag.addToBag("PublishNotificationUsersApiTime", (performance.now() - startTime).toString());
			self.fxpLoggerService.logEvent("Fxp.Controllers.AuthorNotificationController", "PublishNotification", propbag);
		}, (error) => {
			self.pageLoaderService.fnHidePageLoader();
			// Show error.
			self.fxpMessage.addMessage(self.$rootScope.fxpUIConstants.UIMessages.AuthorNotificationPublishServiceError.ErrorMessage, FxpConstants.messageType.error);
			// Log error.
			self.fxpLoggerService.logError("Fxp.Controllers.AuthorNotificationController", self.$rootScope.fxpUIConstants.UIMessages.AuthorNotificationPublishServiceError.ErrorMessageTitle, "3451", null);
		});
	}

	/**
	* A method to publish notification for Roles and Role Groups.
	* @method Fxp.Controllers.AuthorNotificationController.publishNotificationRolesRoleGroup
	* @example <caption> Example to use publishNotification</caption>
	* AuthorNotificationController.publishNotificationRolesRoleGroup()
	*/
	publishNotificationRolesRoleGroup(): void {
		var self = this, startTime = performance.now(),
			propbag = self.fxpLoggerService.createPropertyBag();
		if (self.ifSelectedRolesRoleGroup()) {
			//notificationArray which consist id of Roles and RoleGroups and message
			var notificationArray = { RoleGroupIdList: [], RoleIdList: [], Message: "" };
			//extract only role group IDs
			notificationArray.RoleGroupIdList = self.authorNotificationRoleGroupHelper.selectedRoleGroups.map(function (item) {
				return item.RoleGroupId;
			});
			//extract only role IDs
			notificationArray.RoleIdList = self.authorNotificationRoleGroupHelper.selectedRoles.map(function (item) {
				return item.BusinessRoleId;
			});
			notificationArray.Message = self.notificationMessage;
			console.log("PublishNotificationRolesRoleGroupObj", notificationArray);
			self.notificationStore.publishNotificationsRolesRoleGroup(notificationArray).then((result) => {
				self.pageLoaderService.fnHidePageLoader();
				self.resetToIntialState();
				//reset collection
				self.roleGroupDetails = angular.copy(self.originalRoleGroupDetails);
				//using timeout to send focus back to drop down after success message is displayed
				self.$timeout(function () { self.fxpMessage.addMessage(self.$rootScope.fxpUIConstants.UIStrings.AuthorNotificationStrings.SuccessMessage, FxpConstants.messageType.success); });
				//logging time and usage of publish button 
				console.log("PublishNotificationRolesRoleGroupTime", (performance.now() - startTime).toString());
				propbag.addToBag("PublishNotificationRolesRoleGroupTime", (performance.now() - startTime).toString());
				propbag.addToBag("NotificationMessage", self.notificationMessage);
				propbag.addToBag("RoleGroupIds", notificationArray.RoleGroupIdList.join(','));
				propbag.addToBag("RoleIds", notificationArray.RoleIdList.join(','));
				self.fxpLoggerService.logEvent("Fxp.Controllers.AuthorNotificationController", "PublishNotificationRolesRoleGroup", propbag);
			}, (error) => {
				// Log error.
				self.pageLoaderService.fnHidePageLoader();
				self.resetToIntialState();
				//reset collection
				self.roleGroupDetails = angular.copy(self.originalRoleGroupDetails);
				propbag.addToBag(self.fxpConstants.metricConstants.Status, error.status ? error.status : "");
				propbag.addToBag(self.fxpConstants.metricConstants.StatusText, error.statusText ? error.statusText : "");
				propbag.addToBag(self.fxpConstants.metricConstants.ErrorUrl, error.config ? (error.config.url ? error.config.url : "") : "");
				if (error.status && error.status == 500)
					propbag.addToBag(self.fxpConstants.metricConstants.ErrorText, error.data ? error.data : "");
				var uiErrorMessage = error.status == 403 ? self.$rootScope.fxpUIConstants.UIMessages.AuthorNotificationPublishUnauthorizedError.ErrorMessage :
					self.$rootScope.fxpUIConstants.UIMessages.AuthorNotificationPublishRoleGroupServiceError.ErrorMessage;
				self.fxpMessage.addMessage(uiErrorMessage, FxpConstants.messageType.error);
				self.fxpLoggerService.logError("Fxp.Controllers.AuthorNotificationController", self.$rootScope.fxpUIConstants.UIMessages.AuthorNotificationPublishRoleGroupServiceError.ErrorMessageTitle, "3453", error.stack ? error.stack : null, propbag);
			});
		}
	}


	/**
	* A method to see if the roles and roleGroup arrays are empty or not.
	* @method Fxp.Controllers.AuthorNotificationController.ifSelectedRolesRoleGroup
	* AuthorNotificationController.ifSelectedRolesRoleGroup()
	*/
	ifSelectedRolesRoleGroup(): boolean {
		var self = this
		if (!CommonUtils.isNullOrEmpty(self.authorNotificationRoleGroupHelper.selectedRoleGroups) || !CommonUtils.isNullOrEmpty(self.authorNotificationRoleGroupHelper.selectedRoles))
			return true;
		else
			return false;
	}

	/**
	* A method to see if the notification message,userslist, roles and roleGroup arrays are empty or not.
	* @method Fxp.Controllers.AuthorNotificationController.ifNotificationDataAvailable
	* AuthorNotificationController.ifNotificationDataAvailable()
	*/
	ifNotificationDataAvailable(): boolean {
		var self = this
		if (self.selectedUsers.length || self.ifSelectedRolesRoleGroup())
			return true;
		else
			return false;
	}
}

/**
 * This is the controller having functionality and data for Author Notifications Confirmation popup.
 * @class Fxp.Controllers.AuthorNotificationConfirmationController
 * @classdesc A controller of FxpApp module
 * @example <caption> 
 *  //To Use AuthorNotificationConfirmationController
 *  angular.module('FxPApp').controller('AuthorNotificationConfirmationController', ['AnyDependency', AuthorNotificationConfirmationController]);
 *  function AuthorNotificationConfirmationController(AnyDependency){ AnyDependency.doSomething(); }
 */
export class AuthorNotificationConfirmationController {
	constructor(private $uibModalInstance: any) { }
	leave() {
		this.$uibModalInstance.dismiss();
	}
	stay() {
		this.$uibModalInstance.close();
	}
}