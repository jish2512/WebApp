declare type IStateService = any;

import { IActOnBehalfOfControllerScope } from "../interfaces/IActOnBehalfOfControllerScope";
import { ILogger } from "../interfaces/ILogger";
import { FxpMessageService } from "../services/FxpMessageService";
import { FxpConstants, ApplicationConstants } from "../common/ApplicationConstants";
import { IRootScope } from "../interfaces/IRootScope";
import { UserProfileService } from "../services/userProfileService";
import { LogPropertyBag } from "../telemetry/LogPropertyBag";
import { TelemetryContext } from "../telemetry/telemetrycontext";
import { FxpConfigurationService } from "../services/FxpConfiguration";
import { PageLoaderService } from "../services/pageLoaderService";
import { CommonUtils } from "../utils/CommonUtils";
import { ActOnBehalfOfHelper } from "../factory/ActOnBehalfOfHelper";
import { ILeftNavControllerScope } from "../interfaces/ILeftNavControllerScope";
import { FxpRouteService } from "../services/FxpRouteService";
import { AdminLandingService } from "../services/AdminLandingService";
import { SettingsServiceProvider } from "../provider/SettingsServiceProvider";
import { FxpContext } from "../context/FxpContext";
import { IUserLookupPersonalizationControllerScope } from "../interfaces/IUserLeftNavPersonalizationControllerScope";
import { PersonalizationService } from "../services/PersonalizationService";
import { ControllerName, EventName } from "../telemetry/TelemetryConst";

export class UserLookupPersonalizationController {
	private $state: IStateService;
	private $rootScope: IRootScope;
	private $scope: IUserLookupPersonalizationControllerScope;
	private userProfileService: UserProfileService;
	private fxpLoggerService: ILogger;
	private fxpConstants: FxpConstants;
	private AdminPersonalizeHelper: ActOnBehalfOfHelper;
	private currentDate: Date;
	private fxpConfigurationService: FxpConfigurationService;
	private pageLoaderService: PageLoaderService;
	private personalizationService: PersonalizationService;
	constructor($state: IStateService, $rootScope: IRootScope, $scope: IUserLookupPersonalizationControllerScope,
		userProfileService: UserProfileService,
		fxpLoggerService: ILogger, AdminPersonalizeHelper: ActOnBehalfOfHelper, pageLoaderService: PageLoaderService, personalizationService: PersonalizationService) {
		var pageLoadStartTime = performance.now();
		this.$state = $state;
		this.$rootScope = $rootScope;
		this.$scope = $scope;
		this.userProfileService = userProfileService;
		this.fxpLoggerService = fxpLoggerService;
		this.fxpConstants = FxpConstants;
		this.AdminPersonalizeHelper = AdminPersonalizeHelper;
		this.pageLoaderService = pageLoaderService;
		//Initializes value
		this.$scope.adminUIStrings = this.$rootScope.fxpUIConstants.UIStrings.AdminUIStrings;
		this.$scope.buttonStrings = this.$rootScope.fxpUIConstants.UIStrings.ButtonStrings;
		this.$scope.userProfileDoesNotExist = false;
		this.$scope.errorMessage = "";
		this.$scope.selectedUser = "";
		this.$scope.searchfocused = true;
		this.$scope.resetfocused = false;
		this.$scope.isSelectedUserProfile = false;
		this.$scope.selectedUserObject = {};
		this.$scope.searchUser = this.searchUser.bind(this);
		this.$scope.setSelectedUser = this.setSelectedUser.bind(this);
		this.$scope.pullFocusToElement = CommonUtils.pullFocusToElement.bind(this);
		this.$scope.resetSelectedUser = this.resetSelectedUser.bind(this);
		this.$scope.navigateToPersonalizationView = this.navigateToPersonalizationView.bind(this);
		this.$scope.onUserChanged = this.onUserChanged.bind(this);
		this.pageLoaderService.fnHidePageLoader();
		this.personalizationService = personalizationService;
		var pageLoadEndTime = performance.now();
		var pageLoadDuration = pageLoadEndTime - pageLoadStartTime;
		this.fxpLoggerService.logPageLoadMetrics(pageLoadDuration);
	}
	/**
	* A method to use reset SelectedUser
	* @method Fxp.Controllers.UserLookupPersonalizationController.resetSelectedUser
	* @example <caption> Example to use isItemAllowToRemove</caption>
	* UserLookupPersonalizationController.resetSelectedUser()
	*/
	resetSelectedUser(): void {
		var self = this;
		self.fxpLoggerService.logEvent(ControllerName.USERLOOKUPPERSONALIZATIONCONTROLLER, "AdminResetClickEvent");
		self.$scope.selectedUser = "";
		self.$scope.userProfileDoesNotExist = false;
		self.$scope.isSelectedUserProfile = false;
		setTimeout(function () { CommonUtils.pullFocusToElement('PersnlztnAdmin_FormControl') }, 100);
	}

