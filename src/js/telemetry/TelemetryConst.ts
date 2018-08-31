/**
    * Defines telemetry constants
    * @class Fxp.common.Telemetry
    */
export class TelemetryConstants {
	public static PAGENAME: string = 'PageName';
	public static PAGEVISITED: string = 'PageVisited';
	public static URL: string = 'Url';
	public static Duration: string = 'Duration';
	public static ERRORPREFIX: string = 'Error in fxp logger : ';
}

export class TelemetryEventType {
	public static AIFeatureUsageEvent: string = 'AI.FeatureUsageEvent';
	public static AIBusinessProcessEvent: string = 'AI.BusinessProcessEvent';
}

export class TelemetryConfigDefaults {
	public static InstrumentationKey: string = 'bdacee2d-2b6a-41b6-8454-f0e155db2721';
	public static EndPointUrl: string = '';
}

/**
* Defines trackinglevel constants
* @class Fxp.common.TracingLevel
*/
export class TracingLevel {
	/** 
	* @member {string} Fxp.common.TracingLevel#ERROR             
	*/
	public static ERROR: string = 'Error';

	/** 
   * @member {string} Fxp.common.TracingLevel#ERRORWITHMETRIC             
   */
	public static Metric: string = 'Metric';

	/** 
   * @member {string} Fxp.common.TracingLevel#WARNING             
   */
	public static WARNING: string = 'Warning';

	/** 
   * @member {string} Fxp.common.TracingLevel#WARNING             
   */
	public static TRACE: string = 'Trace';

	/** 
   * @member {string} Fxp.common.TracingLevel#INFORMATION             
   */
	public static INFORMATION: string = 'Information';

	/** 
   * @member {string} Fxp.common.TracingLevel#CUSTOMEVENT
   */
	public static CUSTOMEVENT: string = 'CustomEvent';
}

export enum PouchSyncMode {
	Push,
	Pull,
	Both,
	None
};

export enum DiagnosticLevel {
	Off = 0,
	Error = 1,
	Warning = 2,
	Info = 3,
	Verbose = 4
};

export class EventDataProperties {
	public static ACTIONURI: string = 'ActionUri';
	public static APPACTION: string = 'AppAction';
	public static COMPONENTTYPE: string = 'ComponentType';
	public static EVENTTYPE: string = 'EventType';
	public static TARGETENTITYKEY: string = 'TargetEntityKey';
	public static USERROLENAME: string = 'UserRoleName';
	public static XCV: string = 'Xcv';
	public static COMPONENTURI: string = 'ComponentUri';
	public static DURATION: string = 'Duration';
}

export class EnvironmentData {
	public static ENVIRONMENTNAME: string = 'EnvironmentName';
	public static SERVICEOFFERING: string = 'ServiceOffering';
	public static SERVICELINE: string = 'ServiceLine';
	public static PROGRAM: string = 'Program';
	public static CAPABILITY: string = 'Capability';
	public static COMPONENTNAME: string = 'ComponentName';
	public static XCV: string = 'Xcv';
	public static AIAPPKEY: string = 'AiAppKey';
	public static LOGGEDFROM: string = 'AppName';
	public static ICTOID: string = 'IctoId';
	public static BUSINESSPROCESSNAME: string = 'BusinessProcessName';

}

export class ControllerName {
	public static LEFTNAVPERSONALIZATIONCONTROLLER: string = "Fxp.LeftNavPersonalizationController";
	public static USERLOOKUPPERSONALIZATIONCONTROLLER: string = "Fxp.UserLookupPersonalizationController";
	public static MANAGEROLENAVPERSONALIZATIONCONTROLLER: string = "Fxp.ManageRoleNavPersonalizationController";

}

export class EventName {
	public static SUBMITUSERNAVPRESONALIZATIONSUCCESS: string = "PersonalizationService submitUserNavPresonalization Success";
	public static SUBMITROLEGROUPNAVPRESONALIZATIONSUCCESS: string = "PersonalizationService submitRoleGroupNavPresonalization Success";
	public static GETMASTERLEFTNAVITEMSSUCCESS: string = "PersonalizationService GetMasterLeftNavItems Success";
	public static GETPERSONALIZEDROLENAVITEMSSUCCESS: string = "PersonalizationService GetPersonalizedrRoleNavItems Success";
	public static GETPERSONALIZEDROLEGROUPNAVITEMSSUCCESS: string = "PersonalizationService GetPersonalizedRoleGroupNavItems Success";
	public static GETPERSONALIZEDNAVITEMSSUCCESS: string = "PersonalizationService GetPersonalizedNavItems Success";
	public static NAVIGATETOPERSONALIZATIONVIEWSUCCESS: string = "navigateToPersonalizationView Success";
	public static USERPROFILESUCCESS: string = "Userprofile Service Success";
}
export class RoleGroupDetails {
	public static LOGGEDINUSERROLEGROUPID: string = 'LoggedInUserRoleGroupId';
	public static LOGGEDINUSERROLEGROUPNAME: string = 'LoggedInUserRoleGroupName';
	public static OBOROLEGROUPID: string = 'OBOUserRoleGroupId';
	public static OBOROLEGROUPNAME: string = 'OBOUserRoleGroupName';
}
export class TenantDetails {
	public static LOGGEDINUSERTENANTKEY: string = 'LoggedInUserTenantKey';
	public static LOGGEDINUSERTENANTNAME: string = 'LoggedInUserTenantName';
	public static OBOTENANTKEY: string = 'OBOUserTenantKey';
	public static OBOTENANTNAME: string = 'OBOUserTenantName';
}