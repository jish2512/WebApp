import { IRootScope } from "../interfaces/IRootScope";
import { ILogger } from "../interfaces/ILogger";
import { AdalLoginHelperService } from "./AdalLoginHelperService";
import { FxpConstants, PerfMarkers, ApplicationConstants } from "../common/ApplicationConstants";
import { FxpMessageService } from "./FxpMessageService";
import { FxpConfigurationService } from "./FxpConfiguration";
import { UserClaimsService } from "./UserClaimsService"
import { UserInfoService } from "./UserInfoService";
import * as _ from "underscore";

/**
 * @application  Fxp
 */
/**
 * @module Fxp.Services
 */

export class AdminLandingService {
	private http: angular.IHttpService;
	private q: angular.IQService;
	private rootScope: IRootScope;
	private timeout: angular.ITimeoutService;
	private sleepInterval: number;
	private userAlias: string;
	private fxpConfiguration: FxpConfigurationService;
	private fxplogger: ILogger;
	private fxpServiceEndPoint: string;
	private adalLoginHelperService: AdalLoginHelperService;
	private iCount: number = 0;
	private iReqCount: number = 0;
	private iUCount: number = 0;
	private classNameLeftNavAdminService = "Fxp.AdminLandingService";
	private fxpMessageSvc: FxpMessageService;

	constructor($http: angular.IHttpService, $q: angular.IQService, $rootScope: IRootScope, $timeout: angular.ITimeoutService, fxpConfiguration: FxpConfigurationService, loggerService: ILogger, adalLoginHelperService: AdalLoginHelperService, fxpMessage: FxpMessageService, private userClaimsService: UserClaimsService,private userInfoService: UserInfoService,private $base64: any) {
		this.http = $http;
		this.q = $q;
		this.rootScope = $rootScope;
		this.timeout = $timeout;
		this.sleepInterval = 100;
		this.fxpConfiguration = fxpConfiguration;
		this.fxplogger = loggerService;
		this.fxpServiceEndPoint = this.fxpConfiguration.FxpAppSettings.FxpServiceEndPoint;
		this.adalLoginHelperService = adalLoginHelperService;
		this.fxpMessageSvc = fxpMessage;
	}

	GetAdminDataFromServer(): angular.IPromise<any> {
		var deferred = this.q.defer();
		var self = this;
		self.userClaimsService.getUserRoles()
			.then(function (response) {
				let userResouces=self.userClaimsService.getUserResources();
				let userRoles = self.$base64.encode(response).toString(); 
                let encodedUserResources= self.$base64.encode(userResouces).toString(); 
				var url = self.fxpServiceEndPoint + "/adminTiles/";
				self.fxplogger.startTrackPerformance(PerfMarkers.GetAdminDataFromServer);
				if (self.adalLoginHelperService.accessTokenRequestInProgress(url)) {
					self.iReqCount++;
					if (self.iReqCount == 5) {
						self.fxplogger.logError(self.classNameLeftNavAdminService, self.rootScope.fxpUIConstants.UIMessages.GetAdminDataFailureError.ErrorMessageTitle, "2701", null);
						self.fxpMessageSvc.addMessage(self.rootScope.fxpUIConstants.UIMessages.GetAdminDataAuthFailureError.ErrorMessage, FxpConstants.messageType.error);
					}
					self.timeout(function () {
						self.GetAdminDataFromServer();
					}, self.sleepInterval);
				}
				else {
					self.iReqCount = 0;
					self.fxplogger.logInformation(self.classNameLeftNavAdminService, "getAdminDataFromServer");

					let requestHeaders = {};
					requestHeaders[ApplicationConstants.XUserClaimsToken] = userRoles;
					requestHeaders[ApplicationConstants.XTenantId] = window["tenantConfiguration"].TenantId;
					requestHeaders[ApplicationConstants.XResources]=encodedUserResources;
					self.http({
						method: "GET",
						url: url,
						headers: requestHeaders
					}).then(function (response) {
						var data = JSON.stringify(response.data);
						var sessionStorageKey = ApplicationConstants.FxpAdminData + "_" + self.userInfoService.getCurrentUser();

						sessionStorage[sessionStorageKey] = data;

						deferred.resolve(response);
					}, function (error) {
						deferred.reject(error);
					});
				}
			});
		self.fxplogger.stopTrackPerformance(PerfMarkers.GetAdminDataFromServer);

		return deferred.promise;
	}

	GetAdminTileDetails(isRefresh: boolean): angular.IPromise<any> {
		var deferred = this.q.defer();
		var self = this;
		var adminTilesData;
		if (isRefresh == false) {
			adminTilesData = self.GetAdminDataFromCache();
		}
		if (adminTilesData == null) {
			self.GetAdminDataFromServer().then(function (response) {
				deferred.resolve(response.data);
			}, function (error) {
				deferred.reject(error);
			});
		} else {
			deferred.resolve(adminTilesData);
		}

		return deferred.promise;
	}

	GetAdminDataFromCache(): any {
		var self = this;
		var sessionStorageKey = ApplicationConstants.FxpAdminData + "_" + self.userInfoService.getCurrentUser();

		var adminData = JSON.parse(window.sessionStorage.getItem(sessionStorageKey));
		return adminData;

	}

}