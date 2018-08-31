import { CommonUtils } from "../utils/CommonUtils";
import { IUserContext } from "../interfaces/IUserContext";

/**
   * A service to connect to user profile service to fetch the detaisl of user info and user claims related to partner apps
   * @class Fxp.Services.UserInfoService
   * @classdesc A service to connect to user profile service to fetch the user profile details and claims 
   * @example <caption> Example to create an instance of user profile service</caption>         
   *  //Initializing User Profile Service
   *  angular.module('FxPApp').service('UserInfoService', [UserInfoService]);    
   */
export class UserInfoService {
	private currentUser: string;
	private loggedInUser: string;
	private currentUserUpn: string;
	private loggedInUserUpn: string;
	private OBOUserSession: any;
	private aadObjectID: string;

	constructor() {
		this.currentUser = "";
		this.loggedInUser = "";
		this.currentUserUpn = "";
		this.loggedInUserUpn = "";
		this.aadObjectID = "";
	}

	public getCurrentUser(): string {
		return this.currentUser;
	}

	public setCurrentUser(alias: string) {
		this.currentUser = alias;
	}

	public getLoggedInUser(): string {
		return this.loggedInUser;
	}

	public setLoggedInUser(alias: string) {
		this.loggedInUser = alias;
	}

	public getCurrentUserUpn(): string {
		return this.currentUserUpn;
	}

	public setCurrentUserUpn(upn: string) {
		this.currentUserUpn = upn;
		this.setUpAjaxCallsHeaders();

	}

	public getAADObjectID(): string {
		return this.aadObjectID;
	}

	public setAADObjectID(aadObjectId: string) {
		this.aadObjectID = aadObjectId;
		this.setUpAjaxCallsHeaders();
	}

	public setLoggedInUserUpn(upn: string) {
		this.loggedInUserUpn = upn;
	}

	public getLoggedInUserUpn() {
		return this.loggedInUserUpn;
	}

	public setOBOUserSessionInfo(value: string) {
		this.OBOUserSession = value;
	}

	public getCurrentUserData() {
		var userInfo;
		var self = this;
		if (!self.isActingOnBehalfOf()) {
			userInfo = sessionStorage[CommonUtils.getSessionStorageUserInfoKey(self.loggedInUser)];
		}
		else {
			userInfo = self.OBOUserSession;
		}
		if (userInfo) {
			userInfo = JSON.parse(userInfo);
			return userInfo;
		}
	}

	public isActingOnBehalfOf() {
		if (CommonUtils.isNullOrEmpty(this.loggedInUser) || CommonUtils.isNullOrEmpty(this.currentUser)) {
			return false;
		}

		return !(this.loggedInUser == this.currentUser);
	}

	private setUpAjaxCallsHeaders() {
		if (this.isActingOnBehalfOf()) {
			$.ajaxSetup({
				headers: { "X-ActonBehalfMode": 'true', "X-OnBehalfOfUser": this.currentUserUpn, "X-OnBehalfOfUserObjectId": this.aadObjectID }
			});
		}
		else {
			$.ajaxSetup({
				headers: { "X-ActonBehalfMode": 'false', "X-OnBehalfOfUser": '', "X-OnBehalfOfUserObjectId": '' }
			});
		}
	}

	public getCurrentUserContext(): IUserContext {
		var self = this;
		let userData = null;
		let userClaimsData = null;
		let profileStorageKey = CommonUtils.getSessionStorageUserInfoKey(self.getCurrentUser());
		let claimsStorageKey = CommonUtils.getSessionStorageUserClaimsKey(self.getCurrentUser());
		if (sessionStorage[profileStorageKey]) {
			userData = JSON.parse(sessionStorage[profileStorageKey]);
		}
		if (sessionStorage[claimsStorageKey]) {
			userClaimsData = JSON.parse(sessionStorage[claimsStorageKey]);
		}

		let userContext: IUserContext  = {
			userInfo : userData,
			userClaims : userClaimsData
		};
		return userContext;
	}
}