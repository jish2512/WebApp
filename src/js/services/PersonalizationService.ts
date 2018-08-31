import { IPersonalizationService } from "../interfaces/IPersonalizationService";
import { FxpContext } from "../context/FxpContext";
import { IRootScope } from "../interfaces/IRootScope";
import { FxpConfigurationService } from "./FxpConfiguration";
import { ILogger } from "../interfaces/ILogger";
import { AdalLoginHelperService } from "./AdalLoginHelperService";
import { FxpMessageService } from "./FxpMessageService";
import { FxpConstants, PerfMarkers } from "../common/ApplicationConstants";
import { CommonUtils } from "../utils/CommonUtils";

export class PersonalizationService implements IPersonalizationService {
	private sleepInterval: number;
	private iCount: number = 0;
	private iReqCount: number = 0;
	private iUCount: number = 0;
	private fxpServiceEndPoint: string;
	private oneProfileEndPoint: string;
	private classNamePersonalizationService = "Fxp.PersonalizationService";
	private tenantClaimsApiEndpoint: string;
	private tenantNPD: String;
	constructor(private http: angular.IHttpService,
		private q: angular.IQService,
		private rootScope: IRootScope,
		private fxpConfiguration: FxpConfigurationService,
		private timeout: angular.ITimeoutService,
		private fxplogger: ILogger,
		private adalLoginHelperService: AdalLoginHelperService,
		private fxpMessageSvc: FxpMessageService) {

		this.sleepInterval = 100;
		this.fxpServiceEndPoint = this.fxpConfiguration.FxpAppSettings.FxpServiceEndPoint;
		let profileStore = window["tenantConfiguration"].ProfileStore || {};
		this.oneProfileEndPoint = profileStore.ProfileAPIEndPoint;
		let authStore = window["tenantConfiguration"].AuthStore || {};
		this.tenantClaimsApiEndpoint = authStore.TenantClaimsEndPoint;
		this.tenantNPD = window["tenantConfiguration"].NPD;
	}

	/**
	* A method to Get the Persisted Pesanalization User Informantion
	* @method Fxp.Services.PersonalizationService.getPersistedPersonalization
	* @example <caption> Example to use getPersistedPersonalization</caption>
	* PersonalizationService.getPersistedPersonalization()
	*/
	getPersistedPersonalization(): any {
		let self = this;
		let context = localStorage.getItem("selectedUserPersonalization");
		let keyContext = null;
		if (!CommonUtils.isNullOrEmpty(context)) {
			let data = JSON.parse(context);
			keyContext = data.user;
		}
		return keyContext;

	}
	/**
   * A method to Persisted   Pesanalization for selected User
   * @method Fxp.Services.PersonalizationService.getPersistedPersonalization
   * @example <caption> Example to use getPersistedPersonalization</caption>
   * PersonalizationService.persistUserPersonalization()
   */
	persistUserPersonalization(value): void {
		let self = this;
		let context = localStorage.getItem("selectedUserPersonalization");
		let selectedUserPersonalization = null;
		if (!CommonUtils.isNullOrEmpty(context)) {
			selectedUserPersonalization = JSON.parse(context);
		} else {
			selectedUserPersonalization = {
				user: null
			}
		}
		selectedUserPersonalization.user = value;
		if (!CommonUtils.isNullOrEmpty(selectedUserPersonalization)) {
			localStorage.setItem("selectedUserPersonalization", JSON.stringify(selectedUserPersonalization));
		}
	}
	/**
   * A method to Remove the Persisted Pesanalization User Informantion
   * @method Fxp.Services.PersonalizationService.removePersistedUserPersonalization
   * @example <caption> Example to use removePersistedUserPersonalization</caption>
   * PersonalizationService.removePersistedUserPersonalization()
   */
	removePersistedUserPersonalization(): void {
		localStorage.removeItem("selectedUserPersonalization");
	}
	/**
	 *A method to use Fetch the Global Master LeftNav Items From Api
	 * @method Fxp.Services.PersonalizationService.getMasterLeftNavItems
	 * @example <caption> Example to use getMasterLeftNavItems</caption>
	 * PersonalizationService.getMasterLeftNavItems()
	 */
	getMasterLeftNavItems(): angular.IPromise<any> {
		var self = this;
		var deferred = self.q.defer();
		var url = self.fxpServiceEndPoint + "/leftNav/master";
		if (self.adalLoginHelperService.accessTokenRequestInProgress(url)) {
			self.iReqCount++;
			if (self.iReqCount == 5) {
				self.fxplogger.logError(self.classNamePersonalizationService, self.rootScope.fxpUIConstants.UIMessages.AADAuthFailureError.ErrorMessageTitle, "2603", null);
				self.fxpMessageSvc.addMessage(self.rootScope.fxpUIConstants.UIMessages.AADAuthFailureError.ErrorMessage, FxpConstants.messageType.error);
			}
			self.timeout(function () {
				self.getMasterLeftNavItems();
			}, self.sleepInterval);
		} else {
			self.fxplogger.startTrackPerformance(PerfMarkers.GetMasterLeftNavItems);
			self.iReqCount = 0;
			self.fxplogger.logInformation(self.classNamePersonalizationService, "getMasterLeftNavItems");

			return self.http.get(url);
		}
		self.fxplogger.stopTrackPerformance(PerfMarkers.GetMasterLeftNavItems);
		return deferred.promise;
	}

