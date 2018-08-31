/**
       * A class that contains angular providers for FXP app
       * @class Fxp.Provider.FxpUIStateHelperProvider
       * @classdesc A class that contains angular providers for FXP app,       
       */

declare var window: any;
declare type IStateProvider = any;
declare type IUrlRouterProvider = any;
export class FxpUIStateHelperProvider {

	/**
	 * An angular configuration for dynamically adding of states
	 * @method Fxp.Provider.FxpUIStateHelperProvider.UIStateHelperProvider                
	 */
	public static UIStateHelperProvider = function ($stateProvider: IStateProvider, $urlRouterProvider: IUrlRouterProvider) {
		this.$get = function UIStateHelper() {
			function UIStateManager() { }
			UIStateManager.prototype.addState = function (name, state) {
				if (state.controllerUrl && state.controllerUrl != "") {
					$stateProvider.state(name, window.angularAMD.route(state));
				}
				else {
					$stateProvider.state(name, state);
				}
			}

			UIStateManager.prototype.otherwise = function (url) {
				$urlRouterProvider.otherwise(url);
			}

			UIStateManager.prototype.init = function () {
				$stateProvider.init();
				$urlRouterProvider.init();
			}


			return new UIStateManager();
		}
	}
}