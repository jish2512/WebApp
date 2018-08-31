import { ILogger } from "../interfaces/ILogger";
import { TelemetryContext } from "../telemetry/telemetrycontext";
import { FxpConstants } from "../common/ApplicationConstants";
import { UserInfoService } from "./UserInfoService";
import { UserProfileService } from "./userProfileService";
import { FxpBroadcastedEvents } from "./FxpBroadcastedEvents";

export class FxpFeedbackService {
	private fxplogger: ILogger;
	private userInfoService: UserInfoService;
	private fxpTelemetryContext: TelemetryContext;
	private userProfileService: UserProfileService;
	private rootscope: angular.IRootScopeService;
	private feedbackRouteData: any = {};
	private feedbackPropBag = {};
	private _feedbackItemCollection: any = [];
	private _userId: string = "";
	private _subscriprtionId: string = "";
	private _feedbackServiceEndpoint: string = "";
	private fxpFeedbackServiceClassName = "Fxp.FeedbackService";
	constructor(loggerService: ILogger, rootscope: angular.IRootScopeService, userInfoService: UserInfoService, fxpTelemetryContext: TelemetryContext, userProfileService: UserProfileService) {
		this.fxplogger = loggerService;
		this.userInfoService = userInfoService;
		this.rootscope = rootscope;
		this.fxpTelemetryContext = fxpTelemetryContext;
		this.userProfileService = userProfileService;
	}

	/**
	* sets setBrowserTitle of FeedbackService Context Object
	* @method  Fxp.Services.FxpFeedbackService.setBrowserTitle
	* @param {string} setBrowserTitle a  broser tab title.
	* @example <caption> Example to invoke setBrowserTitle</caption>
	*  FeedbackWidgetContextService.setBrowserTitle('xxxxxx');
	*/
	setBrowserTitle(browserTitle) {
		var self = this;
		if (browserTitle) {
			self.feedbackRouteData["BrowserPageTitle"] = browserTitle;
			self.addToFeedbackPropBag("BrowserPageTitle", browserTitle);
			self.rootscope.$broadcast(FxpBroadcastedEvents.OnFeedbackContextChanged);
		}
	};

	/**
	* sets setScreenRoute of  FeedbackService Context Object
	* @method Fxp.Services.FxpFeedbackService.setScreenRoute
	* @param {object} currentRoute a user navigated screen Route.
	* @example <caption> Example to invoke setScreenRoute</caption>
	*  Fxp.Services.FxpFeedbackService.setScreenRoute('xxxxxx');
	*/
	setScreenRoute(currentRoute) {
		var self = this;
		if (currentRoute) {
			self.feedbackRouteData["ScreenRoute"] = currentRoute;
			self.addToFeedbackPropBag("ScreenRoute", currentRoute);
			self.rootscope.$broadcast(FxpBroadcastedEvents.OnFeedbackContextChanged);
		}
	};

	/**
	* sets setFeedbackServiceProperties for FeedbackService Context Object
	* @method Fxp.Services.FxpFeedbackService.setFeedbackServiceProperties
	* @param {object } usersDetails a userdetail object having userName, BusinessRole.
	* @example <caption> Example to invoke setFeedbackServiceProperties</caption>
	*  Fxp.Services.FxpFeedbackService.setFeedbackServiceProperties();
	*/
	setFeedbackServiceProperties(usersDetails) {
		var self = this;
		self.removeFeedbackPropBagRange();
		self.addFeedbackPropBagRange(usersDetails);
		self.addFeedbackPropBagRange(self.getEnvironmentDetails());
		self.addFeedbackPropBagRange(self.feedbackRouteData);
		self.rootscope.$broadcast(FxpBroadcastedEvents.OnFeedbackContextChanged);
	}

