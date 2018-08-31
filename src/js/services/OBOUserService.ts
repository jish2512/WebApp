import { IRootScope } from "../interfaces/IRootScope";
import { FxpContext } from "../context/FxpContext";
import { FxpMessageService } from "./FxpMessageService";
import { FxpConstants } from "../common/ApplicationConstants";
import { UserInfoService } from "./UserInfoService";
import { UserProfileService } from "./userProfileService";
import { UserClaimsService } from "./UserClaimsService";


/**
 * @application  Fxp
 */
/**
 * @module Fxp.Services
 */
/**
    * A service to connect to user profile service to fetch the detaisl of user info and user claims related to partner apps
    * @class Fxp.Services.OBOUserService
    * @classdesc A service to connect to user profile service to fetch the user profile details and claims 
    * @example <caption> Example to create an instance of user profile service</caption>         
    *  //Initializing User Profile Service
    *  angular.module('FxPApp').controller('AppController', ['OBOUserService', AppController]);
    *  function AppController(OBOUserService){ OBOUserService.InitializeOBOEntityFromContext(); }
    */

export class OBOUserService {
	private $rootScope: IRootScope;
	private static _instance: OBOUserService;
	private fxpContextService: FxpContext;
	private q: angular.IQService;
	private OBOUserStatus: boolean;
	private OBOUserRoutes: any;
	private OBOUser: any;
	private OBOUserSessionInfo: string;
	private OBOUserTenantConfiguration: any;
	private fxpMessageService: FxpMessageService;
	private userInfoService: UserInfoService;
	private userProfileService: UserProfileService;
	private isOBOAsNewTab: boolean;
	private userClaimsService:UserClaimsService;
	
	constructor($rootScope: IRootScope, fxpContextService: FxpContext, q: angular.IQService, fxpMessageService: FxpMessageService, userInfoService: UserInfoService, userProfileService: UserProfileService,userClaimsService:UserClaimsService) {
		this.$rootScope = $rootScope;
		this.fxpContextService = fxpContextService;
		this.q = q;
		this.OBOUser = "";
		this.OBOUserRoutes = "";
		this.OBOUserStatus = false;
		this.OBOUserSessionInfo = "";
		this.OBOUserTenantConfiguration = "";
		this.fxpMessageService = fxpMessageService;
		this.userInfoService = userInfoService;
		this.userProfileService = userProfileService;
		this.isOBOAsNewTab = false;
		this.userClaimsService=userClaimsService;

		if (OBOUserService._instance) {
			return OBOUserService._instance;
		}
		OBOUserService._instance = this;
	}

	/**
   * Intitalizes the in memory variables for OBO using the value passed
   * @method Fxp.Services.OBOUserService.initilizeOBOEntity
   * @param {any} value the json value for OBO entity
   * @example <caption> Example to invoke initilizeOBOEntity</caption>
   *  OBOUserService.initilizeOBOEntity(value);
   */
	initilizeOBOEntity(value: any): void {
		this.$rootScope.actOnBehalfOfUserActive = value.OBOUserStatus;
		this.OBOUser = value.OBOUser;
		this.OBOUserRoutes = value.OBOUserRoutes;
		this.OBOUserStatus = value.OBOUserStatus;
		this.OBOUserSessionInfo = value.OBOUserSessionInfo;
		this.OBOUserTenantConfiguration = value.OBOUserTenantConfiguration;
		this.userInfoService.setOBOUserSessionInfo(value.OBOUserSessionInfo);
		if (!this.isOBOAsNewTab) {
			this.userInfoService.setCurrentUser(this.OBOUser.alias);
		}
	}


	/**
	* Saves the entity of OBO in context and local inmemory variables
	* @method Fxp.Services.OBOUserService.saveOBOEntityInContext
	* @param {any} value the json value for OBO entity
	* @example <caption> Example to invoke saveOBOEntityInContext</caption>
	*  OBOUserService.saveOBOEntityInContext(value);
	*/
	saveOBOEntityInContext(value: any): void {
		this.initilizeOBOEntity(value);
		this.fxpContextService.saveContext("OBOEntity", JSON.stringify(value));
	}


