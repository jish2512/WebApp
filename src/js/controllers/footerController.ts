/**
 * @application  Fxp
 */
/**
 * @module Fxp.Controllers
 */
import { ILogger } from "../interfaces/ILogger";
import { FxpConstants} from "../common/ApplicationConstants";
import { LogPropertyBag } from "../telemetry/LogPropertyBag";
import { FxpConfigurationService } from "../services/FxpConfiguration";
/**
   * Footer Controller. Used to display footer links and captures telemetry around it
   * @class Fxp.Controllers.FooterController
   * @classdesc FooterController of FxpApp module
   * @example <caption>
   *  //To Use FooterController
   *  angular.module('FxPApp').controller('FooterController', ['AnyDependency', FooterController]);
   *  function FooterController(AnyDependency){ AnyDependency.doSomething(); }
   */
export class FooterController {
	private fxpConstants: FxpConstants;
	private fxpErrorMessages: any;
	
	constructor(
	 private $scope: any,
	 private fxpLoggerService: ILogger,
	 private fxpConfigurationService: FxpConfigurationService,
	) {
		this.fxpConstants = FxpConstants;
		this.$scope.footerdata = fxpConfigurationService.FxpBaseConfiguration.FxpFooterData;
	
		//Initializes value
		var self = this;
		//updating userInfo session for logged in user only if RoleGroup Configuration is missing
		this.$scope.logFooterUsageTelemetryInfo = this.logFooterUsageTelemetryInfo.bind(this);
	}

	logFooterUsageTelemetryInfo(footerItem: any): void {
		var self = this, propBag;

		propBag = self.fxpLoggerService.createPropertyBag();
		propBag.addToBag(FxpConstants.metricConstants.FooterLinkUrl, footerItem.href);
		propBag.addToBag(FxpConstants.metricConstants.FooterLinkName, footerItem.DisplayText);
		self.fxpLoggerService.logInformation("Fxp.Footer", "Fxp.FooterLinkClick", propBag);
	}
}
