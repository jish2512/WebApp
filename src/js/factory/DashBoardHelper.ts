import { ILogger } from "../interfaces/ILogger";
import { PerfMarkers, ApplicationConstants, FxpConstants } from "../common/ApplicationConstants";
import { Resiliency } from "../resiliency/FxpResiliency";
import { TelemetryContext } from "../telemetry/telemetrycontext";
import { FxpContext } from "../context/FxpContext";
import { PageLoaderService } from "../services/pageLoaderService";
import { FxpRouteService } from "../services/FxpRouteService";
import { IRootScope } from "../interfaces/IRootScope";
import { AppControllerHelper } from "./AppControllerHelper";
import { FxpComponentRegistrationService } from "../services/FxpComponentRegistrationService";
import { IStateConfig } from "../interfaces/IStateConfig";
import { PartnerAppRegistrationService } from "../services/PartnerAppRegistrationService";
import { UserInfoService } from "../services/UserInfoService";
import { IFxpAppContext } from "../interfaces/IFxpAppContext";
import { FxpConfigurationService } from "../services/FxpConfiguration";

declare type IStateService = any;
/**
 * @application  Fxp
 */


/**
   * A main factory which acts as an helper for DashBoardController. This is the factory having common functionalities.
   * @class Fxp.Factory.DashBoardHelper
   * @classdesc An helper factory for DashBoardController in FxPApp module
   * @example <caption> 
   *  //How To use this factory
   *  angular.module('FxPApp').controller('DashBoardController', ['DashBoardHelper', DashBoardHelper]);
   *  function DashBoardController(AnyDependency){ DashBoardHelper.fillRoutes(config); }
   */
export class DashBoardHelper {
	private UIStateHelper: angular.IServiceProvider;
	private fxpLoggerService: ILogger;
	private $state: IStateService;
	private fxpContext: FxpContext;
	private fxpTelemetryContext: TelemetryContext;
	private fxpRouteService: FxpRouteService;
	private $rootScope: IRootScope;
	private $location: angular.ILocationService;
	private pageLoaderService: PageLoaderService;
	private $injector: angular.auto.IInjectorService;
	private appControllerHelper: AppControllerHelper;
	private stateConfigCollection: Array<IStateConfig>;
	private userInfoService: UserInfoService;
	constructor(
		$rootScope: IRootScope,
		$state: IStateService, UIStateHelper: angular.IServiceProvider,
		fxpLoggerService: ILogger, fxpTelemetryContext: TelemetryContext,
		fxpContextService: FxpContext,
		fxpRouteService: FxpRouteService,
		$location: angular.ILocationService,
		PageLoaderService: PageLoaderService,
		private fxpConfigurationService: FxpConfigurationService,
		$injector: angular.auto.IInjectorService, appControllerHelper: AppControllerHelper, userInfoService: UserInfoService
	) {
		this.$rootScope = $rootScope;
		this.UIStateHelper = UIStateHelper;
		this.fxpLoggerService = fxpLoggerService;
		this.$state = $state;
		this.fxpContext = fxpContextService;
		this.fxpTelemetryContext = fxpTelemetryContext
		this.fxpRouteService = fxpRouteService;
		this.$location = $location;
		this.pageLoaderService = PageLoaderService;
		this.$injector = $injector;
		this.appControllerHelper = appControllerHelper;
		this.userInfoService = userInfoService;
	}

	/**
	* A method to get the basic profile.
	* @method Fxp.Factory.DashBoardHelper.getResolveMembers(config)
	* @param {Object} resolveObjects Resolve Objects.
	* @example <caption> Example to use getResolveMembers</caption>
	*  this.getResolveMembers(resolveObjects);
	*/
	private getResolveMembers(resolveObjects: any): any {
		var promiseObjects = {};

		Object.keys(resolveObjects).forEach(function (key) {
			var value = resolveObjects[key];
			promiseObjects[key] = new Function(value);
		});

		return promiseObjects;
	}

	/**
	* A method to get the basic profile.
	* @method Fxp.Factory.DashBoardHelper.updateResolveObjects(config)
	* @param {Object} uirouteConfigObjects UIRoute Config Objects.
	* @example <caption> Example to use updateResolveObjects</caption>
	*  this.updateResolveObjects(uirouteConfigObjects);
	*/
	private updateResolveObjects(uirouteConfigObjects: any, lazyLoadModules: any): any {
		try {
			var getResolveMembers = this.getResolveMembers;
			if (uirouteConfigObjects.resolve != undefined) {
				uirouteConfigObjects.resolve = eval(uirouteConfigObjects.resolve);
			}

			if (lazyLoadModules && lazyLoadModules.length) {
				var ocResolve = ["$ocLazyLoad", function ($ocLazyLoad) {
					return $ocLazyLoad.load(lazyLoadModules, { serie: true });
				}];
				uirouteConfigObjects.resolve = uirouteConfigObjects.resolve || {};
				uirouteConfigObjects.resolve.lazyLoad = ocResolve;
			}

			if (uirouteConfigObjects.views != undefined) {

				var stateViews = uirouteConfigObjects.views;
				Object.keys(stateViews).forEach(function (key) {
					var value = stateViews[key];
					if (value.resolve != undefined) {
						value.resolve = getResolveMembers(value.resolve);
					}
				});
			}

		} catch (ex) {

			var exMessage = "Exception while updating states of resolve objects.Exception: " + ex.toString();
			this.fxpLoggerService.logError("Fxp.Client.DashBoardController", exMessage, "2904", null);

		}
	}

