import { LogPropertyBag } from "./LogPropertyBag";
import { EnvironmentData } from "./EnvironmentData";
import { FxpLogHelper } from "./FxpLogHelper";
import { ApplicationConstants } from "../common/ApplicationConstants";
import { ITelemetryContextListener } from "../interfaces/ITelemetryContextListener";
import { CommonUtils } from "../utils/CommonUtils";

/**
* A service to get/set telemetry context
* @class Fxp.Telemetry.TelemetryContext
* @classdesc A service to get/set telemetry context
* @example <caption> Example to create an instance of FxpTelemetryContext</caption>         
*  //Initializing FxpTelemetryContext Service
*  angular.module('FxPApp').controller('AppController', ['FxpTelemetryContext', AppController]);
*  function AppController(FxpTelemetryContext){ FxpTelemetryContext.setUserID("xxxxx"); }
*/
export class TelemetryContext {

	private static _currentContext: TelemetryContext;
	private _userId: string = "";
	private _appName: string = "";
	private _appVersion: string = "";
	private _userRole: string = "";
	private _sessionId: string = "";
	private _geography: string = "";
	private _envData: any = null;
	private _globalPropertyBag: LogPropertyBag = new LogPropertyBag();
	private contextChangeListeners: Array<ITelemetryContextListener> = new Array<ITelemetryContextListener>();

	constructor() {
		if (TelemetryContext._currentContext) {
			return TelemetryContext._currentContext;
		}
		this.setAppContext('FXP', 'V1');
		this._envData = [];
		TelemetryContext._currentContext = this;
	}


	getGlobalPropertyBag(): LogPropertyBag {
		return this._globalPropertyBag;
	}

	addToGlobalPropertyBag(key: string, value: string) {
		this._globalPropertyBag.addToBag(key, value);
	}

	removeFromGlobalPropertyBag(key: string) {
		this._globalPropertyBag.removeFromBag(key);
	}


	/**
	* gets instance of TelemetryContext Object
	* @method Fxp.Telemetry.TelemetryContext.CurrentContext        
	* @example <caption> Example to invoke CurrentContext</caption>
	*  FxpTelemetryContext.CurrentContext();
	*/
	//Keeping this function as is for backward Compatibility
	public static get CurrentContext(): TelemetryContext {
		if (TelemetryContext._currentContext) {
			return TelemetryContext._currentContext;
		}
		else {
			TelemetryContext._currentContext = new TelemetryContext();
			return TelemetryContext._currentContext;
		}
	}

	/**
	* sets UserId of Telemetry Context Object
	* @method Fxp.Telemetry.TelemetryContext.setUserID
	* @param {string} UserID a Logged IN UserId in FXP.        
	* @example <caption> Example to invoke setUserID</caption>
	*  FxpTelemetryContext.setUserID('xxxxxx');
	*/
	setUserID(userID: string) {
		if (userID)
			this._userId = userID;
		else
			throw new Error(ApplicationConstants.RequiredMessage.replace('{0}', "User Id"));
	}

	/**
	* gets UserId of Telemetry Context Object, return type of the method is a string
	* @method Fxp.Telemetry.TelemetryContext.setUserID        
	* @example <caption> Example to invoke getUserID</caption>
	*  FxpTelemetryContext.getUserID();
	*/
	getUserID(): string {
		return this._userId;
	}


	/**
	* sets Application Context of Telemetry Context Object
	* @method Fxp.Telemetry.TelemetryContext.setAppContext
	* @param {string} appName Application Name.        
	* @param {string} appVersion Application Version.                
	* @example <caption> Example to invoke setAppContext</caption>
	*  FxpTelemetryContext.setAppContext('FXP','V1');
	*/
	setAppContext(appName: string, appVersion: string) {
		if (appName)
			this._appName = appName;
		else
			throw new Error(ApplicationConstants.RequiredMessage.replace('{0}', "Application Name"));

		if (appVersion)
			this._appVersion = appVersion;
		else
			throw new Error(ApplicationConstants.RequiredMessage.replace('{0}', "Application Version"));

		this.notifyContextChangeListeners();
	}

