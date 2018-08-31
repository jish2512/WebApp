
import { IRootScope } from "../interfaces/IRootScope";
import { ILogger } from "../interfaces/ILogger";
import { AdalLoginHelperService } from "./AdalLoginHelperService";
import { FxpContext } from "../context/FxpContext";
import { FxpMessageService } from "./FxpMessageService";
import { FxpConstants, ApplicationConstants, PerfMarkers, CustomEvents } from "../common/ApplicationConstants";
import { UserInfoService } from "./UserInfoService";
import { CommonUtils } from "../utils/CommonUtils";
import { LogPropertyBag } from "../telemetry/LogPropertyBag";
import { FxpLogHelper } from "../telemetry/FxpLogHelper";
import { UserInfo } from "../common/UserInfo";
import { IHttpPromise } from "angular";
import * as _ from 'underscore';
/**
* A service to connect to user cliams service to fetch the detaisl of user claims related to partner apps
* @class Fxp.Services.UserClaimsService
* @classdesc A service to connect to user cliams service to fetch the detaisl of user claims related to partner apps
* @example <caption> Example to create an instance of user cliams service</caption>
*  //Initializing User Cliams Service
*  angular.module('FxPApp').controller('AppController', ['UserClaimsService', AppController]);
*  function AppController(userClaimsService){ userClaimsService.getUserThumbnail(upn); }
*/
export class UserClaimsService {
    private http: angular.IHttpService;
    private q: angular.IQService;
    private rootScope: IRootScope;
    private timeout: angular.ITimeoutService;
    private sleepInterval: number;
    private adalLoginHelperService: AdalLoginHelperService;
    private claimsApiEndpoint: string;
    private tenantClaimsApiEndpoint: string;
    private loggedInUserAlias: string;
    private fxplogger: ILogger;
    private static _instance: UserClaimsService;
    private fxpcontext: FxpContext;
    private userAlias: string;
    private fxpMessageSvc: FxpMessageService;
    private fxpConstants: FxpConstants;
    private iCount: number = 0;
    private iReqCount: number = 0;
    private iUCount: number = 0;
    private userInfoService: UserInfoService;
    public currentUserAlias;
    private classNameUserClaimsService = "Fxp.UserClaimsService";
    private responseStartTime = 0;

    constructor($http: angular.IHttpService, $q: angular.IQService, $rootScope: IRootScope, $timeout: angular.ITimeoutService, loggerService: ILogger, adalLoginHelperService: AdalLoginHelperService, fxpMessage: FxpMessageService, fxpContext: FxpContext,
        userInfoService: UserInfoService) {
        this.http = $http;
        this.q = $q;
        this.rootScope = $rootScope;
        this.timeout = $timeout;
        this.sleepInterval = 100;
        this.adalLoginHelperService = adalLoginHelperService;
        this.fxplogger = loggerService;
        this.fxpMessageSvc = fxpMessage;
        this.fxpcontext = fxpContext;
        this.fxpConstants = FxpConstants;
        this.userAlias = "";
        this.loggedInUserAlias = "";
        this.currentUserAlias = "";
        this.userInfoService = userInfoService;
        let authStore = window["tenantConfiguration"].AuthStore || {};
        this.claimsApiEndpoint = authStore.UserClaimsEndPoint;
        this.tenantClaimsApiEndpoint = authStore.TenantClaimsEndPoint;
        if (UserClaimsService._instance) {
            return UserClaimsService._instance;
        }
        UserClaimsService._instance = this;
    }

    /**
    * intializing logged in user alias
    * @method Fxp.Services.UserClaimsService.setLoggedInUser
    * @param {string } alias it contains logged in user alias
    * @example <caption> Example to invoke setLoggedInUser</caption>
    * UserClaimsService.setLoggedInUser(alias);
    */
    setLoggedInUser(alias: string) {
        this.loggedInUserAlias = alias;
    }

    /**
    * Gets userclaims of the logged in user from the fxp context for an application.  
    * @method Fxp.Services.UserClaimsService.getLoggedInUserClaims
    * @param {ApplcationId } appId application name for which the roles defined.              
    * @example <caption> Example to invoke getLoggedInUserClaims</caption>
    * UserClaimsService.getLoggedInUserClaims('oneProfile');
    */
    getLoggedInUserClaims(appId: string): any {
        let self = this;
        return self.getUserClaimsForAlias(appId, self.userInfoService.getLoggedInUser());
    }

