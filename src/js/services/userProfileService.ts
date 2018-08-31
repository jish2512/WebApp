import { IRootScope } from "../interfaces/IRootScope";
import { ILogger } from "../interfaces/ILogger";
import { AdalLoginHelperService } from "./AdalLoginHelperService";
import { FxpContext } from "../context/FxpContext";
import { FxpMessageService } from "./FxpMessageService";
import { FxpConstants, ApplicationConstants, PerfMarkers, CustomEvents } from "../common/ApplicationConstants";
import { FxpConfigurationService } from "./FxpConfiguration";
import { TelemetryContext } from "../telemetry/telemetrycontext";
import { UserInfoService } from "./UserInfoService";
import { CommonUtils } from "../utils/CommonUtils";
import { LogPropertyBag } from "../telemetry/LogPropertyBag";
import { FxpLogHelper } from "../telemetry/FxpLogHelper";
import { UserInfo } from "../common/UserInfo";
import { IHttpPromise } from "angular";
import { UserClaimsService } from "./UserClaimsService";
import { FxpBroadcastedEvents } from "./FxpBroadcastedEvents";


/**
   * A service to connect to user profile service to fetch the detaisl of user info and user claims related to partner apps
   * @class Fxp.Services.UserProfileService
   * @classdesc A service to connect to user profile service to fetch the user profile details and claims 
   * @example <caption> Example to create an instance of user profile service</caption>         
   *  //Initializing User Profile Service
   *  angular.module('FxPApp').controller('AppController', ['UserProfileService', AppController]);
   *  function AppController(userProfileService){ userProfileService.getUserThumbnail(upn); }
   */
export class UserProfileService {
	private http: angular.IHttpService;
	private q: angular.IQService;
	private rootScope: IRootScope;
	private timeout: angular.ITimeoutService;
	private sleepInterval: number;
	private adalLoginHelperService: AdalLoginHelperService;
	private profileApiEndpoint: string;
	private claimsApiEndpoint: string;
	private loggedInUserAlias: string;
	private fxplogger: ILogger;
	private static _instance: UserProfileService;
	private fxpcontext: FxpContext;
	private userAlias: string;
	private fxpMessageSvc: FxpMessageService;
	private fxpConfiguration: FxpConfigurationService;
	private iCount: number = 0;
	private iReqCount: number = 0;
	private iUCount: number = 0;
	private telemetryContext: TelemetryContext;
	private userInfoService: UserInfoService;
	public  currentUserAlias;
	private classNameUserProfileService = "Fxp.UserProfileService";
	private responseStartTime = 0;
	private isBasicProfileRefreshed = true;
	private graphAPIProfileUrl: string;
	private defaultRoleGroupId: number;
	private defaultBusinessRoleId: number;
	private searchProfileApiEndpoint: string;
	private userClaimsService: UserClaimsService;
	private isProfileRequired: boolean;
	constructor($http: angular.IHttpService, $q: angular.IQService, $rootScope: IRootScope, $timeout: angular.ITimeoutService, loggerService: ILogger, adalLoginHelperService: AdalLoginHelperService, fxpMessage: FxpMessageService, fxpContext: FxpContext, fxpConfiguration: FxpConfigurationService,
		fxpTelemetryContext: TelemetryContext, userInfoService: UserInfoService, userClaimsService: UserClaimsService) {
		this.telemetryContext = fxpTelemetryContext;
		this.http = $http;
		this.q = $q;
		this.rootScope = $rootScope;
		this.timeout = $timeout;
		this.sleepInterval = 100;
		this.adalLoginHelperService = adalLoginHelperService;
		this.fxplogger = loggerService;
		this.fxpMessageSvc = fxpMessage;
		this.fxpConfiguration = fxpConfiguration;
		this.fxpcontext = fxpContext;
		this.userAlias = "";
		this.loggedInUserAlias = "";
		this.currentUserAlias = "";
		this.userInfoService = userInfoService;
		this.userClaimsService = userClaimsService;
		this.graphAPIProfileUrl = fxpConfiguration.FxpAppSettings.GraphADEndPoint;
		let profileStore = window["tenantConfiguration"].ProfileStore || {};
		this.profileApiEndpoint = profileStore.ProfileAPIEndPoint;
		this.searchProfileApiEndpoint = profileStore.SearchAPIEndPoint;
		this.isProfileRequired = (window["tenantConfiguration"].IsProfileReuired);

		if (UserProfileService._instance) {
			return UserProfileService._instance;
		}
		UserProfileService._instance = this;
	}