	/**
	*A method to use Fetch the Personalaized NavItems From Api
	* @method Fxp.Services.PersonalizationService.getPersonalizedNavItems
	* @example <caption> Example to use getPersonalizedNavItems</caption>
	* PersonalizationService.getPersonalizedNavItems()
	*/
	getPersonalizedNavItems(userAlias: string, roleGroupId: string, userRoleId: string): angular.IPromise<any> {
		var self = this;
		var deferred = self.q.defer();
		var url = this.fxpServiceEndPoint + "/user/" + userAlias + "/leftNav/personalization?roleGroupId=" + roleGroupId + "&userRoleId=" + userRoleId;
		if (self.adalLoginHelperService.accessTokenRequestInProgress(url)) {
			self.iReqCount++;
			if (self.iReqCount == 5) {
				self.fxplogger.logError(self.classNamePersonalizationService, self.rootScope.fxpUIConstants.UIMessages.AADAuthFailureError.ErrorMessageTitle, "2603", null);
				self.fxpMessageSvc.addMessage(self.rootScope.fxpUIConstants.UIMessages.AADAuthFailureError.ErrorMessage, FxpConstants.messageType.error);
			}
			self.timeout(function () {
				self.getPersonalizedNavItems(userAlias, roleGroupId, userRoleId);
			}, self.sleepInterval);
		} else {
			self.fxplogger.startTrackPerformance(PerfMarkers.GetPersonalizedNavItems);
			self.iReqCount = 0;
			self.fxplogger.logInformation(self.classNamePersonalizationService, "getPersonalizedNavItems");

			return self.http.get(url);
		}
		self.fxplogger.stopTrackPerformance(PerfMarkers.GetPersonalizedNavItems);
		return deferred.promise;
	}

	/**
	*A method to use save the Personalaized NavItems to Api
	* @method Fxp.Services.PersonalizationService.savePersonalizedNavItems
	* @example <caption> Example to use savePersonalizedNavItems</caption>
	* PersonalizationService.savePersonalizedNavItems(userAlias: string, savedUserPrefNavList: any)
	*/
	savePersonalizedNavItems(userAlias: string, savedUserPrefNavList: any, shouldAssignRoles: boolean = true): angular.IPromise<any> {
		var self = this;
		var deferred = self.q.defer();
		var url = self.fxpServiceEndPoint + "/user/" + userAlias + "/leftNav/personalization";
		savedUserPrefNavList.ShouldAssignRoles = shouldAssignRoles;
		if (self.adalLoginHelperService.accessTokenRequestInProgress(url)) {
			self.iReqCount++;
			if (self.iReqCount == 5) {
				self.fxplogger.logError(self.classNamePersonalizationService, self.rootScope.fxpUIConstants.UIMessages.AADAuthFailureError.ErrorMessageTitle, "2603", null);
				self.fxpMessageSvc.addMessage(self.rootScope.fxpUIConstants.UIMessages.AADAuthFailureError.ErrorMessage, FxpConstants.messageType.error);
			}
			self.timeout(function () {
				self.savePersonalizedNavItems(userAlias, savedUserPrefNavList);
			}, self.sleepInterval);
		} else {
			self.fxplogger.startTrackPerformance(PerfMarkers.SavePersonalizedNavItems);
			self.iReqCount = 0;
			self.fxplogger.logInformation(self.classNamePersonalizationService, "savePersonalizedNavItems");
			return self.http.post(url, savedUserPrefNavList, { headers: { 'Content-Type': 'application/json' } });
		}
		self.fxplogger.stopTrackPerformance(PerfMarkers.SavePersonalizedNavItems);
		return deferred.promise;
	}