	/**
	* gets getAppVersion of Telemetry Context Object, return type of the method is a string
	* @method Fxp.Telemetry.TelemetryContext.getAppVersion        
	* @example <caption> Example to invoke getAppVersion</caption>
	*  FxpTelemetryContext.getAppVersion();
	*/
	getAppVersion(): string {
		return this._appVersion;
	}

	/**
	* gets Application Name of Telemetry Context Object, return type of the method is a string
	* @method Fxp.Telemetry.TelemetryContext.getAppName        
	* @example <caption> Example to invoke getAppName</caption>
	*  FxpTelemetryContext.getAppName();
	*/
	getAppName(): string {
		return this._appName;
	}

	/**
	* sets UserRole of Telemetry Context Object
	* @method Fxp.Telemetry.TelemetryContext.setUserRole  
	* @param {string} userRole Business Role of Logged in User.          
	* @example <caption> Example to invoke setUserRole</caption>
	*  FxpTelemetryContext.setUserRole('Architect');
	*/
	setUserRole(userRole: string) {
		if (userRole) {
			this._userRole = userRole;
			this.notifyContextChangeListeners();
		}
		else {
			throw new Error(ApplicationConstants.RequiredMessage.replace('{0}', "User Role"));
		}
	}

	/**
	* gets UserRole of Telemetry Context Object, return type of the method is a string
	* @method Fxp.Telemetry.TelemetryContext.getUserRole        
	* @example <caption> Example to invoke getUserRole</caption>
	*  FxpTelemetryContext.getUserRole();
	*/
	getUserRole(): string {
		return this._userRole;
	}

	/**
	* sets SessionID of Telemetry Context Object
	* @method Fxp.Telemetry.TelemetryContext.setSessionID      
	* @param {string} SessionID SessionId of Logged in User.     
	* @example <caption> Example to invoke setSessionID</caption>
	*  FxpTelemetryContext.setSessionID("12345-56789-123364");
	*/
	setSessionID(sessionID: string) {
		if (sessionID)
			this._sessionId = sessionID;
		else
			throw new Error(ApplicationConstants.RequiredMessage.replace('{0}', "Session Id"));
	}

	/**
	* gets SessionID of Telemetry Context Object, return type of the method is a string
	* @method Fxp.Telemetry.TelemetryContext.setSessionID        
	* @example <caption> Example to invoke setSessionID</caption>
	*  FxpTelemetryContext.setSessionID();
	*/
	getSessionID(): string {
		return this._sessionId;
	}

	/**
	* gets Geography Information of Telemetry Context Object, return type of the method is a string
	* @method Fxp.Telemetry.TelemetryContext.getGeography        
	* @example <caption> Example to invoke getGeography</caption>
	*  FxpTelemetryContext.getGeography();
	*/
	getGeography(): string {
		return this._geography;
	}

	/**
	* sets Geography of Telemetry Context Object
	* @method Fxp.Telemetry.TelemetryContext.setGeography    
	* @param {string} geo IP Address of Logged in User.       
	* @example <caption> Example to invoke setGeography</caption>
	*  FxpTelemetryContext.setGeography("127.0.0.1");
	*/
	setGeography(geo: string) {
		if (geo) {
			this._geography = geo;
			this.notifyContextChangeListeners();
		}
		else
			throw new Error(ApplicationConstants.RequiredMessage.replace('{0}', "Geography"));

	}

	/**
	* Sets user Session of Telemetry Context Object
	* @method Fxp.Telemetry.TelemetryContext.setNewUserSession     
	* @param {Fxp.Telemetry.UserInfo} userInfo UserInfo of Logged in User.      
	* @param {string} sessionId sessionId of Logged in User.  
	* @example <caption> Example to invoke setNewUserSession</caption>
	*  FxpTelemetryContext.setNewUserSession();
	*/
	setNewUserSession(userId: string, sessionId?: string): string {
		if (!sessionId)
			sessionId = FxpLogHelper.getNewSessionId();

		if (userId) {
			this.setUserID(userId);
			this.setSessionID(sessionId);
			this.notifyContextChangeListeners();
		}
		else
			throw new Error(ApplicationConstants.RequiredMessage.replace('{0}', "UserInfo"));

		return sessionId;
	}