	/**
	  * Saves the entity of OBO in context and local inmemory variables
	  * @method Fxp.Services.OBOUserService.saveOBOEntityInContext
	  * @param {any} value the json value for OBO entity
	  * @example <caption> Example to invoke saveOBOEntityInContext</caption>
	  *  OBOUserService.saveOBOEntityInContext(value);
	  */

	initializeOBOEntityFromContext(): void {
		var self = this;
		this.fxpContextService.readContext("OBOEntity").then(function (udata) {
			if (!udata.IsError) {
				var oboData = JSON.parse(udata.Result);
				self.userProfileService.setCurrentUser(oboData.OBOUser.alias);
				try {
					self.userClaimsService.getCalimsSvc(oboData.OBOUser.alias).then(function () {
						self.isOBOAsNewTab = true;
						self.initilizeOBOEntity(oboData);
					});
				}
				catch (ex) {
					self.fxpMessageService.addMessage(self.$rootScope.fxpUIConstants.UIMessages.SelectedProfileRoles.ErrorMessage, FxpConstants.messageType.error);
				}
			}
			else {
				self.removeOBOUserContext();
			}
			//Due to async nature of the call to this method, the variable 
			//actOnBehalfOfUserActive is not being set by the time FXP has 
			//reached Home page.Hence forcing it to apply the rootscope once again.
			self.$rootScope.$apply();
		}, function (error) {
			self.removeOBOUserContext();
			//Due to async nature of the call to this method, the variable 
			//actOnBehalfOfUserActive is not being set by the time FXP has 
			//reached Home page.Hence forcing it to apply the rootscope once again.
			self.$rootScope.$apply();
		});
	}

	/**
	* Reset the value in context and in memory variables for OBO User by removing values from there
	* @method Fxp.Services.OBOUserService.removeOBOUserContext
	* @example <caption> Example to invoke removeOBOUserContext</caption>
	*  OBOUserService.removeOBOUserContext();
	*/
	removeOBOUserContext(): void {
		var self = this;
		self.$rootScope.actOnBehalfOfUserActive = false;
		if (self.OBOUser != "" && self.OBOUser.alias) {
			self.fxpContextService.deleteContext(self.OBOUser.alias + "-userInfo").then(function (data) {
				console.log(self.OBOUser.alias + "-userInfo - deleted" + data);
			}, function (error) {
				console.log(self.OBOUser.alias + "-userInfo - deleted Error :", error);
			});

			self.fxpContextService.deleteContext(self.OBOUser.alias + "-userclaims").then(function (data) {
				console.log(self.OBOUser.alias + "-userclaims - deleted" + data);
			}, function (error) {
				console.log(self.OBOUser.alias + "-userclaims - deleted Error :", error);
			});
		}

		this.OBOUserRoutes = "";
		this.OBOUser = "";
		this.OBOUserStatus = false
		this.OBOUserTenantConfiguration = "";
		this.fxpContextService.deleteContext("OBOEntity");
	};


	/**
	* Get the routes for OBO User
	* @method Fxp.Services.OBOUserService.getOBOUserRoutes
	* @example <caption> Example to invoke getOBOUserRoutes</caption>
	*  OBOUserService.getOBOUserRoutes();
	*/
	getOBOUserRoutes(): any {
		return this.OBOUserRoutes;
	};

	/**
	* get the OBO User Informations
	* @method Fxp.Services.OBOUserService.getOBOUser
	* @example <caption> Example to invoke getOBOUser</caption>
	*  OBOUserService.getOBOUser(OBOUser);
	*/
	getOBOUser(): any {
		return this.OBOUser;
	};

	/**
	* get the OBO User Tenant UIStrings
	* @method Fxp.Services.OBOUserService.getOBOUserTenantConfiguration
	* @example <caption> Example to invoke getOBOUserTenantConfiguration</caption>
	*  OBOUserService.getOBOUserTenantConfiguration();
	*/
	getOBOUserTenantConfiguration(): any {
		return this.OBOUserTenantConfiguration;
	};
}