	updateStateConfiguration(configRoutes) {
		var defaultRoutes = window["defaultRoutes"].DefaultRoutes;
		let alias = this.userInfoService.getCurrentUser();
		let claimdata = JSON.parse(sessionStorage[FxpConstants.CONST.fxpUserClaimsSession + "_" + alias]);
		const { States } = defaultRoutes.find((item) => (item.AppRole == claimdata.defaultAppRole));

		for (var i = 0; i < configRoutes.length; i++) {
			if (configRoutes[i].RouteConfig) {
				var routeConfig = typeof (configRoutes[i].RouteConfig) == "string" ? JSON.parse(configRoutes[i].RouteConfig) : configRoutes[i].RouteConfig;
				var currentStateObj = <IStateConfig>{};
				currentStateObj.name = configRoutes[i].StateName;
				currentStateObj.url = routeConfig.url;
				currentStateObj.component = routeConfig.component;
				currentStateObj.controller = routeConfig.controller;
				currentStateObj.controllerAs = routeConfig.controllerAs;
				currentStateObj.templateUrl = routeConfig.templateUrl;
				currentStateObj.resolve = routeConfig.resolve;
				currentStateObj.params = routeConfig.params || {};
				currentStateObj.data = {
					headerName: configRoutes[i].AppHeader,
					breadcrumbText: configRoutes[i].BreadcrumbText,
					pageTitle: configRoutes[i].PageTitle,
					requiredModules: configRoutes[i].requiredModules,
					lazyLoad: configRoutes[i].lazyLoad || [],
					stateModulesMissing: false,
					extendable: configRoutes[i].extendable || {}
				};
				currentStateObj.views = routeConfig.views;
				this.stateConfigCollection.push(currentStateObj);
			}
			else {
				// adding routes with new schema directly to collection 
				this.stateConfigCollection.push(configRoutes[i]);
			}
		};

	}

	getRegisteredRoutes(fxpAppContext: IFxpAppContext): Array<IStateConfig> {
		let registeredApps = PartnerAppRegistrationService.getRegisteredPartnerApps();
		let registeredRoutes: Array<IStateConfig> = [];
		if(registeredApps){
			Object.keys(registeredApps).forEach((key) => {
				var appInstance = new registeredApps[key]();
				var routesCollection = appInstance.getRoutes(fxpAppContext);
				registeredRoutes.push.apply(registeredRoutes, routesCollection);
			});
		}		
		return registeredRoutes;
	}

