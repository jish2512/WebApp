import { IRouteService } from "../interfaces/IRouteService";

declare var $routeProvider:any;

export class RouteConfig {

	private routeService: any;
	public routes: any;
	static $inject = ["RouteService"];
	constructor(routeService: IRouteService) {

		this.routeService = routeService;
		var routeData = routeService.fetchRoutes();
		this.routes = angular.fromJson(routeData);

	}
}