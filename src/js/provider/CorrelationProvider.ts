/**
   * A class that contains angular providers for FXP app
   * @class Fxp.Provider.FxpProviders
   * @classdesc A class that contains angular providers for FXP app,       
   */
export class FxpProviders {

	/**
	 * An angular provider for returning the deegate to generate coorelation id
	 * @method Fxp.Config.FxpConfigs.CorrelationProvider                
	 */
	public static CorrelationProvider = function () {
		this.$get = function Correlation() {
			function CorrelationManager() { }
			CorrelationManager.prototype.getCorrelationId = function () {
				return $.correlator.getCorrelationId();
			}
			return new CorrelationManager();
		}
	}


}
