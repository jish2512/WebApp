
export class CustomEvents {
	public static UserSessionCreated: string = 'UserSessionCreated';
	public static FxpAppLaunched: string = 'FxpAppLaunched';
	public static StartUpFlagRetrieved = 'StartUpFlagRetrieved';
	public static SkypeBotInit = 'SkypeBotInit';
	public static ProfileNotFound = 'ProfileNotFound';
}

export class ApplicationConstants {
	public static Application = "Application";
	public static Global = "Global";
	public static GlobalContextDBName: string = 'global';
	public static BootApiUrl = "/Home/GetClientSideConfiguration";
	public static WorkerFilepath = "../js/webworker/fxpwebworker.js";
	public static BaseConfigDBName = "BaseConfigDB";
	public static PersonaConfigByRoleGroupId = "/Home/GetConfiguration";
	/*Added for partner Login :  OPS is expecting "Partners~user" for getBasicprofile api */
	public static PartnerDomain = "Partners~";
	public static PartnerDomainIss = "https://sts.windows.net/a5f51bc5-4d47-4954-a546-bafe55e8db16/";
	public static UserProfile = "UserInfo";
	public static UIConfigDB = "UIConfigDB";
	public static UserInfo = "userInfo";
	public static UserClaims = "userClaims";
	public static BaseUrl = "BaseUrl";
	public static FxpBaseUrl = "https://" + window.location.host;
	public static AssetsUrl = "AssetsUrl";
	public static ProfileStateName = "profile";
	public static ErrorStateNames = ["oneprofile.customErrorPage", "unauthorized"];
	public static RequiredMessage = "{0} is required";
	public static CouchBaseLoginContract = "api/Login?dbName=";
	public static GraphAPIUserUrl = "https://graph.windows.net/myorganization/users/";
	public static ThumbnailUrl = "/thumbnailPhoto?api-version=1.5";
	public static FxpSessionKey = "FxpSessionId";
	public static FxpApplaunchedKey = "FxpAppLaunched";
	public static RequestStateName = "REQSTATE";
	public static FxpBreadcrumbStorageKey = "breadcrumb";
	public static PageTourFeature = "PageTour";
	public static UserPreferencesSettings = "UserPreferences";
	public static FxPAppName = "FxP";
	public static UserPreferencesStorageKey = "{0}-preferences";
	public static PageTourLoggerService = "FxpLoggerService";
	public static FxpAdminData = "AdminTilesData";
	public static SnowRequestTypeSettings = "SnowRequestType";
	public static ESTenanatUrlString = "ESXP";
	public static SalesTenantUrlString = "li360";
	public static XUserClaimsToken = "X-UserClaimsToken";
	public static XTenantId = "X-TenantId";
	public static XResources = "X-Resources";
	public static GraphApiProfileUrl = "myorganization/me?api-version=1.6";
	public static DefaultHelpLink = "Default";
	public static AdalLoginError = "AdalLoginError";
	public static AdalLoginRequest = "AdalLoginRequest";
}

export class FxpConstants {
	public static messageType = {
		error: "error",
		warning: "warning",
		info: "info",
		success: "success"
	};

	public static CONST = {
		fxpUserClaimsSession: "fxpUserClaims",
		String: "string"  
	};

	public static StateEvents = {
		OnStart: 1,
		onSuccess: 2,
		onError: 3,
		onInvalid: 4
	}

