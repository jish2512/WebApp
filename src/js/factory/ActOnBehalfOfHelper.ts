import { IRootScope } from "../interfaces/IRootScope";
import { UserProfileService } from "../services/userProfileService";
import { FxpMessageService } from "../services/FxpMessageService";
import { ILogger } from "../interfaces/ILogger";
import { FxpConstants, ApplicationConstants } from "../common/ApplicationConstants";
import { IFxpContext } from "../interfaces/IFxpContext";
import { TelemetryContext } from "../telemetry/telemetrycontext";
import { UserInfoService } from "../services/UserInfoService";
import { LogPropertyBag } from "../telemetry/LogPropertyBag";

export class ActOnBehalfOfHelper {
	private $http: angular.IHttpService;
	private $rootScope: IRootScope;
	private $q: angular.IQService;
	private userProfileService: UserProfileService;
	private fxpLoggerService: ILogger;
	private fxpMessage: FxpMessageService;
	private adalAuthenticationService: adal.AdalAuthenticationService;
	private fxpConstants: FxpConstants;
	private fxpContext: IFxpContext;
	private fxpErrorConstants: any;
	private fxpTelemetryContext: TelemetryContext
	private userInfoService: UserInfoService;

	constructor($rootScope: IRootScope, $http: angular.IHttpService, $q: angular.IQService, userProfileService: UserProfileService, fxpLoggerService: ILogger, fxpMessage: FxpMessageService, adalAuthenticationService: adal.AdalAuthenticationService, fxpContextService: IFxpContext,
		fxpTelemetryContext: TelemetryContext, userInfoService: UserInfoService) {
		this.fxpErrorConstants = $rootScope.fxpUIConstants.UIMessages;
		this.$rootScope = $rootScope;
		this.$http = $http;
		this.$q = $q;
		this.userProfileService = userProfileService;
		this.fxpLoggerService = fxpLoggerService;
		this.fxpMessage = fxpMessage;
		this.adalAuthenticationService = adalAuthenticationService;
		this.fxpConstants = FxpConstants;
		this.fxpContext = fxpContextService;
		this.fxpTelemetryContext = fxpTelemetryContext;
		this.userInfoService = userInfoService;
	}

	getUserProfileAndClaims(oboUserProfile: any): angular.IPromise<any> {
		var self = this;
		var deferred = self.$q.defer();
		try {
			if (oboUserProfile) {
				var alias = oboUserProfile.Alias;

				self.userProfileService.getBasicProfile(alias, true).then(function (oboUserInfo) {
					self.userProfileService.setCurrentUser(alias);
					self.fxpLoggerService.setOBOUserContext(oboUserInfo.roleGroupId, oboUserInfo.roleGroupName, self.userProfileService.isObo(), oboUserInfo.TenantKey, oboUserInfo.TenantName);
					self.userProfileService.getCalimsSvc(alias).then(function (claimasData) {
						deferred.resolve(oboUserInfo);
					}).catch(function (error) {
						deferred.reject(error);
					});

				}).catch(function (response) {
					self.fxpMessage.addMessage(self.fxpErrorConstants.SelectedUserProfileInformation.ErrorMessage, FxpConstants.messageType.error);
					deferred.reject(response);
				});
			}
		}
		catch (e) {
			self.fxpMessage.addMessage(self.fxpErrorConstants.SelectedUserProfileInformation.ErrorMessage, FxpConstants.messageType.error);
		}

		return deferred.promise;
	}

	getObOUserConfiguration(appRole: string): angular.IHttpPromise<any> {
		var self = this; 
		if (appRole) { 
			return self.$http({
				method: 'GET',
				url: ApplicationConstants.PersonaConfigByRoleGroupId + '/'+appRole
			});
		}
		else {
			console.log("App Role is not available for selected user");
		}
	}

	getPropBag(): LogPropertyBag {
		var self = this;
		var propbag = self.fxpLoggerService.createPropertyBag();
		propbag.addToBag(FxpConstants.metricConstants.UserAgent, navigator.userAgent);
		propbag.addToBag(FxpConstants.metricConstants.SessionId, window["sessionId"]);
		propbag.addToBag(FxpConstants.metricConstants.UserUPN, self.adalAuthenticationService.userInfo.userName);
		propbag.addToBag(FxpConstants.metricConstants.Geography, self.fxpTelemetryContext.getGeography());
		return propbag;
	}

	getMetricPropBag(startDate: Date, endDate: Date): LogPropertyBag {
		var self = this;
		var propbag = self.fxpLoggerService.createPropertyBag();
		propbag.addToBag(FxpConstants.metricConstants.StartTime, startDate.toUTCString());
		propbag.addToBag(FxpConstants.metricConstants.EndTime, endDate.toUTCString());
		propbag.addToBag(FxpConstants.metricConstants.ServiceName, FxpConstants.metricConstants.searchProfileSvcName);
		propbag.addToBag(FxpConstants.metricConstants.UserAgent, navigator.userAgent);
		propbag.addToBag(FxpConstants.metricConstants.SessionId, self.$rootScope.sessionId);
		propbag.addToBag(FxpConstants.metricConstants.UserUPN, self.adalAuthenticationService.userInfo.userName);
		propbag.addToBag(FxpConstants.metricConstants.Geography, self.fxpTelemetryContext.getGeography());
		return propbag;
	}

	static ActOnBehalfOfHelperFactory($rootScope, $http, $q, userProfileService, fxpLoggerService, fxpMessage, adalAuthenticationService, fxpContextService, fxpTelemetryContext, userInfoService) {
		return new ActOnBehalfOfHelper($rootScope, $http, $q, userProfileService, fxpLoggerService, fxpMessage, adalAuthenticationService, fxpContextService, fxpTelemetryContext, userInfoService);
	}
}
