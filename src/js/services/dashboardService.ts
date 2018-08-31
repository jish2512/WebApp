import { IRootScope } from "../interfaces/IRootScope";
import { ILogger } from "../interfaces/ILogger";
import { FxpContext } from "../context/FxpContext";
import { AdalLoginHelperService } from "./AdalLoginHelperService";
import { FxpConstants, ApplicationConstants, PerfMarkers } from "../common/ApplicationConstants";
import { TelemetryContext } from "../telemetry/telemetrycontext";
import { FxpLogHelper } from "../telemetry/FxpLogHelper";
import { FxpConfigurationService } from "./FxpConfiguration";
import { FxpMessageService } from "./FxpMessageService";
import { UserInfoService } from "./UserInfoService";
import { PageLoaderService } from "./pageLoaderService";
import { UserProfileService } from "./userProfileService";

/**
 * @application  Fxp
 */
/**
 * @module Fxp.Services
 */
/**
  * A service to connect to dashboard service to fetch the leftnav data of the user
  * @class Fxp.Services.DashboardService
  * @classdesc A service to connect to dashaboard service to fetch the leftnav data 
  * @example <caption> Example to create an instance of dashboard service</caption>         
  *  //Initializing DashboardService
  *  angular.module('FxPApp').controller('LeftNavController', ['DashboardService', LeftNavController]);
  *  function LeftNavController(dashboardService){ dashboardService.getLeftNavData(userAlias,roleGroupId); }
  */
declare type IStateService = any;

export class DashboardService {
	private http: angular.IHttpService;
	private q: angular.IQService;
	private rootScope: IRootScope;
	private fxpConfiguration: FxpConfigurationService;
	private timeout: angular.ITimeoutService;
	private sleepInterval: number;
	private fxplogger: ILogger;
	private adalLoginHelperService: AdalLoginHelperService;
	private userAlias: string;
	private fxpMessageSvc: FxpMessageService;
	private userInfoService: UserInfoService;
	private pageLoaderService: PageLoaderService;
	private fxpConstants: FxpConstants;
	private fxpTelemetryContext: TelemetryContext;
	private userProfileService: UserProfileService;
	private iCount: number = 0;
	private iReqCount: number = 0;
	private iUCount: number = 0;
	private fxpServiceEndPoint: string;
	private classNameDashboardService = "Fxp.DashboardService";
	private static _instance: DashboardService;


	constructor($http: angular.IHttpService, $q: angular.IQService, $rootScope: IRootScope, fxpConfiguration: FxpConfigurationService, $timeout: angular.ITimeoutService, loggerService: ILogger, adalLoginHelperService: AdalLoginHelperService, fxpMessage: FxpMessageService, userInfoService: UserInfoService, pageLoaderService: PageLoaderService, fxpTelemetryContext: TelemetryContext, userProfileService: UserProfileService) {
		this.http = $http;
		this.q = $q;
		this.rootScope = $rootScope;
		this.timeout = $timeout;
		this.sleepInterval = 100;
		this.adalLoginHelperService = adalLoginHelperService;
		this.fxplogger = loggerService;
		this.fxpMessageSvc = fxpMessage;
		this.fxpTelemetryContext = fxpTelemetryContext;
		this.fxpConfiguration = fxpConfiguration;
		this.userInfoService = userInfoService;
		this.pageLoaderService = pageLoaderService;
		this.userProfileService = userProfileService;
		this.fxpServiceEndPoint = this.fxpConfiguration.FxpAppSettings.FxpServiceEndPoint;
		if (DashboardService._instance) {
			return DashboardService._instance;
		}
		DashboardService._instance = this;
	}
	/**
* Get the Leftnavigation data of the user
* @method Fxp.Services.DashboardService.getLeftNavData
* @param {tenantId } tenantId of the user.
* @param {userRoles } userRoles of the user.
* @example <caption> Example to invoke getLeftNavData</caption>
*  DashboardService.getLeftNavData(tenantId,userRoles);
*/
	getLeftNavData(tenantId: string, userRoles: string,userResources:string): angular.IPromise<any> {
		var deferred = this.q.defer();
		var url = this.fxpServiceEndPoint +  "/navigation";
		var self = this;
		this.fxplogger.startTrackPerformance(PerfMarkers.GetLeftNavData);
		if (self.adalLoginHelperService.accessTokenRequestInProgress(url)) {
			self.iReqCount++;
			if (self.iReqCount == 5) {
				self.fxplogger.logError(self.classNameDashboardService, self.rootScope.fxpUIConstants.UIMessages.GetLeftNavAuthFailureError.ErrorMessageTitle, "2603", null);
				self.fxpMessageSvc.addMessage(self.rootScope.fxpUIConstants.UIMessages.GetLeftNavAuthFailureError.ErrorMessage, FxpConstants.messageType.error);
			}
			self.timeout(function () {
				self.getLeftNavData(tenantId, userRoles,userResources);
			}, self.sleepInterval);
		}
		else {
			self.iReqCount = 0;
			self.fxplogger.logInformation(self.classNameDashboardService, "getLeftNavData");
			let requestHeaders = {};
			requestHeaders[ApplicationConstants.XUserClaimsToken] = userRoles;
			requestHeaders[ApplicationConstants.XTenantId]=tenantId; 
			requestHeaders[ApplicationConstants.XResources]=userResources;
			return this.http.get(url, {
				headers: requestHeaders 
			});
		}
		self.fxplogger.stopTrackPerformance(PerfMarkers.GetLeftNavData);
		return deferred.promise;
	}