	/**
	*A method to use Fetch the RoleGroupDetails From Api
	* @method Fxp.Services.PersonalizationService.getRoleGroupDetails
	* @example <caption> Example to use getRoleGroupDetails</caption>
	* PersonalizationService.getRoleGroupDetails()
	*/
	getRoleGroupDetails(): angular.IPromise<any> {
		var self = this;
		var deferred = self.q.defer();
	
		var url = self.tenantClaimsApiEndpoint + "/roles";
		if (self.adalLoginHelperService.accessTokenRequestInProgress(url)) {
			self.iReqCount++;
			if (self.iReqCount == 5) {
				self.fxplogger.logError(self.classNamePersonalizationService, self.rootScope.fxpUIConstants.UIMessages.AADAuthFailureError.ErrorMessageTitle, "2611", null);
				self.fxpMessageSvc.addMessage(self.rootScope.fxpUIConstants.UIMessages.AADAuthFailureError.ErrorMessage, FxpConstants.messageType.error);
			}
			self.timeout(function () {
				self.getRoleGroupDetails();
			}, self.sleepInterval);
		} else {
			self.fxplogger.startTrackPerformance(PerfMarkers.GetRoleGroupDetails);
			self.iReqCount = 0;
			self.fxplogger.logInformation(self.classNamePersonalizationService, "getRoleGroupDetails");

			let requestHeaders = {};
			requestHeaders["X-Tenants"] = self.tenantNPD;
			return this.http.get(url, {	headers:requestHeaders});

		}
		self.fxplogger.stopTrackPerformance(PerfMarkers.GetRoleGroupDetails);
		return deferred.promise;
	}

	/**
	*A method to use get the Role Personalaized NavItems from Api
	* @method Fxp.Services.PersonalizationService.getRolePersonalizedNavItems
	* @example <caption> Example to use getRolePersonalizedNavItems</caption>
	* PersonalizationService.getRolePersonalizedNavItems(userRoleId, roleGroupId)
	*/
	getRolePersonalizedNavItems(userRoleId: string, roleGroupId: string): angular.IPromise<any> {
		var self = this;
		var deferred = self.q.defer();
		var url = this.fxpServiceEndPoint + "/navigation/personalization?roleGroupId=" + roleGroupId;
		
		if (self.adalLoginHelperService.accessTokenRequestInProgress(url)) {
			self.iReqCount++;
			if (self.iReqCount == 5) {
				self.fxplogger.logError(self.classNamePersonalizationService, self.rootScope.fxpUIConstants.UIMessages.AADAuthFailureError.ErrorMessageTitle, "2603", null);
				self.fxpMessageSvc.addMessage(self.rootScope.fxpUIConstants.UIMessages.AADAuthFailureError.ErrorMessage, FxpConstants.messageType.error);
			}
			self.timeout(function () {
				self.getRolePersonalizedNavItems(userRoleId, roleGroupId);
			}, self.sleepInterval);
		} else {
			self.fxplogger.startTrackPerformance(PerfMarkers.GetPersonalizedNavItems);
			self.iReqCount = 0;
			self.fxplogger.logInformation(self.classNamePersonalizationService, "getRolePersonalizedNavItems");
			var requestHeaders = {}
			requestHeaders["tenantId"] = window["tenantConfiguration"].TenantId;
			return self.http.get(url, { headers: requestHeaders });
		}
		self.fxplogger.stopTrackPerformance(PerfMarkers.GetPersonalizedNavItems);
		return deferred.promise;
	}