    /**
    * Gets tenant claims of the logged in user from the fxp context for an application.  
    * @method Fxp.Services.UserProfileService.getUserClaims
    * @param {string } tenantId tenant id for which the roles defined.
    * @example <caption> Example to invoke getUserClaims</caption>
    * UserClaimsService.getUserClaims('oneProfile');
    */
    getLoggedInUserTenantClaims(tenantId: string): any {
        let self = this;
        return self.getUserClaimsForAlias(tenantId, self.userInfoService.getLoggedInUser());
    }

    /**
    * Gets userclaims of the logged in user from the fxp context for an application.  
    * @method Fxp.Services.UserClaimsService.getUserClaims
    * @param {string} appId application name for which the roles defined.
    * @example <caption> Example to invoke getUserClaims</caption>
    *  UserClaimsService.getUserClaims('oneProfile');
    */
    getUserClaims(appId: string): any {
        let self = this;
        return self.getUserClaimsForAlias(appId, self.userInfoService.getCurrentUser());
    }

    /**
    * Gets userclaims of the logged in user from the fxp context for an application.  
    * @method Fxp.Services.UserProfileService.getUserClaims
    * @param {ApplcationId } appId application name for which the roles defined.              
    * @example <caption> Example to invoke getUserClaims</caption>
    *  UserClaimsService.getUserClaims('oneProfile');
    */
    getUserTenantClaims(tenantId: string): any {
        var self = this;
        return self.getUserTenatClaimsByAlias(tenantId, self.userInfoService.getCurrentUser());
    }

    /**
    * Gets userclaims of the logged in user from the fxp context for an application.  
    * @method Fxp.Services.UserProfileService.getUserClaims
    * @param {ApplcationId } appId application name for which the roles defined.              
    * @example <caption> Example to invoke getUserClaims</caption>
    *  UserClaimsService.getUserClaims('oneProfile');
    */
    private getUserClaimsForAlias(appId: string, alias: string): any {
        let self = this;
        let userClaimsSessionStorage = sessionStorage[FxpConstants.CONST.fxpUserClaimsSession + "_" + alias];
        if (CommonUtils.isNullOrEmpty(userClaimsSessionStorage)) {
            self.fxplogger.logError(self.classNameUserClaimsService, self.rootScope.fxpUIConstants.UIMessages.AuthServiceReturnsBlankAppError.ErrorMessageTitle, "2606", null);
            throw new Error(self.rootScope.fxpUIConstants.UIMessages.AuthServiceReturnsBlankAppError.ErrorMessage);
        }
        let userClaims = JSON.parse(userClaimsSessionStorage);
        if (CommonUtils.isNullOrEmpty(appId))
            return userClaims.Applications;

        if (!(userClaims.Applications) || Object.keys(userClaims.Applications).indexOf(appId) < 0 && Object.keys(userClaims.Applications)) {
            self.fxplogger.logError(self.classNameUserClaimsService, self.rootScope.fxpUIConstants.UIMessages.AuthServiceReturnsBlankAppError.ErrorMessageTitle, "2610", null);
            throw new Error(self.rootScope.fxpUIConstants.UIMessages.AuthServiceReturnsBlankAppError.ErrorMessage);
        }

        let application = userClaims.Applications[appId];

        if (application.Roles === undefined || Object.keys(application.Roles).length === 0) {
            self.fxplogger.logError(self.classNameUserClaimsService, self.rootScope.fxpUIConstants.UIMessages.AuthServiceReturnsBlankAppRoleError.ErrorMessageTitle, "2611", null);
            throw new Error(self.rootScope.fxpUIConstants.UIMessages.AuthServiceReturnsBlankAppRoleError.ErrorMessage);
        }
        return application;
    }