	/**
	* Gets thumbnail image from the graph api service  
	* @method Fxp.Services.UserProfileService.getUserThumbnail
	* @param {Email} upn a User Principal Name (UPN) is the name of a system user in an e-mail address format.
	* @param {Boolean} deferred a boolean value which is false by default.
	* @example <caption> Example to invoke getUserThumbnail</caption>
	*  userProfileService.getUserThumbnail('logged in user email');
	*/
	getUserThumbnail(upn: string, parentDeferred: any): any {
		let url = ApplicationConstants.GraphAPIUserUrl;
		let deferred = parentDeferred || this.q.defer();
		let self = this;
		if (self.adalLoginHelperService.accessTokenRequestInProgress(url)) {
			self.iCount++;
			if (self.iCount == 5) {
				self.fxplogger.logError(self.classNameUserProfileService, self.rootScope.fxpUIConstants.UIMessages.AADAuthFailureError.ErrorMessageTitle, "2602", null);
				self.fxpMessageSvc.addMessage(self.rootScope.fxpUIConstants.UIMessages.AADAuthFailureError.ErrorMessage, FxpConstants.messageType.error);
				return deferred.promise;
			}
			self.timeout(function () {
				self.getUserThumbnail(upn, deferred);
			}, self.sleepInterval);
		}
		else {
			self.iCount = 0;
			self.fxplogger.logInformation(self.classNameUserProfileService, "GetUserThumbnail");
			return self.http({
				url: url + upn + ApplicationConstants.ThumbnailUrl,
				method: "get",
				responseType: "blob"
			});
		}

		return deferred.promise;
	};

	/**
   * Gets user's basic profile details by connecting to the service through the url  
   * @method Fxp.Services.UserProfileService.getBasicUserProfile
   * @example <caption> Example to invoke getBasicUserProfile</caption>
   *  userProfileService.getBasicUserProfile();
   */
	getBasicUserProfile(pDeferred: Object): angular.IPromise<string> {
		if (!this.isBasicProfileRefreshed)
			console.warn("getBasicUserProfile was called before basic profile details were refreshed");
		return this.getBasicProfileByAlias(this.currentUserAlias, pDeferred);
	}
	/**
   * Gets user's latest basic profile details by connecting to the service through the url  
   * @method Fxp.Services.UserProfileService.refreshBasicUserProfileInContext
   * @example <caption> Example to invoke refreshBasicUserProfileInContext</caption>
   *  userProfileService.refreshBasicUserProfileInContext();
   */
	refreshBasicUserProfileInContext(pDeferred: any): angular.IPromise<string> {
		let self = this;
		let deferred = pDeferred || this.q.defer();
		self.isBasicProfileRefreshed = false;
		self.responseStartTime = performance.now();
		console.log("Basic Profile Api Call Start Time : " + self.responseStartTime);
		self.getBasicProfile(this.currentUserAlias, true, deferred);
		return deferred.promise;
	}
	/**
	* Gets user's basic profile details for passed in Alias  
	* @method Fxp.Services.UserProfileService.getBasicProfileByAlias
	* @param {Alias} alias an alias of a user
	* @param {Object} deferred holds promise of a parent caller if set
	* @example <caption> Example to invoke getBasicProfileSvc</caption>
	*  userProfileService.getBasicProfileByAlias('<<user alias>>');
	*/
	public getBasicProfileByAlias(alias: string, pDeferred?: any): angular.IPromise<string> {

		let self = this;
		let deferred = pDeferred || this.q.defer();
		let userData = null;
		let profileStoragekey = CommonUtils.getSessionStorageUserInfoKey(alias);
		self.fxplogger.logInformation(self.classNameUserProfileService, "getBasicProfileByAlias started");
		if (sessionStorage[profileStoragekey]) {
			self.fxplogger.logInformation(self.classNameUserProfileService, "profile data is fetching from sessionStorage");
			userData = JSON.parse(sessionStorage[profileStoragekey]);
			self.timeout(() => {
				deferred.resolve(userData);
			}, self.sleepInterval);
		} else { self.getBasicProfile(alias, true, deferred) };
		return deferred.promise;
	}

