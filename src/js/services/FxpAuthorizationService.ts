import { IRootScope } from "../interfaces/IRootScope";
import { ILogger } from "../interfaces/ILogger";
import { FxpConstants } from "../common/ApplicationConstants";
import { UserClaimsService } from "./UserClaimsService";
import { UserInfoService } from "./UserInfoService";
import { FxpConfigurationService } from "./FxpConfiguration";
import {StateService} from "@uirouter/core"
/**
 * @application  Fxp
 */
/**
 * @module Fxp.Services
 */
/**
   * A service to check Authorization Rules
   * @class Fxp.Services.FxpAuthorizationService 
   * @classdesc A service to check Authorization Rules
   * @example <caption> Example to create an instance of Fxp Authorization Service</caption>
   *  //Initializing Fxp Route Service
   *  angular.module('FxPApp').controller('AppController', ['FxpAuthorizationService ', AppController]);
   */
export class FxpAuthorizationService {
	private states;
	private stateGo: StateService;
	private rootScope: IRootScope;
	private fxplogger: ILogger;
	private userClaimsService: UserClaimsService;
	private userInfoService: UserInfoService;
	private fxpConfigurationService: FxpConfigurationService;

	constructor($state: StateService,
		$rootScope: IRootScope,
		loggerService: ILogger,
		userClaimsService: UserClaimsService,
		userInfoService: UserInfoService,
		fxpConfigurationService: FxpConfigurationService
	) {
		this.states = $state.get();
		this.stateGo = $state;
		this.rootScope = $rootScope;
		this.userClaimsService = userClaimsService;
		this.userInfoService = userInfoService;
		this.fxplogger = loggerService;
		this.fxpConfigurationService = fxpConfigurationService;

	}

	redirectToUnauthorizedState(event, currentState): void {
		const self = this;
		const propbag = self.fxplogger.createPropertyBag();
		propbag.addToBag("currentUser", self.userInfoService.getCurrentUser());
		propbag.addToBag("currentState", currentState);
		var telemetrymsg = self.rootScope.fxpUIConstants.UIStrings.UnauthorizedUIString + currentState;
		self.fxplogger.logWarning("FxpAuthorizationService", telemetrymsg, propbag);
		event.preventDefault();
		this.stateGo.go("unauthorized");
	}

	isAuthorized(stateName): boolean {
		const self = this;
		const authorizationRules = self.fxpConfigurationService.FxpBaseConfiguration.AuthorizationRules.filter(function (item) {
			return (item.StateName === stateName);
		})[0];

		if (!authorizationRules || !authorizationRules.AllowedRoles || authorizationRules.AllowedRoles.length < 1)
			return true;

		if (self.rootScope.actOnBehalfOfUserActive && authorizationRules.IsRestrictedInObo === true)
			return false;

		const roles = authorizationRules.AllowedRoles;
		const allRolesMandatory = authorizationRules.AllRolesMandatory;

		const apps = roles.map((role) => {
			return role.split(".")[0];
		});

		const claims = {};
		for (var c = 0, appsLength = apps.length; c < appsLength; c++) {
			try {
				claims[apps[c]] = self.userClaimsService.getUserClaims(apps[c]);
			} catch (e) {

			}
		}

		let result = false;
		var checkRoleFunc = (item) => {
			const appClaims = claims[item.split(".")[0]];
			return appClaims && appClaims.Roles && (appClaims.Roles.hasOwnProperty(item.split(".")[1]) === true);
		}
		if (allRolesMandatory === true) {
			result = roles.every(checkRoleFunc);
		}
		else {
			result = roles.some(checkRoleFunc);
		}
		return result;
	}

	checkStatePermission(event, stateName): void {
		const self = this;
		if (self.isAuthorized(stateName) === false)
			self.redirectToUnauthorizedState(event, stateName);
	}
}