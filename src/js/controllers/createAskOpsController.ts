/**
 * @application  Fxp
 */
/**
 * @namespace Fxp.Controllers
 */
import { IRootScope } from "../interfaces/IRootScope";
import { ILogger } from "../interfaces/ILogger";
import { SettingsServiceProvider } from "../provider/SettingsServiceProvider";
import { FxpMessageService } from "../services/FxpMessageService";
import { SettingsType } from "../common/SettingsType";
import { ApplicationConstants, FxpConstants } from "../common/ApplicationConstants";
import { ISettingsService } from "../interfaces/ISettingsService";

/**
     * A main controller for FxpApp module. This is the controller having basic scopes and events.
     * @class Fxp.Controllers.CreateAskOpsController
     * @classdesc A main controller to handle Create Ask Ops Modal functionality.
     * @example <caption>
     *  //To Use CreateAskOpsController
     *  angular.module('FxPApp').controller('CreateAskOpsController', ['AnyDependency', CreateAskOpsController]);
     *  function CreateAskOpsController(AnyDependency){ AnyDependency.doSomething(); }
     */
export class CreateAskOpsController {
	private currentRequestType: any;
	private requestTypeData: any;
	constructor(
		private $rootScope: IRootScope,
		private $window: angular.IWindowService,
		private $uibModalInstance: any,
		private fxpLoggerService: ILogger,
		private settingsService: ISettingsService,
		private fxpMessage: FxpMessageService,
		private defaultRequestType: any
	) {
		var self = this;
		self.currentRequestType = "";
		// Get Request Types data.
		self.getRequestTypeData();
	}

	/**
	* Method to call settingssService for getting data for Request Types.
	* @method Fxp.Controllers.CreateAskOpsController.getRequestTypeData
	* @example <caption> Example to use getRequestTypeData</caption>
	* this.getRequestTypeData();
	*/
	getRequestTypeData() {
		var startTime = performance.now(),
			self = this,
			propBag = self.fxpLoggerService.createPropertyBag();
		// Call setting service to get Request Types data.
		self.settingsService.getSettings(SettingsType.App, "Fxp", ApplicationConstants.SnowRequestTypeSettings).then(
			function (response:any) {
				// Check if data is present.
				if (response.data.length > 0) {
					// Assign data.
					self.requestTypeData = JSON.parse(response.data[0].settingValue);
					// Select default Request Type
					self.selectDefaultRequestType();
				}
				// Log time taken by API.
				propBag.addToBag("TotalTime", (performance.now() - startTime).toString());
				self.fxpLoggerService.logEvent("Fxp.Controllers.CreateAskOpsController", "getRequestTypeData", propBag);
			},
			function (error) {
				// Display and log error if service fails.
				propBag.addToBag(FxpConstants.metricConstants.Status, error.status);
				propBag.addToBag(FxpConstants.metricConstants.StatusText, error.statusText + ' ' + error.data);
				self.fxpMessage.addMessage(self.$rootScope.fxpUIConstants.UIMessages.GeneralExceptionError.ErrorMessage, FxpConstants.messageType.error);
				self.fxpLoggerService.logError(
					'Fxp.Controllers.CreateAskOpsController',
					self.$rootScope.fxpUIConstants.UIMessages.GetSettingsServiceCallFailedError.ErrorMessageTitle,
					"3501",
					null,
					propBag);
			}
		);
	}

	/**
	* Method to select default request type.
	* @method Fxp.Controllers.CreateAskOpsController.selectDefaultRequestType
	* @example <caption> Example to use selectDefaultRequestType</caption>
	* this.selectDefaultRequestType();
	*/
	selectDefaultRequestType() {
		var self = this;
		if (self.defaultRequestType) {
			self.currentRequestType = self.requestTypeData.filter(function (requestType) {
				return requestType.DisplayText == self.defaultRequestType;
			})[0];
		}
	}

	/**
	* Method to open snow link in new tab and log the event.
	* @method Fxp.Controllers.CreateAskOpsController.openPage
	* @example <caption> Example to use openPage</caption>
	* this.openPage();
	*/
	openPage() {
		var self = this,
			propBag = self.fxpLoggerService.createPropertyBag();
		// Open link in new tab.
		self.$window.open(self.currentRequestType.LongURL, "_blank");
		// Log event.
		propBag.addToBag("RequestType", self.currentRequestType.DisplayText);
		propBag.addToBag("SnowLink", self.currentRequestType.LongURL);
		self.fxpLoggerService.logEvent("Fxp.Controllers.CreateAskOpsController", "CreateAskOpsRequest", propBag);
		// Close Modal.
		self.closeModal();
	}

	/**
	* Method to close createAskOpsModal.
	* @method Fxp.Controllers.CreateAskOpsController.closeModal
	* @example <caption> Example to use closeModal</caption>
	* this.closeModal();
	*/
	closeModal() {
		var self = this;
		self.$uibModalInstance.dismiss()
	}

}