/**
 * @application  Fxp
 */
/**
 * @module Fxp.Controllers
 */
declare var powerbi: any;
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
import { AdalLoginHelperService } from "../services/AdalLoginHelperService";
/**
    * This is page controller to render Power BI pages within FXP through configuration.
    * @class Fxp.Controllers.PowerBiPageController
    * @classdesc Page controller for Power BI dashboards
    * @example <caption> 
    *  //To render Power BI dashboards, configure  route with below route config:
    *  "RouteConfig": "{\"url\":\"/PowerBi\",\"templateUrl\":\"/templates/powerBi.html\",\"controller\":\"PowerBiPageController\",\"requireADLogin\":\"true\"}",
    */
export class PowerBiPageController {
	private $stateParams;
	private $scope: angular.IScope;
	private fxpLoggerService: ILogger;
	private fxpMessage: FxpMessageService;
	private fxpConstants: FxpConstants;
	private fxpRouteService: FxpRouteService;
	private adalLoginHelperService: AdalLoginHelperService;
	private http: any; //todo:use angular dt
	private stateParams: any; //todo:use angular dt 
	private powerBITokenURL: string = "https://api.powerbi.com";
	private powerBIBaseURL: string = "https://api.powerbi.com/beta/myorg/dashboards";   //Move this to config or pick dynamically based on the endpoint.
	private powerBIDashboardAPI: string = "https://app.powerbi.com/dashboardEmbed?dashboardId=<DBID>&groupId=<GID>";
	private window;
	private rootScope: IRootScope;
	private pageLoaderService: PageLoaderService;
	private dashboardId: string;
	private groupId: string;
	private fxpUIStrings: any;
	private powerBiAdalLogin: any;
	private $timeout: any;

	//private powerBIDashboardAPI: any;
	private pageLoadStartTime: any;

	constructor($scope: angular.IScope, $rootScope,
		$stateParams,
		$http,
		$timeout: any,
		fxpLoggerService: ILogger,
		fxpMessage: FxpMessageService,
		adalLoginHelperService: AdalLoginHelperService,
		pageLoaderService: PageLoaderService,
		userInfoService: UserInfoService) {

		//Initialize private vars
		var self = this;
		self.$scope = $scope;
		self.rootScope = $rootScope;
		self.http = $http;
		self.$timeout = $timeout;
		self.fxpMessage = fxpMessage;
		self.adalLoginHelperService = adalLoginHelperService;
		self.fxpConstants = FxpConstants;

		self.fxpLoggerService = fxpLoggerService;
		self.fxpUIStrings = self.rootScope.fxpUIConstants.UIStrings;
		self.dashboardId = $stateParams.dashboardId;
		self.groupId = $stateParams.groupId;
		self.pageLoadStartTime = performance.now();
		if (userInfoService.isActingOnBehalfOf()) {
			fxpMessage.addMessage(self.fxpUIStrings.PowerBiPageStrings.OBOError, FxpConstants.messageType.info, true);
			self.logPageLoadMetric();
		}
		else {
			pageLoaderService.fnShowPageLoader(self.fxpUIStrings.PowerBiPageStrings.LoadingDashboard);

			if (self.dashboardId != null && self.groupId != null) {
				//get ADAL token
				self.http.get(self.powerBIBaseURL).then(function () {
					try {
						//Form the URL
						self.powerBIDashboardAPI = self.powerBIDashboardAPI.replace("<DBID>", self.dashboardId).replace("<GID>", self.groupId);

						var accessTok = adalLoginHelperService.getCachedToken(self.powerBITokenURL);
						self.powerBiAdalLogin = accessTok;

						var config = {
							type: 'dashboard',
							accessToken: accessTok,
							embedUrl: self.powerBIDashboardAPI
						};

						var dashboardContainer = document.getElementById('dashboardContainer');
						var dashboard = powerbi.embed(dashboardContainer, config);
						var dashboardContainerIframe = angular.element(document.querySelector('#dashboardContainer iframe'));

						var hideLoader = function () {
							self.$timeout(function () {
								pageLoaderService.fnHidePageLoader();
							});
						};

						dashboard.on("loaded", function (event) {
							self.logPageLoadMetric();
						});

						dashboardContainerIframe.on('load', hideLoader);

						self.$scope.$on('$destroy', function () {
							dashboardContainerIframe.off('load', hideLoader)
						});

						dashboard.on("error", function (event) {
							fxpMessage.addMessage(self.fxpUIStrings.PowerBiPageStrings.DashboardRenderError, FxpConstants.messageType.error);
							pageLoaderService.fnHidePageLoader();
						});

						dashboard.on("tileClicked", function (event) {
							var dashboardContainer = document.getElementById('dashboardContainer');
							dashboardContainer.innerHTML = '';  //Reset the DOM to avoid side effects

							//Create iFrame element
							var iframe = document.createElement('iframe');
							iframe.id = "iFrameEmbedReport";
							iframe.width = "100%";
							iframe.height = "100%";
							iframe.setAttribute("src", event.detail.reportEmbedUrl);
							dashboardContainer.appendChild(iframe);
							iframe.addEventListener("load", function () {
								try {
									var accessTok = self.adalLoginHelperService.getCachedToken(self.powerBITokenURL);
									var m = {
										action: "loadReport",
										accessToken: accessTok
									};
									var message = JSON.stringify(m);
									var ifr: any = document.getElementById('iFrameEmbedReport');
									ifr.contentWindow.postMessage(message, "*");;
								}
								catch (ex) {
									//suppressing the message as of now.
								}
							});
						});

					}
					catch (ex) {
						fxpMessage.addMessage(self.fxpUIStrings.PowerBiPageStrings.DashboardRenderError, FxpConstants.messageType.error);
						self.logError(self.fxpUIStrings.PowerBiPageStrings.DashboardRenderError, 2913);
						self.logPageLoadMetric();
						pageLoaderService.fnHidePageLoader();
					}
				}, function errorCallback(response) {
					fxpMessage.addMessage(self.fxpUIStrings.PowerBiPageStrings.DashboardRenderError, FxpConstants.messageType.error);
					self.logError(self.fxpUIStrings.PowerBiPageStrings.TokenFetchError, 2914);
					self.logPageLoadMetric();
					pageLoaderService.fnHidePageLoader();
				});
			}
			else {
				fxpMessage.addMessage(self.fxpUIStrings.PowerBiPageStrings.DashboardRenderError, FxpConstants.messageType.error);
				self.logError(self.fxpUIStrings.PowerBiPageStrings.ConfigError, 2915);
				pageLoaderService.fnHidePageLoader();
				self.logPageLoadMetric();
			}
		}
	}

	logError(errorMessage: string, errorCode: number): void {
		var props = this.fxpLoggerService.createPropertyBag();
		props.addToBag("PowerBiGroupId", this.groupId);
		props.addToBag("PowerBiDashboardId", this.dashboardId);
		this.fxpLoggerService.logError("FXP.Client.PowerBIPage", errorMessage, errorCode.toString(), null, props);
	}

	logPageLoadMetric(): void {
		var pageLoadEndTime = performance.now();
		var pageLoadDuration = pageLoadEndTime - this.pageLoadStartTime;
		this.fxpLoggerService.logPageLoadMetrics(pageLoadDuration);
	}
}

PowerBiPageController.$inject = ['$scope', '$rootScope', '$stateParams', '$http', '$timeout', 'FxpLoggerService', 'FxpMessageService', 'AdalLoginHelperService', 'PageLoaderService', 'UserInfoService'];