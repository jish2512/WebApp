import { FxpConfigurationService } from "../services/FxpConfiguration";
import { ILogger } from "../interfaces/ILogger";
import { SessionTimeoutModalConstant } from "../constants/SessionTimeoutModal.constants";
import { FxpConstants } from "../common/ApplicationConstants";

/**
 * @application  Fxp
 */
/**
 * @module Fxp.Services
 */


/**
   * A facroey to display Modal
   * @class FxpModalService
   * @classdesc A service to display popup modal
   * @example <caption> Example to create an instance of sessionTimeoutmodalfactory</caption>
   *  //Initializing sessionTimeOutModalFactory
   *  angular.module('FxPApp').controller('AppController', ['SessionTimeoutModalFactory', AppController]);
   *  function AppController(fxpModalService, fxpConstants){ SessionTimeoutModalFactory.showSessionTimeoutModal(); }
   */
export class SessionTimeoutModalFactory {
	private classNameSessionTimeoutFactory = "Fxp.SessionTimeoutModalFactory";
	


	constructor(
		private $uibModal: any,
		private fxpConfigurationService: FxpConfigurationService,

		private fxplogger: ILogger,
		private SessionTimeoutModalConstant: SessionTimeoutModalConstant,
		private ActivityMonitor: any) {
		
	}

	/**
   * Method to show SessionTimeOut Modal.
   * @method Fxp.Factory.SessionTimeoutModalFactory.showSessionTimeoutModal
   * @example <caption> Example to use showSessionTimeoutModal</caption>
   * sessionTimeoutModalFactory.showSessionTimeoutModal();
   */

	showSessionTimeoutModal() {

		let self = this;
		let options = SessionTimeoutModalConstant.options;
		self.$uibModal.open(options);


	}

	init() {
		let self = this;


		let timeout =
			self.ActivityMonitor.options.inactive = this.fxpConfigurationService.FxpAppSettings.SessionTimeoutDurationInSeconds;
		self.ActivityMonitor.on('inactive', function () {
			self.fxplogger.logEvent(self.classNameSessionTimeoutFactory, "Session Timed out");

			sessionStorage.clear();

			self.showSessionTimeoutModal();
		});

	}

	static getUIDataFactoryObj($uibModal: any,
		fxpConfigurationService: FxpConfigurationService,

		fxpLoggerService: ILogger,
		SessionTimeoutModalConstant: SessionTimeoutModalConstant,
		ActivityMonitor: any) {
		return new SessionTimeoutModalFactory($uibModal, fxpConfigurationService, fxpLoggerService, SessionTimeoutModalConstant, ActivityMonitor);
	}
}
