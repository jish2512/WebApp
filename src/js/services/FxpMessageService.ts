import { IRootScope } from "../interfaces/IRootScope";
import { FxpConfigurationService } from "./FxpConfiguration";
import { ILogger } from "../interfaces/ILogger";
import { FxpConstants } from "../common/ApplicationConstants";

/**
 * @application  Fxp
 */
/**
 * @module Fxp.Services
 */
/**
   * A service to display all types of Messages like Error, Warning, Information
   * @class Fxp.Services.fxpMessageService
   * @classdesc A service to display all types of Messages like Error, Warning, Information
   * @example <caption> Example to create an instance of Fxp Message Service</caption>         
   *  //Initializing Fxp Message
   *  angular.module('FxPApp').controller('AppController', ['fxpMessageService', AppController]);
   *  function AppController(fxpMessageService, fxpConstants){ fxpMessageService.addMessage('message from FXP', Fxp.Common.Constants.FxpConstants.messageType.error); }
   */
export class FxpMessageService {
	private $rootScope: IRootScope;
	private msgTimeout;
	private msgInterval;
	private $interval: angular.IIntervalService;
	private $timeout: any;
	private fxpConfigurationService: FxpConfigurationService;
	private trackIdLabel;
	private msgIDLabel;

	constructor($rootScope: IRootScope, $interval: angular.IIntervalService, $timeout, fxpConfigurationService: FxpConfigurationService,
		private fxpLoggerService: ILogger) {
		this.$rootScope = $rootScope;
		this.$timeout = $timeout;
		this.$rootScope.messages = [];
		this.$rootScope.messageClass = "modal-hide";
		this.$interval = $interval;
		this.msgTimeout = fxpConfigurationService.FxpAppSettings.FxpMessageTimeout;
		if (this.msgTimeout == "" || this.msgTimeout == null || isNaN(this.msgTimeout))
			this.msgTimeout = 2000;
		this.$rootScope.closeMessage = this.closeMessage.bind(this);
		this.trackIdLabel = fxpConfigurationService.FxpBaseConfiguration.FxpConfigurationStrings.UIStrings.MessageToasterTrackId;
		this.msgIDLabel = fxpConfigurationService.FxpBaseConfiguration.FxpConfigurationStrings.UIStrings.MessageID;
	}

	/**
	* Displays Error/Warning/Information messages on FXP and Focus
	* @method Fxp.Services.fxpMessageService.addMessage      
	* @param {string} a mandatory string value which contains Error/Warning/Information.          
	* @param {string} a mandatory string value determing type of messsage Error/Warning/Information.          
	* @example <caption> Example to invoke addMessage</caption>
	*  fxpMessageService.addMessage('Error from FXP', fxpConstants.messageType.error);
	*/
	addMessage = function (message: any, messageType: string, doNotAutoClose?: boolean, trackingId?: string, messageID?: string) {
		var $rootScope = this.$rootScope;
		var msgTrackId = trackingId ? this.trackIdLabel + trackingId : "";
		var msgID = messageID ? this.msgIDLabel + messageID : "";
		var isMsgItemExist = $rootScope.messages.some(function (item) {
			return item.MessageType == messageType && item.Message == message && item.trackId == msgTrackId && item.uniqueTransactionId == msgID;
		});
		if (isMsgItemExist) {
			return;
		}
		var msg: any = {};
		msg.msgDate = new Date();
		msg.MessageType = messageType || FxpConstants.messageType.info;
		msg.Message = message;
		msg.show = true;

		if (doNotAutoClose === true)
			msg.doNotAutoClose = doNotAutoClose;
		else
			msg.doNotAutoClose = false;

		msg.trackId = msgTrackId;
		msg.uniqueTransactionId = msgID;

		if (msg.MessageType == "error") {
			var propbag = this.fxpLoggerService.createPropertyBag();
			propbag.addToBag("ErrorMessage", message);
			propbag.addToBag("Location", window.location.hash);
			this.fxpLoggerService.logEvent("Fxp.MessageService", "ErrorDisplayed", propbag);
		}

		var $interval = this.$interval;
		var $timeout = this.$timeout;
		var msgInterval = this.msgInterval;
		var timeout = this.msgTimeout;

		this.$rootScope.messages.push(msg);

		this.$rootScope.messageClass = this.$rootScope.messages.length > 0 ? "modal-show" : "modal-hide";

		if (this.$rootScope.messages.length == 1 && $(":focus").length > 0) {
			this.$rootScope.activeElement = $(":focus");
		}

		if (this.$rootScope.messages.length > 0) {
			setTimeout(function () {
				var messagecontent = $(".message-content");
				if (messagecontent.length) {
					messagecontent[$rootScope.messages.length - 1].focus();
				}
			}, 100);
		}

		this.msgInterval = this.$interval(function () {
			var dt: any = new Date();
			var diff: number;
			for (var i = $rootScope.messages.length - 1; i >= 0; i--) {
				var messageType = $rootScope.messages[i].MessageType.toLowerCase();

				if (messageType == "success" || ((messageType == "warning" || messageType == "info") && !$rootScope.messages[i].doNotAutoClose)) {
					diff = dt - $rootScope.messages[i].msgDate;
					if (diff >= timeout)
						$rootScope.messages.splice(i, 1);
				}
			}

			if ($rootScope.messages.length == 0) {
				$interval.cancel(msgInterval);
				$rootScope.messageClass = "modal-hide";
				if ($rootScope.activeElement) {
					$timeout(function () {
						$rootScope.activeElement.focus();
						$rootScope.activeElement = undefined;
					}, 100);
				}
			}
		}, 1000);
	}

	/**
	* An event handler whenever message close button is clicked.
	* @method Fxp.Services.fxpMessageService.closeMessage
	* @param {onject} message An object which is passed from the view.
	* @example <caption> Example to use closeMessage</caption>
	*  <div ng-app="AppController"><div ng-click="closeMessage">Close Message</div></div>;
	*  <div ng-app="AppController as app"><div ng-click="app.closeMessage">closeMessage</div></div>;
	*/
	closeMessage = function (message) {
		var index = this.$rootScope.messages.indexOf(message);
		this.$rootScope.messages.splice(index, 1);
		this.$rootScope.messageClass = this.$rootScope.messages.length > 0 ? "modal-show" : "modal-hide";
		if (this.$rootScope.messages.length == 0) {
			this.$interval.cancel(this.msgInterval);

		}
		else
			setTimeout(function () { $(".message-content").focus(); }, 100);
	}
}