	public static metricConstants = {
		GetBasicProfileSvcName: "Get Basic Profile Service",
		GetUserClaimsSvcName: "Get User Claims Service",
		FXPApplicationLaunchMetric: "FXP Application Launch Metric",
		Status: "Status",
		CurrentTime: "CurrentTime",
		StatusText: "StatusText",
		StartTime: "StartTime",
		EndTime: "EndTime",
		ServiceName: "ServiceName",
		ServiceURL: "ServiceURL",
		UserAgent: "UserAgent",
		UserProfileService: "Fxp.UserProfileService",
		FxpAppLaunch: "Fxp.AppLaunch",
		SessionId: "SessionId",
		UserUPN: "UserUPN",
		UserBusinessRole: "UserBusinessRole",
		Geography: "Geography",
		BrowserAgent: "BrowserAgent",
		SearchProfileService: "Fxp.SearchProfileService",
		searchProfileSvcName: "Search Profile Service",
		TimeStamp: "TimeStamp",
		L0BusinessProcessName: "L0BusinessProcessName",
		L0Name: "L0Name",
		L0Name_L1Name: "L0Name_L1Name",
		UserRoleGroup: "UserRoleGroup",
		LeftNavigationClickCountbyRoleGroup: "LeftNavigationClickCountbyRoleGroup",
		LeftNavigationClickCountbyRole: "LeftNavigationClickCountbyRole",
		RequestedUserAlias: "RequestedUserAlias",
		RequestedUserRoleGroupId: "RequestedUserRoleGroupId",
		ScreenRoute: "ScreenRoute",
		FeedbackType: "FeedbackType",
		Action: "Action",
		UserFeedback: "UserFeedback",
		UserFeedbackErrorMessage: "UserFeedbackErrorMessage",
		OBOUserRoleGroupName: "OBOUserRoleGroupName",
		OBOUserBusinessRole: "OBOUserBusinessRole",
		OBOUserUPN: "OBOUserUPN",
		BreadcrumbString: "BreadcrumbString",
		BrowserPageTitle: "BrowserPageTitle",
		LoggedinUserName: "UserName",
		OBOUserName: "OBOUserName",
		OperatingSystem: "OperatingSystem",
		BrowserType: "BrowserType",
		BrowserVersion: "BrowserVersion",
		DeviceType: "DeviceType",
		TotalDuration: "TotalDuration",
		UIRenderDuration: "UIRenderDuration",
		LeftNavPinStatus: "LeftNavPinStatus",
		GetSettingsAPIResponseDuration: "GetSettingsAPIResponseDuration",
		SaveSettingsAPIResponseDuration: "SaveSettingsAPIResponseDuration",
		ModifiedRoleGroupName: "ModifiedRoleGroupName",
		ModifiedRoleGroupID: "ModifiedRoleGroupID",
		ModifiedBusinessRoleName: "ModifiedBusinessRoleName",
		ModifiedBusinessRoleID: "ModifiedBusinessRoleID",
		OBOUserAlias: "OBOUserAlias",
		LeftNavLinksValueBeforeModification: "LeftNavLinksValueBeforeModification",
		LeftNavLinksValueAfterModification: "LeftNavLinksValueAfterModification",
		ErrorUrl: "ErrorUrl",
		GlobalErrorDetail: "ErrorDetails",
		FooterLinkUrl: "FooterLinkUrl",
		FooterLinkName: "FooterLinkName",
		HeaderClickNavigatedStateName: "NavigatedStateName",
		HeaderClickNavigatedStateTemplateURL: "NavigatedStateTemplateURL",
		MiniProfileIconClick: "MiniProfileIconClick",
		ViewFullProfileClick: "ViewFullProfileClick",
		HelpLinkParent: "HelpLinkParent",
		HelpLinkChild: "HelpLinkChild",
		HelpIconClicked: "HelpIconClicked",
		HelpView: "HelpView",
		ErrorText: "ErrorText",
		UserPorfileServiceEndPoint:"User Porfile Service EndPoint"
	};

	public static OBOConstants =
		{
			OnBehalfOfUserName: "OnBehalfOfUserName",
			OnBehalfOfUserAlias: "OnBehalfOfUserAlias",
			OnBehalfOfUserUpn: "OnBehalfOfUserUpn",
			ActonBehalfMode: "ActonBehalfMode",
			OnBehalfOfUserBusinessRoleId: "OnBehalfOfUserBusinessRoleId",
			OnBehalfOfUserBusinessRole: "OnBehalfOfUserBusinessRole",
			OnBehalfOfUserRoleGroup: "OnBehalfOfUserRoleGroup",
			AdminActOnBehaflOfDuratoin: "AdminActOnBehaflOfDuratoin",
			ActonBehalfofAdminStartTime: "ActonBehalfofAdminStartTime",
			ActonBehalfofAdminEndTime: "ActonBehalfofAdminEndTime"
		};
	public static ActionTypes =
		{
			Add: "AddedItems",
			Save: "Save",
			Submit: "Submit",
			Remove: "RemovedItems",
			Cancel: "Cancel",
			Click: "Click"
		};
	public static keyCodes =
		{
			escapeKey: 27,
			arrowRightKey: 39,
			arrowLeftKey: 37,
			arrowDownKey: 40,
			arrowUpKey: 38,
			enterKey: 13,
			tabKey: 9,
			spaceBar: 32
		};
	public static applicableDevice = {
		desktop: "Desktop",
		mobile: "Mobile",
		all: "All"
	};
	public static BreadcrumbEventType = {
		BreadcrumbLoad: "BreadcrumbLoad",
		BreadcrumbClick: "BreadcrumbClick"
	};
	public static askOps = {
		createLink: "createAskOpsRequest",
		viewLink: "https://microsoft.service-now.com/it/my_items.do?view=open_items"
	};
}

export class PerfMarkers {
	public static FxpLoad = "FxpLoad";
	public static GetUserClaims = "GetUserClaims";
	public static GetUserThumbnail = "GetUserThumbnail";
	public static GetBasicProfileWithAdal = "GetBasicProfileWithAdal";
	public static AdalTimeGetBasicProfile = "AdalTimeGetBasicProfile";
	public static DashboardLoad = "DashboardLoad";
	public static LoadRoutes = "LoadRoutes";
	public static PreDashboardLoad = "PreDashboardLoad";
	public static SavePersonalizedNavItems = "SavePersonalizedNavItems";
	public static SaveRoleGroupPersonalizedNavItems = "SaveRoleGroupPersonalizedNavItems";
	public static GetPersonalizedNavItems = "GetPersonalizedNavItems";
	public static GetMasterLeftNavItems = "GetMasterLeftNavItems";
	public static SendUserFeedback = "SendUserFeedback";
	public static GetRoleGroupDetails = "GetRoleGroupDetails";

	public static GetLeftNavData = "GetLeftNavData";
	public static GetAdminDataFromServer = "GetAdminDataFromServer";
	public static GetTenantClaims = "GetTenantClaims";
}

export class RoleGroupInfo {
	public static RoleGroupId = "RoleGroupId";
	public static RoleGroupName = "RoleGroupName";
}

export class TenantInfo {
	public static TenantKey = "TenantKey";
	public static TenantName = "TenantName";
}