    /**
    * Gets tenant claims of the user based on alias and tenantId
    * @method Fxp.Services.UserProfileService.getUserTenatClaimsByAlias
    * @param {string } alias user alias information
    * @param {string } tenantId tenant id
    * @example <caption> Example to invoke getUserTenatClaimsByAlias</caption>
    *  UserClaimsService.getUserTenatClaimsByAlias('oneProfile');
    */
    private getUserTenatClaimsByAlias(alias: string, tenantId?: string): any {
        let self = this;
        let claimsSessionStorage = sessionStorage[FxpConstants.CONST.fxpUserClaimsSession + "_" + alias];

        if (CommonUtils.isNullOrEmpty(claimsSessionStorage)) {
            self.fxplogger.logError(self.classNameUserClaimsService, self.rootScope.fxpUIConstants.UIMessages.AuthServiceReturnsBlankAppError.ErrorMessageTitle, "2606", null);
            throw new Error(self.rootScope.fxpUIConstants.UIMessages.AuthServiceReturnsBlankAppError.ErrorMessage);
        }
        let cliamsData = JSON.parse(claimsSessionStorage);
        if (CommonUtils.isNullOrEmpty(tenantId))
            return cliamsData.tenantClaims;

        if (Object.keys(cliamsData.tenantClaims).indexOf(tenantId) < 0) {
            self.fxplogger.logError(self.classNameUserClaimsService, self.rootScope.fxpUIConstants.UIMessages.AuthServiceReturnsBlankAppError.ErrorMessageTitle, "2610", null);
            throw new Error(self.rootScope.fxpUIConstants.UIMessages.AuthServiceReturnsBlankAppError.ErrorMessage);
        }
        let tenant = cliamsData.tenantClaims[tenantId];
        if (tenant.claims === undefined || Object.keys(tenant.claims).length === 0) {
            self.fxplogger.logError(self.classNameUserClaimsService, self.rootScope.fxpUIConstants.UIMessages.AuthServiceReturnsBlankAppRoleError.ErrorMessageTitle, "2611", null);
            throw new Error(self.rootScope.fxpUIConstants.UIMessages.AuthServiceReturnsBlankAppRoleError.ErrorMessage);
        }

        return tenant;
    }

    /**
     * this method used get get tenant claims
     * @method Fxp.Services.UserProfileService.getTenatClaimsSvc
     * @param {string} alias it contains user alias information
     * @example <caption> Example to invoke getTenatClaimsSvc</caption>
     * UserClaimsService.getTenatClaimsSvc(alias);
     */
    getTenatClaimsSvc(alias, parentDeferred?: any) {
        let self = this;
        if (this.tenantClaimsApiEndpoint) {
            let url = this.tenantClaimsApiEndpoint + '/User/' + alias + '/claims';
            return (window["tenantConfiguration"].AuthStore && window["tenantConfiguration"].AuthStore.TenantClaimsHeaders) ?
                this.http.get(url, { headers: window["tenantConfiguration"].AuthStore.TenantClaimsHeaders }) : this.http.get(url);
        } else {
            //returning empty claims if auth api endpoint is not configured
            let defer = self.q.defer();
            defer.resolve({ data: { tenantClaims: {} } });
            return defer.promise;
        }
    }

    /**
     * Gets user claims by connecting to the service through the url  
     * @method Fxp.Services.UserProfileService.getUserClaimsSvc        
     * @example <caption> Example to invoke getUserClaimsSvc</caption>
     *  UserClaimsService.getUserClaimsSvc();
     */
    getUserClaimsSvc(alias: string, parentDeferred?: any): angular.IPromise<any> {
        let self = this;
        let deferred = parentDeferred || self.q.defer();
        let sendDate, receiveDate, responseTime;
        let rootScope = self.rootScope;
        let fxpConstants = self.fxpConstants;
        let url: string;
        self.currentUserAlias = alias;
        if (self.claimsApiEndpoint) {
            if (this.isObo())
                url = self.claimsApiEndpoint + '/userclaims?alias=' + alias;
            else
                url = self.claimsApiEndpoint + '/claim/';

            this.fxplogger.startTrackPerformance(PerfMarkers.GetUserClaims);
            if (self.adalLoginHelperService.accessTokenRequestInProgress(url)) {
                self.iReqCount++;
                if (self.iReqCount == 5) {
                    self.fxplogger.logError(self.classNameUserClaimsService, self.rootScope.fxpUIConstants.UIMessages.AADAuthFailureError.ErrorMessageTitle, "2603", null);
                    self.fxpMessageSvc.addMessage(self.rootScope.fxpUIConstants.UIMessages.AADAuthFailureError.ErrorMessage, FxpConstants.messageType.error);
                }
                self.timeout(function () {
                    self.getUserClaimsSvc(alias);
                }, self.sleepInterval);
            }
            else {
                this.iReqCount = 0;
                this.fxplogger.logInformation('Fxp.UserProfile', "GetUserClaimsSvc");
                //self.userInfoService.setCurrentUserUpn(claimData.Upn);
                return this.http.get(url);
            }
            self.fxplogger.stopTrackPerformance(PerfMarkers.GetUserClaims);
        } else {
            //returning empty claims if profile api is not configured
            deferred.resolve({ data: { "Applications": {} } });
        }
        return deferred.promise;
    }

