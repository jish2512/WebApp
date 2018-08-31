
declare type IStateService = any;
import { IActOnBehalfOfControllerScope } from "../interfaces/IActOnBehalfOfControllerScope";
import { ILogger } from "../interfaces/ILogger";
import { FxpMessageService } from "../services/FxpMessageService";
import { FxpConstants } from "../common/ApplicationConstants";
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
import { FxpBroadcastedEvents } from "../services/FxpBroadcastedEvents";

export class ActOnBehalfOfController {
	private $state: IStateService;
	private $rootScope: IRootScope;
	private $scope: IActOnBehalfOfControllerScope;
	private userProfileService: UserProfileService;
	private userInfoService: UserInfoService;
	private adalAuthenticationService: adal.AdalAuthenticationService;
	private fxpLoggerService: ILogger;
	private fxpMessage: FxpMessageService;
	private ActOnBehalfOfHelper: ActOnBehalfOfHelper;
	private OBOUserService: OBOUserService;
	private fxpContext: IFxpContext;
	private fxpErrorConstants: any;;
	private loggedInUser: string;
	private oboMetric: LogPropertyBag;
	private currentDate: Date;
	private fxpTelemetryContext: TelemetryContext;
	private fxpConfigurationService: FxpConfigurationService;
	private pageLoaderService: PageLoaderService;
	private dashboardService: DashboardService;

	constructor($state: IStateService, $rootScope: IRootScope, $scope: IActOnBehalfOfControllerScope,
		userProfileService: UserProfileService, userInfoService: UserInfoService, adalAuthenticationService: adal.AdalAuthenticationService,
		fxpLoggerService: ILogger, fxpMessage: FxpMessageService, ActOnBehalfOfHelper: ActOnBehalfOfHelper,
		OBOUserService: OBOUserService, fxpContext: IFxpContext, fxpTelemetryContext: TelemetryContext, fxpConfigurationService: FxpConfigurationService,
		pageLoaderService: PageLoaderService, dashboardService: DashboardService) {
		var pageLoadStartTime = performance.now();
		this.$state = $state;
		this.$rootScope = $rootScope;
		this.$scope = $scope;
		this.userProfileService = userProfileService;
		this.userInfoService = userInfoService;
		this.adalAuthenticationService = adalAuthenticationService;
		this.fxpLoggerService = fxpLoggerService;
		this.fxpMessage = fxpMessage;
		this.ActOnBehalfOfHelper = ActOnBehalfOfHelper;
		this.OBOUserService = OBOUserService;
		this.fxpContext = fxpContext;
		this.fxpErrorConstants = $rootScope.fxpUIConstants.UIMessages;
		this.loggedInUser = userInfoService.getLoggedInUser();
		this.oboMetric = ActOnBehalfOfHelper.getPropBag();
		this.fxpTelemetryContext = fxpTelemetryContext;
		this.fxpConfigurationService = fxpConfigurationService;
		this.pageLoaderService = pageLoaderService;
		this.dashboardService = dashboardService;

		//Initializes value
		this.$scope.footerdata = this.fxpConfigurationService.FxpBaseConfiguration.FxpFooterData;
		this.$scope.oboUIStrings = this.$rootScope.fxpUIConstants.UIStrings.OBOUIStrings;

		this.$scope.displayErrorMessage = false;
		this.$scope.searchUsersList = [];
		this.$scope.errorMessage = "";
		this.$scope.selectedUser = "";
		this.$scope.selectedUserObject = {};
		this.$scope.isValidUserSelected = false;
		this.$scope.showViewFullProfileLink = window["tenantConfiguration"].ShowFullProfile;
		this.$scope.profileStateName = window["tenantConfiguration"].ViewProfileUrl;

		this.$scope.reset = this.reset.bind(this);
		this.$scope.handleEnterKeyOnSearchUserInput = this.handleEnterKeyOnSearchUserInput.bind(this);
		this.$scope.actOnBehalfOfUserClick = this.actOnBehalfOfUserClick.bind(this);
		this.$scope.OBOAdminstratorClick = this.OBOAdminstratorClick.bind(this);
		this.$scope.searchUser = this.searchUser.bind(this);
		this.$scope.onSelect = this.onSelect.bind(this);
		this.$scope.createProfile = this.createProfile.bind(this);
		this.$scope.pullFocusToElement = CommonUtils.pullFocusToElement.bind(this);

		if ($rootScope.actOnBehalfOfUserActive) {
			var msg = this.fxpErrorConstants.OBOUserActive.ErrorMessage
			msg = msg.replace("OBOusername", this.OBOUserService.getOBOUser().fullName);

			this.fxpMessage.addMessage(msg, FxpConstants.messageType.error);
			this.fxpLoggerService.logError("Fxp.Client.ActonBefofUser", this.fxpErrorConstants.OBOUserActive.ErrorMessage, "2907", null);
		}
		var pageLoadEndTime = performance.now();
		var pageLoadDuration = pageLoadEndTime - pageLoadStartTime;
		this.fxpLoggerService.logPageLoadMetrics(pageLoadDuration);
	}