	/**
	* sets Enviroonment Details of FXP in Telemetry Context Object
	* @method Fxp.Telemetry.TelemetryContext.setEnvironmentDetails
	* @param {string} appName  Application Name
	* @param {Fxp.Telemetry.EnvironmentData} envData Environment Details of FXP.            
	* @example <caption> Example to invoke setEnvironmentDetails</caption>
	*  FxpTelemetryContext.setEnvironmentDetails();
	*/
	setEnvironmentDetails(appName: string, envData: EnvironmentData) {
		if (!CommonUtils.isNullOrEmpty(appName) && (envData))
			this._envData[appName.toLowerCase()] = envData;
		else
			throw new Error(ApplicationConstants.RequiredMessage.replace('{0}', "Environment Data"));
	}
	/**
	* sets Partner Enviroonment Details of FXP in Telemetry Context Object
	* @method Fxp.Telemetry.TelemetryContext.setEnvironmentDetails
	* @param {string} environmentName  EnvironmentName is Environment Name of the Application like "Development" or "Production" etc..
	* @param {Object} partnersTelmetryInfo  is a collection of partner telemetry environment details
	* @example <caption> Example to invoke setEnvironmentDetails</caption>
	*  FxpTelemetryContext.setPartnerEnvironmentDetails();
	*/
	setPartnerEnvironmentDetails(environmentName, partnersTelmetryInfo) {
		var self = this;
		try {
			if (!CommonUtils.isNullOrEmpty(partnersTelmetryInfo)) {
				for (var index = 0, length = partnersTelmetryInfo.length; index < length; index++) {
					var partnerTelmetryInfo = partnersTelmetryInfo[index];
					if (!CommonUtils.isNullOrEmpty(partnerTelmetryInfo.Name))
						self._envData[partnerTelmetryInfo.Name.toLowerCase()] = new EnvironmentData(environmentName,
							partnerTelmetryInfo.ServiceOffering,
							partnerTelmetryInfo.ServiceLine,
							partnerTelmetryInfo.Program,
							partnerTelmetryInfo.Capability,
							partnerTelmetryInfo.ComponentName,
							partnerTelmetryInfo.Name,
							partnerTelmetryInfo.IctoId,
							partnerTelmetryInfo.BusinessProcessName);
				}
			}
		} catch (exception) {
			console.log(exception);
		}
	}

	/**
	* gets Environment Details of FXP, return type of the method is a type of Fxp.Telemetry.EnvironmentData class
	* @method Fxp.Telemetry.TelemetryContext.getEnvironmentDetails
	* @param {string} appName  Application Name
	* @example <caption> Example to invoke getEnvironmentDetails</caption>
	*  FxpTelemetryContext.getEnvironmentDetails();
	*/
	getEnvironmentDetails(appName: string): EnvironmentData {
		var envData;
		if (!CommonUtils.isNullOrEmpty(appName))
			envData = this._envData[appName.toLowerCase()];
		return envData;
	}

	/**
	* adds Context Change Event Listner
	* @method Fxp.Telemetry.TelemetryContext.addContextChangeListener  
	* @param {Fxp.Interfaces.ITelemetryContextListener} listener Context Change Event Listner
	* @example <caption> Example to invoke addContextChangeListener</caption>
	*  FxpTelemetryContext.addContextChangeListener("xxxx");
	*/
	addContextChangeListener(listener: ITelemetryContextListener) {
		this.contextChangeListeners.push(listener);
	}

	private notifyContextChangeListeners() {
		for (var listener in this.contextChangeListeners)
			this.contextChangeListeners[listener].notify();
	}
}