	/**
	* Gets user's basic profile details by connecting to the service through the url  
	* @method Fxp.Services.UserProfileService.getBasicProfileSvc
	* @param {Alias} alias an alias is the name of a user upto the symbol @ in the upn.
	* @param {Boolean} deferred a boolean value which is false by default.
	* @example <caption> Example to invoke getBasicProfileSvc</caption>
	*  userProfileService.getBasicProfileSvc('logged in user alias', false);
	*/
	private getBasicProfileSvc(alias: string, parentDeferred: any): IHttpPromise<string> {
		let self = this;
		let url = '';
		if (self.profileApiEndpoint) {
			url = self.profileApiEndpoint + '/profile/' + alias + '/basic/';
		}
		else {
			//call graph API
			url = self.graphAPIProfileUrl + ApplicationConstants.GraphApiProfileUrl;
		}

		let deferred = parentDeferred || self.q.defer();

		if (self.adalLoginHelperService.accessTokenRequestInProgress(url)) {
			self.iUCount++;
			if (self.iUCount == 5) {
				self.fxplogger.logError(self.classNameUserProfileService, self.rootScope.fxpUIConstants.UIMessages.AADAuthFailureError.ErrorMessageTitle, "2604", null);
				self.fxpMessageSvc.addMessage(self.rootScope.fxpUIConstants.UIMessages.AADAuthFailureError.ErrorMessage, FxpConstants.messageType.error);
				return deferred.promise;
			}
			self.timeout(function () {
				self.getBasicProfileSvc(alias, deferred);
			}, self.sleepInterval);
		}
		else {
			self.iUCount = 0;
			self.fxplogger.logInformation(self.classNameUserProfileService, "GetBasicProfileSvc");
			self.fxplogger.stopTrackPerformance(PerfMarkers.AdalTimeGetBasicProfile);
			//this.logAdalInfoForEndpoint(url);
			return this.http.get(url);
		}
		return deferred.promise;
	}