	/**
	* A method to get the basic profile.
	* @method Fxp.Factory.DashBoardHelper.getBasicProfile(config)
	* @param {Object} fxpConfig FxpRoute Configurations.
	* @example <caption> Example to use fillRoutes</caption>
	*  DashBoardHelper.fillRoutes(config);
	*/
	fillRoutes(fxpConfig: any): void {
		this.stateConfigCollection = new Array<IStateConfig>();
		if (fxpConfig && fxpConfig.Routes)
			this.updateStateConfiguration(fxpConfig.Routes);
		let fxpAppContext: IFxpAppContext = {
			UserContext: this.userInfoService.getCurrentUserContext()
		}
		var partnerRoutes: any = this.getRegisteredRoutes(fxpAppContext);
		if (partnerRoutes)
			this.updateStateConfiguration(partnerRoutes);
		if (this.$rootScope.actOnBehalfOfUserActive == true) {
			this.fxpLoggerService.logInformation('Fxp.actOnBehalfofuser', "FillFxpRoutes Started");
		}
		else {
			this.fxpLoggerService.logInformation('Fxp.LoggedinUser', "FillFxpRoutes Started");
		}
		if (this.stateConfigCollection.length > 0) {
			this.fxpContext.saveContext(ApplicationConstants.UIConfigDB, JSON.stringify(fxpConfig));
			this.$rootScope.configRouteStates = [];
			var routesData = this.stateConfigCollection;
			this.fxpLoggerService.startTrackPerformance(PerfMarkers.LoadRoutes);
			for (var c = 0; c < routesData.length; c++) {
				try {
					this.updateResolveObjects(routesData[c], routesData[c].data.lazyLoad)
					var stateModulesMissing = false;
					try {
						if (routesData[c].data && routesData[c].data.requiredModules && Resiliency.UnavailablePartnerModules.length > 0) {
							var reqModules = routesData[c].data.requiredModules.split(',');
							if (reqModules.length > 0) {
								for (var i = 0; i < reqModules.length; i++) {
									if (Resiliency.UnavailablePartnerModules.indexOf(reqModules[i]) > -1) {
										stateModulesMissing = true;
										Resiliency.statesWithMissingModules.push(routesData[c].name);
										break;
									}
								}
							}
						}
					}
					catch (ex) { }
					routesData[c].data.stateModulesMissing = stateModulesMissing;
					var config = angular.extend({
						"requireADLogin": true
					}, routesData[c]);
					this.UIStateHelper.addState(routesData[c].name, config);
					this.$rootScope.configRouteStates[c] = config;
				}
				catch (ex) {
					var exMessage = "Exception while loading UI Routes. State Name-" + routesData[c].name + " .Exception: " + ex.toString();
					this.fxpLoggerService.logError("Fxp.Client.DashBoardController", exMessage, "2904", null);
				}

			}

			this.fxpLoggerService.stopTrackPerformance(PerfMarkers.LoadRoutes);
			if (sessionStorage["startTime"] != null && sessionStorage["startTime"] != "undefined" && sessionStorage["startTime"] != "null") {
				var propbag = this.fxpLoggerService.createPropertyBag();

				var receiveDate = new Date();
				var startTime = new Date(Date.parse(sessionStorage["startTime"]));
				var responseTime = receiveDate.getTime() - startTime.getTime(); // in millisecs
				propbag.addToBag(FxpConstants.metricConstants.StartTime, startTime.toUTCString());
				propbag.addToBag(FxpConstants.metricConstants.EndTime, receiveDate.toUTCString());
				propbag.addToBag(FxpConstants.metricConstants.ServiceName, FxpConstants.metricConstants.FXPApplicationLaunchMetric);
				propbag.addToBag(FxpConstants.metricConstants.UserAgent, navigator.userAgent);
				propbag.addToBag(FxpConstants.metricConstants.SessionId, this.$rootScope.sessionId);
				propbag.addToBag(FxpConstants.metricConstants.UserUPN, this.fxpTelemetryContext.getUserID());
				propbag.addToBag(FxpConstants.metricConstants.UserBusinessRole, this.fxpTelemetryContext.getUserRole());
				propbag.addToBag(FxpConstants.metricConstants.Geography, this.fxpTelemetryContext.getGeography());
				this.fxpLoggerService.logMetric(FxpConstants.metricConstants.FxpAppLaunch, FxpConstants.metricConstants.FXPApplicationLaunchMetric, responseTime, propbag);
				sessionStorage["startTime"] = null;
			}

			let alias = this.userInfoService.getCurrentUser();
			let claimdata = JSON.parse(sessionStorage[FxpConstants.CONST.fxpUserClaimsSession + "_" + alias]);
			var defaultRoutes = window["defaultRoutes"].DefaultRoutes;

			const { DefaultStateName } = defaultRoutes.find((item) => (item.AppRole == claimdata.defaultAppRole));
			var defaultStateName = DefaultStateName;
			this.UIStateHelper.otherwise(this.$state.href(defaultStateName).slice(1)); //$state.href(defaultStateName) returns # prefixed href e.g #/DashBoard. So we need to remove # prefix
			this.fxpRouteService.setDefaultStateName(defaultStateName);
			if (sessionStorage[ApplicationConstants.RequestStateName] != '' && sessionStorage[ApplicationConstants.RequestStateName] != '/') {
				this.$location.path(sessionStorage[ApplicationConstants.RequestStateName]).replace();
				sessionStorage[ApplicationConstants.RequestStateName] = ""; //Reset REQURL session to empty
			}
			else {
				this.pageLoaderService.fnShowPageLoader(this.$rootScope.fxpUIConstants.UIStrings.LoadingStrings.LoadingDashboard, this.appControllerHelper.handleAdalErrorsLoadingDashboard);
				(this.$state.current.name === defaultStateName) ? this.$state.reload() : this.$state.go(defaultStateName, {}, { location: "replace" });
			}

			if (this.$rootScope.actOnBehalfOfUserActive == true) {
				this.fxpLoggerService.logInformation('Fxp.actOnBehalfofuser', "FillFxpRoutes End");
			}
			else {
				this.fxpLoggerService.logInformation('Fxp.LoggedinUser', "FillFxpRoutes End");
			}

			this.fxpLoggerService.stopTrackPerformance(PerfMarkers.DashboardLoad);
			this.fxpLoggerService.stopTrackPerformance(PerfMarkers.FxpLoad);
		}
	}

	static DashBoardHelperFactory($rootScope, $state, UIStateHelper, fxpLoggerService, fxpTelemetryContext, fxpContextService, fxpRouteService, $location, PageLoaderService, FxpConfigurationService, $injector, appControllerHelper, userInfoService) {
		return new DashBoardHelper($rootScope, $state, UIStateHelper, fxpLoggerService, fxpTelemetryContext, fxpContextService, fxpRouteService, $location, PageLoaderService, FxpConfigurationService, $injector, appControllerHelper, userInfoService);
	}
}