	reset() {
		var self = this;
		var propBag = self.ActOnBehalfOfHelper.getPropBag();
		self.fxpLoggerService.logEvent('Fxp.actOnBehalfofuser', "OBOResetClickEvent", propBag);
		self.$scope.selectedUser = "";
		self.$scope.displayErrorMessage = false;
		self.$scope.userProfileDoesNotExist = false;
		self.$scope.isValidUserSelected = false;
		self.$scope.selectedUserObject = {};
		/*using tab and Enter using Enter Key on reset Button shifting focusing to Type ahead Search Box. */
		var oboFormControl = $("#OBO_FormControl");
		if (!CommonUtils.isNullOrEmpty(oboFormControl)) {
			oboFormControl.focus();
		}
	}

	actOnBehalfOfUserClick() {
		var self = this;
		if (self.$scope.userProfileDoesNotExist == false) {
			self.fxpLoggerService.logTrace('Fxp.actOnBehalfofuser', "actOnBehalfofuser(alias) Started");
			var propbag = self.fxpLoggerService.createPropertyBag();
			try {
				var selectedUser = self.$scope.selectedUserObject;
				if (selectedUser) {
					if (selectedUser.Alias != self.loggedInUser) {
						if (selectedUser.RoleGroupID > 0) {
							self.pageLoaderService.fnShowPageLoader("Loading");
							return self.ActOnBehalfOfHelper.getUserProfileAndClaims(selectedUser).then(function (selectedUserData) {
								var userClaims = JSON.parse(sessionStorage[FxpConstants.CONST.fxpUserClaimsSession + "_" + selectedUserData.alias]);

								if (userClaims == undefined || (userClaims.Applications != undefined && Object.keys(userClaims.Applications).length <= 0)) {
									self.fxpMessage.addMessage(self.fxpErrorConstants.SelectedProfileRoles.ErrorMessage, FxpConstants.messageType.error);
									self.userProfileService.setCurrentUser(self.loggedInUser);
									self.pageLoaderService.fnHidePageLoader();
									sessionStorage.removeItem(FxpConstants.CONST.fxpUserClaimsSession + "_" + selectedUserData.alias);

									return;
								}

								var OBOUser = {
									"fullName": selectedUserData.fullName,
									"displayName": selectedUserData.DisplayName,
									"alias": selectedUserData.alias,
									"href": self.$scope.profileStateName + "/" + selectedUserData.alias + "/basic",
									"businessRoleId": selectedUserData.businessRoleId,
									"businessRole": selectedUserData.businessRole,
									"roleGroupId": selectedUserData.roleGroupId,
									"roleGroupName": selectedUserData.roleGroupName,
									"defaultAppRole":userClaims.defaultAppRole
								};

								self.ActOnBehalfOfHelper.getObOUserConfiguration(userClaims.defaultAppRole).then(function success(response) {
									var onbehalfUserRoutes = response.data.UiConfiguration;
									var oboUserSessionInfo = sessionStorage[CommonUtils.getSessionStorageUserInfoKey(OBOUser.alias)]; 
									var OBOEntity = {
										"OBOUserStatus": true,
										"OBOUserRoutes": onbehalfUserRoutes,
										"OBOUser": OBOUser,
										"OBOUserSessionInfo": oboUserSessionInfo
									}
									self.OBOUserService.saveOBOEntityInContext(OBOEntity);
									self.$scope.OBOUser = OBOUser;
									//Telemetry                                        
									self.fxpTelemetryContext.addToGlobalPropertyBag(FxpConstants.OBOConstants.ActonBehalfMode, "true");
									self.fxpTelemetryContext.addToGlobalPropertyBag(FxpConstants.OBOConstants.OnBehalfOfUserUpn, userClaims.Upn);
									self.fxpTelemetryContext.addToGlobalPropertyBag(FxpConstants.OBOConstants.OnBehalfOfUserBusinessRole, selectedUserData.businessRole);
									self.fxpTelemetryContext.addToGlobalPropertyBag(FxpConstants.OBOConstants.OnBehalfOfUserRoleGroup, selectedUserData.roleGroupName);
									var oboStartTime = new Date().getTime().toString();
									localStorage.setItem(FxpConstants.OBOConstants.ActonBehalfofAdminStartTime.toString(), oboStartTime);
									propbag.addToBag(FxpConstants.OBOConstants.ActonBehalfofAdminStartTime, oboStartTime);
									self.pageLoaderService.fnHidePageLoader();
									self.fxpLoggerService.logEvent("Fxp.actOnBehalfOfUserClick", "AdminOnBehalfOfStart", propbag);
									self.fxpLoggerService.logTrace('Fxp.actOnBehalfofuser', "actOnBehalfofuserclick End");
									//if obo user fxp configuration is loaded then broadcast the UserContextChanged
									self.$rootScope.$broadcast(FxpBroadcastedEvents.OnUserContextChanged, OBOUser.alias, OBOUser.roleGroupId, OBOUser.businessRoleId);
									self.$rootScope.fxpBreadcrumb = [];
								}, function errorCallback(response) {
									propbag.addToBag("Error", response);
									self.pageLoaderService.fnHidePageLoader();
									self.OBOUserService.removeOBOUserContext();
									self.userProfileService.setCurrentUser(self.loggedInUser);
									self.fxpMessage.addMessage(self.fxpErrorConstants.OBOUserUIConfigurationError.ErrorMessage, FxpConstants.messageType.error);
									self.fxpLoggerService.logError("FXP.Client.ActOnBehalfofuser", self.fxpErrorConstants.OBOUserUIConfigurationError.ErrorMessage, "2906", null, propbag);
									self.$rootScope.$broadcast(FxpBroadcastedEvents.OnUserContextChanged, self.userInfoService.getLoggedInUser(), self.userInfoService.getCurrentUserData().roleGroupId, self.userInfoService.getCurrentUserData().businessRoleId);
								});

							}).catch(function (err) {
								self.userProfileService.setCurrentUser(self.loggedInUser);
								self.pageLoaderService.fnHidePageLoader();
							});
						}
						else {
							self.userProfileService.setCurrentUser(self.loggedInUser);
							self.fxpMessage.addMessage(self.fxpErrorConstants.UserProfileBusinessRoleFailureError.ErrorMessage, FxpConstants.messageType.error);
							self.fxpLoggerService.logWarning("FXP.Client.ActOnBehalfofuser", self.fxpErrorConstants.UserProfileBusinessRoleFailureError.ErrorMessage);
						}
					}
					else {
						self.$scope.errorMessage = self.$rootScope.fxpUIConstants.UIStrings.SelectedUserisCurrentLoggedInUserError;
						self.$scope.displayErrorMessage = true;
					}
				}
				else {
					//fxpMessage.addMessage(fxpErrorConstants.UIMessages.ProfileSelectError.ErrorMessage, fxpConstants.messageType.error);
					self.$scope.userProfileDoesNotExist = true;
					self.$scope.errorMessage = self.$rootScope.fxpUIConstants.UIStrings.ProfileNotFound;
				}
			}
			catch (ex) {
				self.pageLoaderService.fnHidePageLoader();
				self.fxpMessage.addMessage(self.fxpErrorConstants.GeneralExceptionError.ErrorMessage, FxpConstants.messageType.error);
				self.userProfileService.setCurrentUser(self.loggedInUser);
			}
		}
	}