	getBasicProfile(alias: string, isRefresh: boolean, pDeferred?: any): angular.IPromise<any> {
		let self = this;
		this.fxplogger.logInformation(self.classNameUserProfileService, "getBasicProfile(alias) Started");
		let userData = null;
		let receiveDate;
		let responseTime;
		let rootScope = this.rootScope;
		let deferred = pDeferred || this.q.defer();
		let telemetryContext = this.telemetryContext;
		self.userAlias = alias;

		if (!isRefresh) {
			return self.getBasicUserProfile(deferred);
		}
		else {
			let sendDate = new Date();
			this.fxplogger.startTrackPerformance(PerfMarkers.GetBasicProfileWithAdal);
			this.fxplogger.startTrackPerformance(PerfMarkers.AdalTimeGetBasicProfile);
			self.getBasicProfileSvc(alias, false).then(function (data) {
				userData = data;
				// Logging a metric with the response

				receiveDate = new Date();
				responseTime = receiveDate.getTime() - sendDate.getTime(); // in millisecs
				var propbag = self.fxplogger.createPropertyBag();
				propbag.addToBag(FxpConstants.metricConstants.Status, userData.status);
				propbag.addToBag(FxpConstants.metricConstants.StatusText, userData.statusText);

				propbag.addToBag(FxpConstants.metricConstants.StartTime, sendDate.toUTCString());
				propbag.addToBag(FxpConstants.metricConstants.EndTime, receiveDate.toUTCString());
				propbag.addToBag(FxpConstants.metricConstants.ServiceName, FxpConstants.metricConstants.GetBasicProfileSvcName);
				var url = (self.profileApiEndpoint) ? self.profileApiEndpoint + '/profile/' + alias + '/basic/' : self.graphAPIProfileUrl;
				propbag.addToBag(FxpConstants.metricConstants.ServiceURL, url);
				propbag.addToBag(FxpConstants.metricConstants.UserAgent, navigator.userAgent);

				propbag.addToBag(FxpConstants.metricConstants.SessionId, rootScope.sessionId);
				propbag.addToBag(FxpConstants.metricConstants.UserUPN, alias);
				propbag.addToBag(FxpConstants.metricConstants.UserBusinessRole, userData.BusinessRole);
				propbag.addToBag(FxpConstants.metricConstants.Geography, telemetryContext.getGeography());
				self.fxplogger.stopTrackPerformance(PerfMarkers.GetBasicProfileWithAdal);
				self.fxplogger.logMetric(FxpConstants.metricConstants.UserProfileService, "BasicProfileResponseTime", responseTime, propbag);
				self.fxplogger.logInformation(self.classNameUserProfileService, "getBasicProfile(alias) End");

				if (userData.data != undefined && userData.data != null) {
					userData = userData.data;

					var userInfo = new UserInfo();
					if (self.profileApiEndpoint) {
						for (var attr in userData) {
							userInfo[attr] = userData[attr];
						}

						// Adding BusinessDomain
						userInfo.BusinessDomain = userData.SDODomain;

						//Adding RoleGrouId
						userInfo.RoleGroupId = userData.RoleGroupID;
						rootScope.BusinessRole = userInfo.BusinessRole;

						// Adding Email
						userInfo.Email = userData.EmailName;


						// Adding FirstName to FullName
						if (!CommonUtils.isNullOrEmpty(userInfo.FirstName)) {
							userInfo.FullName = userInfo.FirstName;
						}

						// Adding MiddleName to FullName
						if (!CommonUtils.isNullOrEmpty(userInfo.MiddleName)) {
							userInfo.FullName += (userInfo.FullName.length > 0 ? " " : "") + userInfo.MiddleName;
						}

						// Adding LastName to FullName
						if (!CommonUtils.isNullOrEmpty(userInfo.LastName)) {
							userInfo.FullName += (userInfo.FullName.length > 0 ? " " : "") + userInfo.LastName;
						}

						//Adding BusinessRoleDisplayName
						if (!CommonUtils.isNullOrEmpty(userInfo.BusinessRole)) {
							if (!CommonUtils.isNullOrEmpty(userInfo.Seniority)) {
								userInfo.BusinessRoleDisplayName = userInfo.Seniority + " " + userInfo.BusinessRole;
							}
							else {
								userInfo.BusinessRoleDisplayName = userInfo.BusinessRole;
							}
						}

						//Checking BusinessRole and BusinessRoleId
						if ((userInfo.BusinessRoleId == null || userInfo.BusinessRoleId == 0) ||
							(CommonUtils.isNullOrEmpty(userInfo.BusinessRole))) {
							self.fxplogger.logError(self.classNameUserProfileService, rootScope.fxpUIConstants.UIMessages.UserProfileBusinessRoleMissingError.ErrorMessageTitle, "2608", null);
							self.fxpMessageSvc.addMessage(rootScope.fxpUIConstants.UIMessages.UserProfileBusinessRoleMissingError.ErrorMessage, FxpConstants.messageType.error);
						}

						// Checking RoleGroup
						if ((!userInfo.RoleGroupId || userInfo.RoleGroupId <= 0) ||
							(CommonUtils.isNullOrEmpty(userInfo.RoleGroupName))) {
							var propbag = self.fxplogger.createPropertyBag();
							propbag.addToBag(FxpConstants.metricConstants.SessionId, rootScope.sessionId);
							propbag.addToBag(FxpConstants.metricConstants.TimeStamp, FxpLogHelper.getTimeStamp());
							propbag.addToBag(FxpConstants.metricConstants.UserUPN, alias);
							propbag.addToBag(FxpConstants.metricConstants.UserAgent, navigator.userAgent);
							propbag.addToBag(FxpConstants.metricConstants.UserBusinessRole, userInfo.BusinessRole);
							propbag.addToBag(FxpConstants.metricConstants.Geography, telemetryContext.getGeography());
							self.fxplogger.logError(self.classNameUserProfileService, rootScope.fxpUIConstants.UIMessages.UserProfileRoleGroupMissingError.ErrorMessageTitle, "2609", "", propbag);
						}

					} else {
						//read data incase graph api call
						userInfo = self.getProfileDataFromGraphResponse(userData);
					}

					// adding user profile data to the session 
					sessionStorage[CommonUtils.getSessionStorageUserInfoKey(alias)] = JSON.stringify(userInfo);
					var responseEndTime = performance.now();
					var responseTotalDuration = responseEndTime - self.responseStartTime;
					self.isBasicProfileRefreshed = true;
					self.rootScope.$broadcast(FxpBroadcastedEvents.OnBasicUserProfileRefresh);
					console.log("Basic Profile Api Call End Time : " + responseEndTime);
					console.log("Basic Profile Api Call Total Duration : " + responseTotalDuration);
				}
				else {
					self.fxplogger.logError(self.classNameUserProfileService, rootScope.fxpUIConstants.UIMessages.UserProfileNotFoundError.ErrorMessageTitle, "2607", null);
					if (self.isProfileRequired)
						self.fxpMessageSvc.addMessage(rootScope.fxpUIConstants.UIMessages.UserProfileNotFoundError.ErrorMessage, FxpConstants.messageType.error);
				}

				deferred.resolve(userInfo);
			}).catch(function (err) {
				self.fxplogger.stopTrackPerformance(PerfMarkers.GetBasicProfileWithAdal);
				// property bag for error
				if (self.isProfileRequired) {
					var propbag = self.fxplogger.createPropertyBag();
					var doesProfileExists = true;
					receiveDate = new Date();
					responseTime = receiveDate.getTime() - sendDate.getTime(); // in millisecs
					propbag.addToBag(FxpConstants.metricConstants.StartTime, sendDate.toUTCString());
					propbag.addToBag(FxpConstants.metricConstants.EndTime, receiveDate.toUTCString());
					propbag.addToBag(FxpConstants.metricConstants.ServiceName, FxpConstants.metricConstants.GetBasicProfileSvcName);
					if (err != null) {
						propbag.addToBag(FxpConstants.metricConstants.Status, err.status);
						propbag.addToBag(FxpConstants.metricConstants.StatusText, err.statusText);
						propbag.addToBag(FxpConstants.metricConstants.ErrorUrl, err.config ? err.config.url : '');

						if (err.status == "404")
							doesProfileExists = false;

						if (!doesProfileExists)
							self.fxplogger.logEvent(self.classNameUserProfileService, CustomEvents.ProfileNotFound, propbag);
						else
							self.logBasicProfileFailureError(propbag);

						self.fxpMessageSvc.addMessage(rootScope.fxpUIConstants.UIMessages.ProfileServiceCallFailedError.ErrorMessage, FxpConstants.messageType.error);
					} else {
						propbag.addToBag(FxpConstants.metricConstants.ServiceURL, self.profileApiEndpoint + '/profile/' + alias + '/basic/');
						propbag.addToBag(FxpConstants.metricConstants.ErrorText, "Error object is null");
						self.logBasicProfileFailureError(propbag);
					}
					deferred.reject(err);
				}else{
					var userInfo = self.getDeafultUserInfo(alias);
					self.isBasicProfileRefreshed = true;
					sessionStorage[CommonUtils.getSessionStorageUserInfoKey(alias)] = JSON.stringify(userInfo);
					deferred.resolve(userInfo);
				}

			});
		}

		return deferred.promise;
	}

