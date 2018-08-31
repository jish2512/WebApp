import { IRootScope } from "../interfaces/IRootScope";
import { IAppControllerScope } from "../interfaces/IAppControllerScope";
import { FxpBroadcastedEvents } from "../services/FxpBroadcastedEvents";

export abstract class FxpBaseController {

	private $rootScope: IRootScope;
	private $scope: IAppControllerScope;
	constructor($rootScope: IRootScope, $scope: IAppControllerScope) {
		this.$rootScope = $rootScope;
		this.$scope = $scope;
		if (this.$rootScope.isFxpLoadedWithClaims) {
			this.OnFxpLoadedHandler();
		}
		else {
			this.$scope.$on(FxpBroadcastedEvents.OnFxpLoadCompleted, this.OnFxpLoadedHandler.bind(this));
		}
	}

	private OnFxpLoadedHandler() {
		if (this.$scope.onFxpLoaded) {
			this.$scope.onFxpLoaded();
		}
		else {
			console.log("No Functionality defined for FXP load");
		}
	}
	abstract onFxpLoaded();
}