	OBOAdminstratorClick() {
		var self = this;
		//Reset and move to landing page           
		self.OBOUserService.removeOBOUserContext();
		self.$rootScope.navigateToLandingPage();
	}

	searchUser(value: string) {
		var self = this;
		var rootScope = self.$rootScope;
		var startDate = new Date();
		return self.userProfileService.searchProfile(value, undefined)
			.then((data) => {
				var usersList = [];
				var endDate = new Date();
				if (data.data && data.data.length > 0) {
					self.$scope.displayErrorMessage = false;
					self.$scope.errorMessage = "";
					usersList = data.data;
				}
				else {
					self.$scope.displayErrorMessage = false;
					self.$scope.selectedUserObject = {};
					self.$scope.errorMessage = rootScope.fxpUIConstants.UIStrings.ProfileNotFound;
				}
				var responseTime = endDate.getTime() - startDate.getTime();
				var propbag = self.ActOnBehalfOfHelper.getMetricPropBag(startDate, endDate);
				self.fxpLoggerService.logMetric(FxpConstants.metricConstants.SearchProfileService, "searchProfileResponseTime", responseTime, propbag);
				return usersList;
			}, (err) => {
				self.$scope.selectedUserObject = {};
				var endDate = new Date();
				if (err.data.ErrorCode == 112) {
					self.$scope.errorMessage = rootScope.fxpUIConstants.UIStrings.ProfileNotFound;
					var propbag = self.fxpLoggerService.createPropertyBag();
					propbag.addToBag("SearchUser", self.$scope.selectedUser);

					self.fxpLoggerService.logInformation("Fxp.ActonBehalfController", rootScope.fxpUIConstants.UIMessages.SearchProfileSvcReturnsError.ErrorMessage, propbag);
				}
				else {
					self.$scope.errorMessage = rootScope.fxpUIConstants.UIStrings.ErrorRetrieving;
					self.fxpLoggerService.logError("Fxp.ActonBehalfController", rootScope.fxpUIConstants.UIMessages.SearchProfileSvcNotWorkingError.ErrorMessage, "2602", null);
				}

				var responseTime = endDate.getTime() - startDate.getTime();
				var propbag = self.ActOnBehalfOfHelper.getMetricPropBag(startDate, endDate);
				self.fxpLoggerService.logMetric(FxpConstants.metricConstants.SearchProfileService, "searchProfileResponseTime - Error", responseTime, propbag);
			});
	}