	/**
	* Logs exception occured in get basic profile
	* @method Fxp.Services.UserProfileService.logBasicProfileFailureError
	* @param {object} propbag contains all property bag values.
	*  userProfileService.logBasicProfileFailureError(propbag);
	*/
	logBasicProfileFailureError(propbag: LogPropertyBag): void {
		var self = this;
		self.fxplogger.logError(self.classNameUserProfileService, self.rootScope.fxpUIConstants.UIMessages.ProfileServiceCallFailedError.ErrorMessageTitle, "2600", null, propbag);
	}

	/**
	* Gets logged in user's basic profile details by getBasicUserProfileLoggedInUser to the service through the url  
	* @method Fxp.Services.UserProfileService.getBasicUserProfile
	* @example <caption> Example to invoke getBasicUserProfileLoggedInUser</caption>
	*  userProfileService.getBasicUserProfileLoggedInUser();
	*/
	getBasicUserProfileLoggedInUser(): angular.IPromise<any> {
		return this.getBasicProfileByAlias(this.loggedInUserAlias, null);
	}

	setLoggedInUser(alias: string) {
		this.loggedInUserAlias = alias;
		this.userInfoService.setLoggedInUser(alias);
	}


	setCurrentUser(alias: string) {
		if (alias) {
			this.userAlias = alias;
			this.currentUserAlias = alias;
			this.userInfoService.setCurrentUser(alias);
		}
	}

	isObo(): boolean {
		return this.userInfoService.isActingOnBehalfOf();
	}
	/**
	* Returns search results from the profile API for the specified search string
	* @method Fxp.Services.UserProfileService.searchProfile
	* @param {string} searchString search string for a user alias.
	* @example <caption> Example to invoke searchProfile</caption>
	*  userProfileService.searchProfile('search string');
	*/
	searchProfile(searchString, parentDiffered?) {
		var self = this;
		var url = self.searchProfileApiEndpoint + '/profile/searchprofile?searchText=' + searchString;

		var deferred = parentDiffered || self.q.defer();

		if (self.adalLoginHelperService.accessTokenRequestInProgress(url)) {
			self.iUCount++;
			if (self.iUCount == 5) {
				self.fxplogger.logError("Fxp.UserProfile", self.rootScope.fxpUIConstants.UIMessages.AADAuthFailureError.ErrorMessageTitle, "2604", null);
				self.fxpMessageSvc.addMessage(self.rootScope.fxpUIConstants.UIMessages.AADAuthFailureError.ErrorMessage, FxpConstants.messageType.error);
				return deferred.promise;
			}
			self.timeout(function () {
				self.searchProfile(searchString, deferred);
			}, self.sleepInterval);
		}
		else {
			self.iUCount = 0;
			self.fxplogger.logInformation(self.classNameUserProfileService, "searchProfile");
			return (window["tenantConfiguration"].ProfileStore && window["tenantConfiguration"].ProfileStore.SearchAPIHeaders) ?
				self.http.get(url, { headers: window["tenantConfiguration"].ProfileStore.SearchAPIHeaders }) : self.http.get(url);
		}
		return deferred.promise;
	}