	/**
	*A method to use get the RoleGroup Personalaized NavItems from Api
	* @method Fxp.Services.PersonalizationService.savePersonalizedNavItems
	* @example <caption> Example to use getRoleGroupPersonalizedList</caption>
	* PersonalizationService.getRoleGroupPersonalizedList(roleGroupId)
	*/
	getRoleGroupPersonalizedList(roleGroupId: string): angular.IPromise<any> {
		var self = this;
		var deferred = self.q.defer();

		var url = self.fxpServiceEndPoint + "/navigation/personalization?AppRole=" + roleGroupId;

		if (self.adalLoginHelperService.accessTokenRequestInProgress(url)) {
			self.iReqCount++;
			if (self.iReqCount == 5) {
				self.fxplogger.logError(self.classNamePersonalizationService, self.rootScope.fxpUIConstants.UIMessages.AADAuthFailureError.ErrorMessageTitle, "2603", null);
				self.fxpMessageSvc.addMessage(self.rootScope.fxpUIConstants.UIMessages.AADAuthFailureError.ErrorMessage, FxpConstants.messageType.error);
			}
			self.timeout(function () {
				self.getRoleGroupPersonalizedList(roleGroupId);
			}, self.sleepInterval);
		} else {
			self.fxplogger.startTrackPerformance(PerfMarkers.GetPersonalizedNavItems);
			self.iReqCount = 0;
			self.fxplogger.logInformation(self.classNamePersonalizationService, "getRoleGroupPersonalizedList");
            return self.http.get(url, { headers: { "X-TenantId": window["tenantConfiguration"].TenantId } });
		}
		self.fxplogger.stopTrackPerformance(PerfMarkers.GetPersonalizedNavItems);
		return deferred.promise;
	}

	/**
	*A method to use save the Personalaized NavItems to Api
	* @method Fxp.Services.PersonalizationService.savePersonalizedNavItems
	* @example <caption> Example to use savePersonalizedNavItems</caption>
	* PersonalizationService. saveRoleGroupPersonalizedNavItems(roleGroupId: string, userRoleId: string, savedRoleGroupPrefNavList: any)
	*/
	saveRoleGroupPersonalizedNavItems(savedRoleGroupPrefNavList: any, shouldAssignRoles: boolean = true): angular.IPromise<any> {
		var self = this, url;
		var deferred = self.q.defer();
		savedRoleGroupPrefNavList.ShouldAssignRoles = shouldAssignRoles;
		url = self.fxpServiceEndPoint + "/navigation/personalization";

		if (self.adalLoginHelperService.accessTokenRequestInProgress(url)) {
			self.iReqCount++;
			if (self.iReqCount == 5) {
				self.fxplogger.logError(self.classNamePersonalizationService, self.rootScope.fxpUIConstants.UIMessages.AADAuthFailureError.ErrorMessageTitle, "2603", null);
				self.fxpMessageSvc.addMessage(self.rootScope.fxpUIConstants.UIMessages.AADAuthFailureError.ErrorMessage, FxpConstants.messageType.error);
			}
			self.timeout(function () {
				self.saveRoleGroupPersonalizedNavItems(savedRoleGroupPrefNavList, shouldAssignRoles);
			}, self.sleepInterval);
		} else {
			self.fxplogger.startTrackPerformance(PerfMarkers.SaveRoleGroupPersonalizedNavItems);
			self.iReqCount = 0;
			self.fxplogger.logInformation(self.classNamePersonalizationService, "saveRoleGroupPersonalizedNavItems");
			return self.http.post(url, savedRoleGroupPrefNavList, { headers: { 'Content-Type': 'application/json', 'X-TenantId': window['tenantConfiguration'].TenantId } });
		}
		self.fxplogger.stopTrackPerformance(PerfMarkers.SaveRoleGroupPersonalizedNavItems);
		return deferred.promise;
	}

	/**
	*A method to use get the RoleGroup which is configured in Sysytem
	* @method Fxp.Services.PersonalizationService.getDefaultRoleGroup
	* @example <caption> Example to use getDefaultRoleGroup</caption>
	* PersonalizationService.getDefaultRoleGroup(roleGroupId: number)
	*/
	getRoleGroup(roleGroupId: number): any {
		var self = this;
		return self.http.get("/Home/GetRoleGroup?roleGroupId=" + roleGroupId);
	}
}
