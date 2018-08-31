/**
 * @application  Fxp
 */
/**
 * @module Fxp.Controllers
 */
import { ILogger } from "../interfaces/ILogger";
import { FxpMessageService } from "../services/FxpMessageService";
import { IRootScope } from "../interfaces/IRootScope";
import { LogPropertyBag } from "../telemetry/LogPropertyBag";
import { AdminLandingService } from "../services/AdminLandingService";
import { FxpAuthorizationService } from "../services/FxpAuthorizationService";
import { FxpConstants } from "../common/ApplicationConstants";
import { FxpEventBroadCastService } from "../services/BroadCastingService";
//import { AngularDirective } from "../../decorators";

/**
* This is the controller to fetch and update the Admin data .
* @class Fxp.Controllers.AdminLandingController
* @classdesc A main controller for AdminLanding of FxpApp module
* @example <caption>
*  //To Use AdminLandingController
*  angular.module('FxPApp').controller('AdminLandingController', ['AnyDependency', AdminLandingController]);
*  function AdminLandingController(AnyDependency){ AnyDependency.doSomething(); }
*/
//@AngularDirective("AdminLandingController", AdminLandingController, "FxPApp", ['$rootScope', '$scope', 'AdminLandingService', 'FxpMessageService', 'FxpLoggerService', 'FxpAuthorizationService'])
export class AdminLandingController {
	private $rootScope: IRootScope;
	private $scope: any;
	private adminLandingService: AdminLandingService;
	private fxpMessage: FxpMessageService;
	private fxpLoggerService: ILogger;
	private fxpAuthorizationService: FxpAuthorizationService;


	constructor($rootScope: IRootScope,
		$scope: any,
		adminLandingService: AdminLandingService, fxpMessage: FxpMessageService, fxpLoggerService: ILogger, fxpAuthorizationService: FxpAuthorizationService, private fxpBroadCast: FxpEventBroadCastService) {
		var self = this;
		self.$scope = $scope;
		self.$rootScope = $rootScope;
		self.adminLandingService = adminLandingService;
		self.fxpMessage = fxpMessage;
		self.fxpLoggerService = fxpLoggerService;
		self.fxpAuthorizationService = fxpAuthorizationService;
		self.fxpBroadCast.On("testBroadCast", function (evnt, arg) {
			alert(arg);
		});
		self.GetAdminTiles();
	}

	GetAdminTiles() {
		var self = this;
		self.adminLandingService.GetAdminTileDetails(false).then(function (response) {
			if (response && response.length > 0) {
				self.$scope.adminTileGroup = response;
			}
			else {
				var event = { preventDefault: function () { } };

				self.fxpAuthorizationService.redirectToUnauthorizedState(event, "Administration");
			}
		}, function (error) {
			self.fxpMessage.addMessage(self.$rootScope.fxpUIConstants.UIMessages.AdminLandingServiceCallFailedError.ErrorMessage, FxpConstants.messageType.error);
			self.fxpLoggerService.logError('Fxp.Client.AdminController', self.$rootScope.fxpUIConstants.UIMessages.AdminLandingServiceCallFailedError.ErrorMessageTitle, "2702", null);
		}
		);
	}
}

AdminLandingController.$inject = ['$rootScope', '$scope', 'AdminLandingService', 'FxpMessageService', 'FxpLoggerService', 'FxpAuthorizationService', 'FxpEventBroadCastService'];