	/**
	* Get the flat structure of Leftnavigation data
	* @method Fxp.Services.DashboardService.getGLNFlatDataStructure
	* @param {leftnavData } leftNavData leftnavigation data of the user.
	* @example <caption> Example to invoke getGLNFlatDataStructure</caption>
	*  DashboardService.getGLNFlatDataStructure();
	*/
	getGLNFlatDataStructure(leftNavData: any) {
		var list = new Array();
		for (var i = 0, L0length = leftNavData.length; i < L0length; i++) {
			if (leftNavData[i].hasChildren) {
				for (var j = 0, L1length = leftNavData[i].children.length; j < L1length; j++) {
					list.push(leftNavData[i].children[j]);
				}
			}
			else {
				list.push(leftNavData[i]);
			}
		}
		return list;
	}

	/**
	* Logging Telemetry Info and Display Error message when FxpUIConfiguration Fetching is Failed by RoleGroupId
	* @method Fxp.Services.DashboardService.fxpConfigurationFailed
	* @example <caption> Example to invoke fxpConfigurationFailed</caption>
	*  DashboardService.fxpConfigurationFailed();
	*/
	fxpConfigurationFailed(): void {
		var self = this;
		var userData = JSON.parse(sessionStorage[self.userInfoService.getCurrentUser() + "-userInfo"]);
		var propbag = self.fxplogger.createPropertyBag();
		propbag.addToBag(FxpConstants.metricConstants.SessionId, self.rootScope.sessionId);
		propbag.addToBag(FxpConstants.metricConstants.TimeStamp, FxpLogHelper.getTimeStamp());
		propbag.addToBag(FxpConstants.metricConstants.UserUPN, self.userInfoService.getCurrentUser());
		propbag.addToBag(FxpConstants.metricConstants.UserBusinessRole, userData.businessRole);
		propbag.addToBag(FxpConstants.metricConstants.UserRoleGroup, userData.roleGroupName);
		propbag.addToBag(FxpConstants.metricConstants.UserAgent, navigator.userAgent);
		propbag.addToBag(FxpConstants.metricConstants.Geography, self.fxpTelemetryContext.getGeography());
		self.fxplogger.logError(self.classNameDashboardService, self.rootScope.fxpUIConstants.UIMessages.UserRoleGroupFxpConfigNotFoundError.ErrorMessageTitle, "", "", propbag);
		self.fxpMessageSvc.addMessage(self.rootScope.fxpUIConstants.UIMessages.UserRoleGroupFxpConfigNotFoundError.ErrorMessage, FxpConstants.messageType.error);
		self.pageLoaderService.fnHidePageLoader();
	} 
}