    /**
     * this method used get user claims and tenant cliams based on user alias
     * @method Fxp.Services.UserClaimsService.getCalimsSvc
     * @param {string} alias it contains user alias info
     * @example <caption> Example to invoke getCalimsSvc</caption>
     * UserClaimsService.getCalimsSvc(alias);
     */
    getCalimsSvc(alias?: string): angular.IPromise<any> {
        let self = this;
        alias = alias || self.userInfoService.getCurrentUser();
        let deferred = self.q.defer();
        let sendDate, receiveDate, responseTime, userClaimsSendDate;
        sendDate = new Date();
        self.fxplogger.logInformation(self.classNameUserClaimsService, "getUserClaimsSvc() Started");

        if (sessionStorage[FxpConstants.CONST.fxpUserClaimsSession + "_" + alias]) {
            let claimData = JSON.parse(sessionStorage[FxpConstants.CONST.fxpUserClaimsSession + "_" + alias]);
            self.setUserInfo(claimData);
            self.fxplogger.logInformation(self.classNameUserClaimsService, "claims data is fetching from sessionStorage");
            self.timeout(function () {
                deferred.resolve(claimData);
            }, self.sleepInterval);
            return deferred.promise;
        }
        else {
            let appCliams = {}, userClaims = {};
            let appClaimsPromise = self.getTenatClaimsSvc(alias)
                .then(function (tResponse) {
                    appCliams = tResponse["data"];
                    self.setUserInfo(appCliams);
                    self.logTenantClaimsMetrics(sendDate);
                    if (Object.keys(appCliams["tenantClaims"]).length === 0) {
                        self.fxplogger.logError(self.classNameUserClaimsService, self.rootScope.fxpUIConstants.UIMessages.AuthServiceReturnsBlankAppRoleError.ErrorMessageTitle, "2611", null);
                    }
                });
            let userClaimsSendDate = new Date();
            let userClaimsPromise = self.getUserClaimsSvc(alias, deferred).then(function (cResponce) {
                userClaims = cResponce.data;
                self.logUserClaimsMetrics(userClaimsSendDate);
            });

            this.q.all([appClaimsPromise, userClaimsPromise]).then(function () {
                appCliams["defaultAppRole"] = self.getDefaultAppRole(appCliams["tenantClaims"]);
                appCliams["Applications"] = userClaims["Applications"];
                self.saveClaimsData(alias, appCliams);
                deferred.resolve(appCliams);
            }, function (err) {
                self.logClaimsException(err, sendDate);
                if (window["tenantConfiguration"].IsAuthorizationRequired)
                    deferred.reject(err);
                else {
                    appCliams["defaultAppRole"] = self.getDefaultAppRole(null);
                    self.saveClaimsData(alias, appCliams);
                    deferred.resolve(appCliams);
                }
            });

            return deferred.promise;
        }

    }

    /**
    * this method is used to save claims data into session storage
    * @method Fxp.Services.UserClaimsService.setUserInfo
    * @param {string} alias user alias
    * @param {Object} claimsData it contains claims data 
    * @example <caption> Example to invoke saveClaimsData</caption>
    *  UserClaimsService.saveClaimsData(alias, claimsData, sessionkey, contextkey);
    */
    private saveClaimsData(alias, claimsData): void {
        let strCalimsData = JSON.stringify(claimsData);
        sessionStorage[FxpConstants.CONST.fxpUserClaimsSession + "_" + alias] = strCalimsData;
        this.fxpcontext.saveContext(alias + '-' + ApplicationConstants.UserClaims, strCalimsData);
    }