	/**
	* get EnvironmentDetails for FeedbackService Context Object
	* @method Fxp.Services.FxpFeedbackService.getEnvironmentDetails
	* @example <caption> Example to invoke getEnvironmentDetails</caption>
	*  Fxp.Services.FxpFeedbackService.getEnvironmentDetails();
	*/
	getEnvironmentDetails(): any {
		var self = this;
		var feedbackEnvData = self.fxpTelemetryContext.getEnvironmentDetails(null);
		if (!feedbackEnvData)
			return;

		return {
			EnvironmentName: feedbackEnvData.EnvironmetName,
			Program: feedbackEnvData.Program,
			ServiceOffering: feedbackEnvData.ServiceOffering,
			ServiceLine: feedbackEnvData.ServiceLine
		}
	};

	/**
	* this method is used to accumulate  all application specific proprities for FeedbackComponent
	* @method Fxp.Services.FxpFeedbackService.setUserDetailsToFeedback
	* @example <caption> Example to invoke setUserDetailsToFeedback</caption>
	*  Fxp.Services.FxpFeedbackService.setUserDetailsToFeedback();
	*/
	setUserDetailsToFeedback(): void {
		var self = this, userDetails, oboUserBasicInfo;
		self.userProfileService.getBasicProfileByAlias(self.userInfoService.getLoggedInUser(), null).then(function (loginUserBasicInfo:any) {
			if (!loginUserBasicInfo)
				return

			userDetails =
				{
					UserId: self.userInfoService.getLoggedInUserUpn(),
					UserName: loginUserBasicInfo.fullName,
					BusinessRole: loginUserBasicInfo.businessRole,
					RoleGroupName: loginUserBasicInfo.roleGroupName
				}

			if (self.userInfoService.isActingOnBehalfOf()) {
				oboUserBasicInfo = self.userInfoService.getCurrentUserData();
				if (!oboUserBasicInfo)
					return

				userDetails.OBOUserUPN = self.userInfoService.getCurrentUserUpn();
				userDetails.OBOUserBusinessRole = oboUserBasicInfo.businessRole;
				userDetails.OBOUserRoleGroupName = oboUserBasicInfo.roleGroupName;
				userDetails.OBOUserName = oboUserBasicInfo.fullName;
			};

			self.setFeedbackServiceProperties(userDetails);
		});
	}

	/**
	* sets setUserId of  FeedbackService Context Object
	* @method Fxp.Services.FxpFeedbackService.setUserDetails
	* @param {string} UserID a Logged IN setUserDetails in Application.
	* @example <caption> Example to invoke setUserDetails</caption>
	*  FxpFeedbackService.setUserId('xxxxxx');
	*/
	setUserId = function (userId) {
		var self = this;
		self._userId = userId;
	};

	/**
	* getUserID of  FeedbackService Context Object
	* @method Feedback.FeedbackWidgetContextService.getUserID
	* @example <caption> Example to invoke getUserID</caption>
	*  FxpFeedbackService.getUserID();
	*/
	getUserID = function () {
		var self = this;
		return self._userId;
	};

	/**
	* sets setFeedbackItemCollection of  FeedbackWidget Context Object
	* @method  Fxp.Services.FxpFeedbackService.setFeedbackItemCollection
	* @param { any} ItemCollection a feedback dropdown item collection
	* @example <caption> Example to invoke setFeedbackItemCollection</caption>
	*  FxpFeedbackService.setFeedbackItemCollection('xxxxxx');
	*/
	setFeedbackItemCollection = function (itemCollection) {
		var self = this;
		self._feedbackItemCollection = itemCollection;
		self.rootscope.$broadcast(FxpBroadcastedEvents.OnFeedbackConfigurationChanged)
	};

	/**
	* get FeedbackItemCollection of  FeedbackService Context Object
	* @method  Fxp.Services.FxpFeedbackService.getFeedbackItemCollection
	* @example <caption> Example to invoke getFeedbackItemCollection</caption>
	*  FxpFeedbackService.getFeedbackItemCollection();
	*/
	getFeedbackItemCollection = function () {
		var self = this;
		return self._feedbackItemCollection;
	};