	handleEnterKeyOnSearchUserInput(event: KeyboardEvent) {
		var self = this;
		self.$scope.isValidUserSelected = false;
		if (event.keyCode == 13) {
			if (self.$scope.userProfileDoesNotExist) {
				self.createProfile();
			}
			else {
				self.actOnBehalfOfUserClick();
			}
		}
		else if (event.keyCode == 9 && self.$scope.selectedUserObject.Alias)
			self.$scope.isValidUserSelected = true;
	}

	onSelect($item) {
		var self = this;
		self.$scope.selectedUserObject = $item;
		self.$scope.isValidUserSelected = true;
	}

	createProfile() {
		var self = this;
		var propBag = self.ActOnBehalfOfHelper.getPropBag();
		self.fxpLoggerService.logEvent('Fxp.actOnBehalfofuser', "CreateProfile", propBag);

		var profileStatename = self.$rootScope.fxpUIConstants.UIStrings.CreateProfileStateName
		var profileState = self.$state.get(profileStatename);
		if (profileState) self.$state.go(profileStatename);
		else {
			self.fxpMessage.addMessage(self.fxpErrorConstants.CreateProfileState.ErrorMessage, FxpConstants.messageType.error);
		}
	}
}

ActOnBehalfOfController.$inject = ['$state', '$rootScope', '$scope', 'UserProfileService', 'UserInfoService', 'adalAuthenticationService', 'FxpLoggerService', 'FxpMessageService', 'ActOnBehalfOfHelper',
	'OBOUserService', 'FxpContextService', 'FxpTelemetryContext', 'FxpConfigurationService', 'PageLoaderService', 'DashboardService'];