    /**
     * this method is used to log get user cliams api response metrics
     * @method Fxp.Services.UserClaimsService.logUserClaimsMetrics
     * @param {date} sendDate it contains user claims service intiate date and time
     * @example <caption> Example to invoke saveClaimsData</caption>
     * UserClaimsService.logUserClaimsMetrics(sendDate);
     */
    private logUserClaimsMetrics(sendDate): void {
        let self = this,
            propbag = self.fxplogger.createPropertyBag(),
            receiveDate = new Date(),
            responseTime = receiveDate.getTime() - sendDate.getTime(); // in millisecs 

        propbag.addToBag(FxpConstants.metricConstants.StartTime, sendDate.toUTCString());
        propbag.addToBag(FxpConstants.metricConstants.EndTime, receiveDate.toUTCString());
        propbag.addToBag(FxpConstants.metricConstants.ServiceName, FxpConstants.metricConstants.GetBasicProfileSvcName);


        self.fxplogger.logMetric(FxpConstants.metricConstants.GetUserClaimsSvcName, "UserClaimsResponseTime", responseTime, propbag);
        self.fxplogger.logInformation(self.classNameUserClaimsService, "getUserClaimsSvc() End");
    }

    /**
     * this method is used to log get tenant cliams api response metrics
     * @method Fxp.Services.UserClaimsService.logTenantClaimsMetrics
     * @param {date}sendDate it contains user claims service intiate date and time
     * @example <caption> Example to invoke logTenantClaimsMetrics</caption>
     * UserClaimsService.logTenantClaimsMetrics(sendDate);
     */
    private logTenantClaimsMetrics(sendDate): void {
        let self = this,
            propbag = self.fxplogger.createPropertyBag(),
            receiveDate = new Date(),
            responseTime = receiveDate.getTime() - sendDate.getTime(); // in millisecs 

        propbag.addToBag(FxpConstants.metricConstants.StartTime, sendDate.toUTCString());
        propbag.addToBag(FxpConstants.metricConstants.EndTime, receiveDate.toUTCString());
        propbag.addToBag(FxpConstants.metricConstants.ServiceName, FxpConstants.metricConstants.GetBasicProfileSvcName);
        self.fxplogger.logMetric(FxpConstants.metricConstants.GetUserClaimsSvcName, "UserAppRolesResponseTime", responseTime, propbag);
        self.fxplogger.logInformation(self.classNameUserClaimsService, "getUserAppRolesSvc() End");
    }

    /**
     * this method is used to log exception details of user cliams api =
     * @method Fxp.Services.UserClaimsService.logUserClaimsException
     * @param {object} exception it contains exception details
     * @param {date} sendDate it contains user claims service intiate date and time
     * @example <caption> Example to invoke logUserClaimsException</caption>
     * UserClaimsService.logUserClaimsException(exception,sendDate);
     */
    private logClaimsException(exception, sendDate): void {
        let self = this, propbag = self.fxplogger.createPropertyBag(),
            receiveDate = new Date(),
            responseTime = receiveDate.getTime() - sendDate.getTime();
        propbag.addToBag(FxpConstants.metricConstants.Status, exception.status);
        propbag.addToBag(FxpConstants.metricConstants.StatusText, exception.statusText);
        propbag.addToBag(FxpConstants.metricConstants.ErrorUrl, exception.config ? exception.config.url : '');
        self.fxplogger.logError(FxpConstants.metricConstants.GetUserClaimsSvcName, self.rootScope.fxpUIConstants.UIMessages.AuthServiceReturnsBlankAppError.ErrorMessageTitle, "2601", "", propbag);
        propbag.addToBag(FxpConstants.metricConstants.StartTime, sendDate.toUTCString());
        propbag.addToBag(FxpConstants.metricConstants.EndTime, receiveDate.toUTCString());
        propbag.addToBag(FxpConstants.metricConstants.ServiceName, FxpConstants.metricConstants.GetUserClaimsSvcName);
        self.fxplogger.logMetric(FxpConstants.metricConstants.GetUserClaimsSvcName, "UserClaimsResponseTime - Error", responseTime, propbag);
        if (window["tenantConfiguration"].IsAuthorizationRequired)
            self.fxpMessageSvc.addMessage(self.rootScope.fxpUIConstants.UIMessages.AuthzServiceReturnsError.ErrorMessage, FxpConstants.messageType.error);

    }