    /**
         * Fxp.Services.UserProfileService.getLoggedInUserClaims
         * @deprecated this method is deprecated use userclaimsservice.getLoggedInUserClaims() instead
         * @param appId it contains application id 
         * @example <caption> Example to invoke getLoggedInUserClaims</caption>
         * userProfileService.getLoggedInUserClaims(appId);
         */
	getLoggedInUserClaims(appId: string): any {
		var self = this;
		console.warn("UserProfileService.getLoggedInUserClaims() method was deprecated use userclaimsservice.getLoggedInUserClaims() instead");
		return self.userClaimsService.getLoggedInUserClaims(appId);

	}

	/**
	* @deprecated  userclaimsservice.getUserClaims()
	* Gets userclaims of the logged in user from the fxp context for an application.
	* @method Fxp.Services.UserProfileService.getUserClaims
	* @param {ApplcationId } appId application name for which the roles defined.              
	* @example <caption> Example to invoke getUserClaims</caption>
	* userProfileService.getUserClaims('oneProfile');
	*/
	getUserClaims(appId: string): any {
		var self = this;
		console.warn("UserProfileService.getUserClaims() method was deprecated use userclaimsservice.getUserClaims() instead");
		return self.userClaimsService.getUserClaims(appId);

	}

	/**
	* @deprecated this method is deprecated use userclaimsservice.getUserClaimsSvc() instead
	* Gets user claims by connecting to the service through the url
	* @method Fxp.Services.UserProfileService.getUserClaimsSvc        
	* @example <caption> Example to invoke getUserClaimsSvc</caption>
	*  userProfileService.getUserClaimsSvc();
	*/
	getUserClaimsSvc(alias: string, parentDeferred?: any): angular.IPromise<any> {
		console.warn("UserProfileService.getUserClaimsSvc() method was deprecated use userclaimsservice.getUserClaimsSvc() instead");
		return this.userClaimsService.getUserClaimsSvc(alias, parentDeferred);
	}

	/**
	 * @method Fxp.Services.UserProfileService.getUserClaimsSvc
	 * @deprecated this method is deprecated use userclaimsservice.getCalimsSvc() instead
	 * @param alias it is contains user alias
	 * @example <caption> Example to invoke getUserClaimsSvc</caption>
	 */
	getCalimsSvc(alias: string): angular.IPromise<any> {
		console.warn("UserProfileService.getCalimsSvc method was deprecated use userclaimsservice.getCalimsSvc() instead");
		return this.userClaimsService.getCalimsSvc(alias);
	}


	private getProfileDataFromGraphResponse(userData: any): any {
		var self = this;
		var userInfo = new UserInfo();
		userInfo.Email = userData.caller;
		userInfo.FirstName = userData.givenName;
		userInfo.LastName = userData.surname;
		userInfo.FullName = userData.displayName;
		userInfo.Email = userData.userPrincipalName;
		userInfo.DisplayName = userData.displayName;
		userInfo.Alias = userData.mailNickname;
		userInfo.PersonnelNumber = userData.immutableId;
		userInfo.BusinessRole = userData.jobTitle || {};
		userInfo.BusinessRoleDisplayName = userData.jobTitle || {};
		for (let item in userData) {
			if (item.indexOf("ReportsToFullName") > 0) {
				userInfo.ReportsToDisplayName = userData[item]
				userInfo.ReportsToFullName = userInfo.ReportsToDisplayName;
				break;
			}
		}
		return userInfo; 
	}

	private getDeafultUserInfo(alias) {
		var self = this;
		var userInfo = new UserInfo();
		userInfo.Email = "";
		userInfo.FirstName = "";
		userInfo.LastName = "";
		userInfo.FullName = "";
		userInfo.DisplayName = "";
		userInfo.Alias = alias;
		userInfo.BusinessRole = ""; 
		userInfo.BusinessRoleDisplayName = "";
		return userInfo;
	}
}