	/**
	* sets setFeedbackEndpoint of FeedbackService Context Object
	* @method  Fxp.Services.FxpFeedbackService.setFeedbackEndpoint
	* @param {string} endpoint a feedback API Endpoint.
	* @example <caption> Example to invoke setFeedbackEndpoint</caption>
	*  FxpFeedbackService.setFeedbackEndpoint('xxxxxx');
	*/
	setFeedbackEndpoint = function (endpoint) {
		var self = this;
		self._feedbackServiceEndpoint = endpoint;
		self.rootscope.$broadcast(FxpBroadcastedEvents.OnFeedbackConfigurationChanged)
	};
	/**
	* sets getFeedbackEndpoint of FeedbackService Context Object
	* @method  Fxp.Services.FxpFeedbackService.getFeedbackEndpoint
	* @example <caption> Example to invoke getFeedbackEndpoint</caption>
	*  FxpFeedbackService.getFeedbackEndpoint();
	*/
	getFeedbackEndpoint = function () {
		var self = this;
		return self._feedbackServiceEndpoint;
	};
	/**
	* sets setSubsctiptionId of FeedbackService Context Object
	* @method  Fxp.Services.FxpFeedbackService.setSubsctiptionId
	* @param {string} subsctiptionId a subscrption of consumer Id  .
	* @example <caption> Example to invoke setSubsctiptionId</caption>
	*  FxpFeedbackService.setSubsctiptionId('xxxxxx');
	*/
	setSubscriprtionId = function (subscriprtionId) {
		var self = this;
		self._subscriprtionId = subscriprtionId;
		self.rootscope.$broadcast(FxpBroadcastedEvents.OnFeedbackConfigurationChanged)
	};

	/**
	* getSubsctiptionId of FeedbackService Context Object
	* @method Fxp.Services.FxpFeedbackService.getSubsctiptionId
	* @example <caption> Example to invoke getSubsctiptionId</caption>
	*  FxpFeedbackService.getSubsctiptionId();
	*/
	getSubscriprtionId = function () {
		var self = this;
		return self._subscriprtionId;
	};

	/**
	* sets addToFeedbackPropBag of FeedbackService Context Object
	* @method  Fxp.Services.FxpFeedbackService.addToFeedbackPropBag
	* @param {string} key a object key.
	* @param {string} value a object value.
	* @example <caption> Example to invoke addToFeedbackPropBag</caption>
	*  FxpFeedbackService.addToFeedbackPropBag('key','value');
	*/
	addToFeedbackPropBag = function (key, value) {
		var self = this;
		self.feedbackPropBag[key] = value;
	};
	/**
	* sets getFeedbackPropBagItems of FeedbackService Context Object
	* @method  Feedback.FeedbackWidgetContextService.getItems
	* @example <caption> Example to invoke getFeedbackPropBagItems</caption>
	*  FxpFeedbackService.getFeedbackPropBagItems();
	*/
	getFeedbackPropBagItems = function () {
		var self = this;
		return self.feedbackPropBag;
	};
	/**
	 * sets addFeedbackPropBagRange of FeedbackService Context Object
	 * @method  Fxp.Services.FxpFeedbackService.addRange
	 * @param { object } properties is collection of properties like object.
	 * @example <caption> Example to invoke addFeedbackPropBagRange</caption>
	 *  FxpFeedbackService.addFeedbackPropBagRange('xxxxxx');
	 */
	addFeedbackPropBagRange = function (properties) {
		var self = this;
		for (var property in properties) {
			self.addToFeedbackPropBag(property, properties[property]);
		}
	};

	/**
	 * removeFeedbackPropBagRange of FeedbackService Context Object
	 * @method  Fxp.Services.FxpFeedbackService.removeFeedbackPropBagRange
	 * @example <caption> Example to invoke addRange</caption>
	 * FxpFeedbackService.removeFeedbackPropBagRange();
	 */
	removeFeedbackPropBagRange = function () {
		var self = this;
		if (self.feedbackPropBag)
			self.feedbackPropBag = {};
	};