    /**
     * this method is used to get is Acting On Behalf Of is activate
     * @example <caption> Example to invoke logTenantClaimsException</caption>
     * UserClaimsService.isObo();
     */
    private isObo(): boolean {
        return this.userInfoService.isActingOnBehalfOf();
    }

    /**
    * this method is used to set the Upn and AAD Object ID for the Resepective users
    * @method Fxp.Services.UserClaimsService.setUserInfo
    * @param {claimsData } claimsData user cliams
    * @example <caption> Example to invoke setUserInfo</caption>
    *  UserClaimsService.setUserInfo(claimsData);
    */
    private setUserInfo(claimsData): void {
        let self = this;
        this.userInfoService.setCurrentUserUpn(claimsData.upn);
        self.userInfoService.setAADObjectID(claimsData.aadObjectID);
        if (!self.userInfoService.isActingOnBehalfOf()) {
            self.userInfoService.setLoggedInUserUpn(claimsData.alias);
        }
    }

    /**
    * intializing current user alias
    * @method Fxp.Services.UserClaimsService.setCurrentUser
    * @param {string } alias it contains user alias
    * @example <caption> Example to invoke setCurrentUser</caption>
    * UserClaimsService.setCurrentUser(alias);
    */
    setCurrentUser(alias: string) {
        this.userAlias = alias;
        this.currentUserAlias = alias;
    }

    getUserRoles(alias?: string) {
        let self = this;
        let deferred = self.q.defer();
        let listOfRoles = [];
        alias = alias || self.userInfoService.getCurrentUser();
        try {
            self.getCalimsSvc(alias)
                .then(function (response) {
                    let result = response;
                    if (result.Applications) {
                        _.each(result.Applications, function (app) {
                            var appName = app.ApplicationName;
                            _.each(app.Roles, function (role) {
                                listOfRoles.push(appName + "." + role.RoleName);
                            })
                        });
                    }
                    if (result.tenantClaims) {
                        for (let npd in result.tenantClaims) {
                            _.each(result.tenantClaims[npd].claims.roles, function (role) {
                                listOfRoles.push(role.roleName);
                            });
                        }
                    }
                    if (listOfRoles.length == 0) {
                        //adding dummy app role if user dont have app roles
                        listOfRoles.push(window["tenantConfiguration"].DefaultAppRole);
                    }
                    deferred.resolve(listOfRoles);
                });
        }
        catch (ex) {
            deferred.reject(ex);
            self.fxpMessageSvc.addMessage(self.rootScope.fxpUIConstants.UIMessages.SelectedProfileRoles.ErrorMessage, FxpConstants.messageType.error);
        }
        return deferred.promise;

    }

    /**
     * userd to get user resources list
     * @method Fxp.Services.UserClaimsService.getUserResources
     * @param {string } alias it contains user alias
     * @example <caption> Example to invoke getUserResources</caption>
     * UserClaimsService.getUserResources(alias);
     * 
     */
    getUserResources(alias?: string) {
        let self = this;
        let listOfResources = [];
        alias = alias || self.userInfoService.getCurrentUser();
        try {
            let result = self.getUserTenatClaimsByAlias(alias);
            if (result) {
                for (let npd in result) {
                    _.each(result[npd].claims.resourcePermissions, function (item) {
                        listOfResources.push(item.resource);
                    });
                }
            }
        }
        catch (ex) {
            self.fxpMessageSvc.addMessage(self.rootScope.fxpUIConstants.UIMessages.SelectedProfileRoles.ErrorMessage, FxpConstants.messageType.error);
        }
        return listOfResources;
    }

    getDefaultAppRole(lstClaims) {
        let appRole;
        if (lstClaims) {
            var tenantClaims = lstClaims[window["tenantConfiguration"].NPD];
            var prefix = window["tenantConfiguration"].TenantId;
            _.each(tenantClaims.claims.roles, function (role) {
                if (role.isDefaultRole) {
                    appRole = prefix + "." + role.roleName;
                }
            });
        }
        return (appRole) ? appRole : window["tenantConfiguration"].DefaultAppRole;
    }
}