	/**
	* A method to use searchUser for persanalization
	* @method Fxp.Controllers.UserLookupPersonalizationController.searchUser
	* @example <caption> Example to use searchUser</caption>
	* UserLookupPersonalizationController.searchUser(value)
	*/
	searchUser(value: string) {
		var self = this;
		var rootScope = self.$rootScope;
		var startDate = new Date();
		return self.userProfileService.searchProfile(value, undefined)
			.then(function (data) {
				self.fxpLoggerService.logInformation(ControllerName.USERLOOKUPPERSONALIZATIONCONTROLLER, EventName.USERPROFILESUCCESS);
				var usersList = [];
				var endDate = new Date();
				if (data.data && data.data.length > 0) {
					self.$scope.userProfileDoesNotExist = false;
					self.$scope.errorMessage = "";
					usersList = data.data;
				}
				else {
					self.$scope.userProfileDoesNotExist = true;
					self.$scope.selectedUserObject = {};
					self.$scope.errorMessage = self.$rootScope.fxpUIConstants.UIMessages.UserProfileDoesNotExist.ErrorMessage;
				}
				var responseTime = endDate.getTime() - startDate.getTime();
				var propbag = self.AdminPersonalizeHelper.getMetricPropBag(startDate, endDate);
				self.fxpLoggerService.logMetric(FxpConstants.metricConstants.SearchProfileService, "searchProfileResponseTime", responseTime, propbag);
				return usersList;
			})
			.catch(function (error) {
				if (error.status === 404) {
					self.$scope.errorMessage = self.$rootScope.fxpUIConstants.UIMessages.UserProfileDoesNotExist.ErrorMessage;
				} else {
					self.$scope.errorMessage = self.$rootScope.fxpUIConstants.UIMessages.GeneralExceptionError.ErrorMessage;
				}
				self.$scope.selectedUserObject = {};
				var endDate = new Date();
				var propbag = self.fxpLoggerService.createPropertyBag();
				propbag.addToBag("SearchUser", self.$scope.selectedUser);
				self.fxpLoggerService.logError(ControllerName.USERLOOKUPPERSONALIZATIONCONTROLLER, self.$scope.errorMessage, null, null);
				var responseTime = endDate.getTime() - startDate.getTime();
				var propbag = self.AdminPersonalizeHelper.getMetricPropBag(startDate, endDate);
				self.fxpLoggerService.logMetric(FxpConstants.metricConstants.SearchProfileService, "searchProfileResponseTime - Error", responseTime, propbag);
			});
	}
	/**
	* A method to use SelectedUser
	* @method Fxp.Controllers.UserLookupPersonalizationController.setSelectedUser
	* @example <caption> Example to use setSelectedUser</caption>
	* UserLookupPersonalizationController.setSelectedUser(value)
	*/
	setSelectedUser($item) {
		var self = this;
		if (!CommonUtils.isNullOrEmpty($item)) {
			let isBusinessRoleIdFlag = $item.BusinessRoleId != undefined && $item.BusinessRoleId != null && $item.BusinessRoleId > 0
			let isRoleGroupIdFlag = $item.RoleGroupID != undefined && $item.RoleGroupID != null && $item.RoleGroupID > 0
			if (isBusinessRoleIdFlag && isRoleGroupIdFlag) {
				self.$scope.selectedUserObject = $item;
				self.$scope.isSelectedUserProfile = true;
			} else {
				self.$scope.userProfileDoesNotExist = true;
				self.$scope.isSelectedUserProfile = false;
				self.$scope.selectedUserObject = {};
				self.$scope.errorMessage = self.$rootScope.fxpUIConstants.UIMessages.UserProfileBusinessRoleIdErrorMessage.ErrorMessage;
				self.fxpLoggerService.logError(ControllerName.USERLOOKUPPERSONALIZATIONCONTROLLER, self.$scope.errorMessage, null, null);
			}
		}
	}

	/**
	* A method to use navigate To Personalization View
	* @method Fxp.Controllers.UserLookupPersonalizationController.navigateToPersonalizationView
	* @example <caption> Example to use navigateToPersonalizationView</caption>
	* UserLookupPersonalizationController.navigateToPersonalizationView()
	*/
	navigateToPersonalizationView(): void {
		var self = this;
		if (!CommonUtils.isNullOrEmpty(self.$scope.selectedUserObject)) {
			self.personalizationService.getRoleGroup(self.$scope.selectedUserObject.RoleGroupID).then(function (response) {
				self.fxpLoggerService.logInformation(ControllerName.USERLOOKUPPERSONALIZATIONCONTROLLER, EventName.NAVIGATETOPERSONALIZATIONVIEWSUCCESS);
				if (!CommonUtils.isNullOrEmpty(response.data)) {
					self.$scope.selectedUserObject.RoleGroupID = response.data.Id;
				}
				self.personalizationService.removePersistedUserPersonalization();
				self.personalizationService.persistUserPersonalization(self.$scope.selectedUserObject);
				self.$state.go("LeftNavPersonalization");
			}, function (error) {
				self.fxpLoggerService.logError(ControllerName.USERLOOKUPPERSONALIZATIONCONTROLLER, error.message, null, null);
			});
		}
	}

	/**
	*A method to use to change the Selected User
	* @method Fxp.Controllers.UserLookupPersonalizationController.onUserChanged
	* @example <caption> Example to use onUserChanged</caption>
	* UserLookupPersonalizationController.onUserChanged()
	*/
	onUserChanged(): void {
		var self = this;
		self.$scope.isSelectedUserProfile = false;
		self.$scope.userProfileDoesNotExist = false;
	}
}

UserLookupPersonalizationController.$inject = ['$state', '$rootScope', '$scope', 'UserProfileService', 'FxpLoggerService', 'ActOnBehalfOfHelper', 'PageLoaderService', 'PersonalizationService'];