	/**
	* sets removeFromFeedbackPropBag of FeedbackService Context Object
	* @method Fxp.Services.FxpFeedbackService.removeFromFeedbackPropBag
	* @param {string} key a property key.
	* @example <caption> Example to invoke key</caption>
	*  FxpFeedbackService.removeFromFeedbackPropBag('xxxxxx');
	*/
	removeFromFeedbackPropBag = function (key) {
		var self = this;
		delete self.feedbackPropBag[key];
	};


	/**
	*A method to use the log the  UserFeedback Information.
	* @method Fxp.Services.FxpFeedbackService.logFeedbackInformation
	* @param {feedbackInfo } toState feedbackInfo.
	* @param {feedbackStatusInfo } toState feedbackStatusInfo.
	* @param {status } toState status.
	* @param {error } toState error.
	* @example <caption> Example to use logFeedbackInformation</caption>
	*  logFeedbackInformation(feedbackInfo: any, feedbackStatusInfo: string, status: string, error: any)
	*/
	logFeedbackInformation(feedbackInfo: any, feedbackStatusInfo: string, status: string, error: any): void {
		var self = this, propBag;
		propBag = self.fxplogger.createPropertyBag();
		propBag.addToBag(FxpConstants.metricConstants.UserUPN, feedbackInfo.userId);
		propBag.addToBag(FxpConstants.metricConstants.UserBusinessRole, feedbackInfo.tags.BusinessRole);
		propBag.addToBag(FxpConstants.metricConstants.UserRoleGroup, feedbackInfo.tags.RoleGroupName);
		propBag.addToBag(FxpConstants.metricConstants.LoggedinUserName, feedbackInfo.tags.UserName);
		propBag.addToBag(FxpConstants.metricConstants.BrowserPageTitle, feedbackInfo.tags.BrowserPageTitle);
		propBag.addToBag(FxpConstants.metricConstants.FeedbackType, feedbackInfo.feedbackType);
		propBag.addToBag(FxpConstants.metricConstants.Action, feedbackInfo.tags.Action);
		propBag.addToBag(FxpConstants.metricConstants.UserFeedback, feedbackInfo.feedback);
		propBag.addToBag(FxpConstants.metricConstants.BrowserType, feedbackInfo.tags.BrowserType);
		propBag.addToBag(FxpConstants.metricConstants.BrowserVersion, feedbackInfo.tags.BrowserVersion);
		propBag.addToBag(FxpConstants.metricConstants.OperatingSystem, feedbackInfo.tags.OperatingSystem);
		propBag.addToBag(FxpConstants.metricConstants.ScreenRoute, feedbackInfo.tags.ScreenRoute);
		propBag.addToBag(FxpConstants.metricConstants.DeviceType, feedbackInfo.tags.DeviceType);
		propBag.addToBag(FxpConstants.metricConstants.TotalDuration, feedbackInfo.TotalDuration);
		propBag.addToBag(FxpConstants.metricConstants.UIRenderDuration, feedbackInfo.UIRenderDuration);

		if (self.userInfoService.isActingOnBehalfOf()) {
			propBag.addToBag(FxpConstants.metricConstants.OBOUserUPN, feedbackInfo.tags.OBOUserUPN);
			propBag.addToBag(FxpConstants.metricConstants.OBOUserName, feedbackInfo.tags.OBOUserName);
			propBag.addToBag(FxpConstants.metricConstants.OBOUserBusinessRole, feedbackInfo.tags.OBOUserBusinessRole);
			propBag.addToBag(FxpConstants.metricConstants.OBOUserRoleGroupName, feedbackInfo.tags.OBOUserRoleGroupName);
		}

		if (status === FxpConstants.messageType.success)
			self.fxplogger.logInformation(self.fxpFeedbackServiceClassName, feedbackStatusInfo, propBag);

		if (status === FxpConstants.messageType.error)
			self.fxplogger.logError(self.fxpFeedbackServiceClassName, feedbackStatusInfo + ". Error Message: " + error, "3401", null, propBag);
	}
}