import { FxpConstants } from "../common/ApplicationConstants";
import { IRootScope } from "../interfaces/IRootScope";
import { ILogger } from "../interfaces/ILogger";
import { NotificationStore } from "./NotificationStore";
import { FxpBroadcastedEvents } from "./FxpBroadcastedEvents";

/**
 * @application  Fxp
 */
/**
 * @module Fxp.Services
 */
/**
   * A service to display Toast notifications
   * @class Fxp.Services.FxpToastNotificationService
   * @classdesc A service to display Toast notifications
   * @example <caption> Example to create an instance of FxpToastNotificationService</caption>
   *  //Initializing FxpToastNotification
   *  angular.module('FxPApp').controller('AppController', ['FxpToastNotificationService', AppController]);
   *  function AppController(fxpMessageService, fxpConstants){ FxpToastNotificationService.addMessage('New Resource Request', "rout","12"); }
   */
export class FxpToastNotificationService {
	constructor(
		private $rootScope: IRootScope,
		private notificationStore: NotificationStore,
		private fxpLoggerService: ILogger
	) {
		
	}

	/**
   * Method to fetch new toast notifications.
   * @method Fxp.Services.FxpToastNotificationService.getToastNotifications
   * @param {number} offset is an id of last notification.
   * @param {number} index is an optional index from where we need notifications to be fetched.
   * @param {number} count is an optional number of notification to be fetched.
   * @example <caption> Example to use getToastNotifications</caption>
   * fxpToastNotificationService.getToastNotifications(123);
   */
	checkToastNotifications = function (offset?, index?, count?) {
		// Start time for performance calculation.
		var startTime = performance.now(),
			self = this,
			propbag = self.fxpLoggerService.createPropertyBag();
		// Initializing count.
		count = count || 50;
		// Initializing index.
		index = index || 0;
		// Calling service to get new notifications.
		self.notificationStore.getNotifications(index, count, 'Unread', offset).then((response) => {
			var data = response.data;
			// Broadcasting new notifications.
			self.$rootScope.$broadcast(FxpBroadcastedEvents.OnNewNotificationsRecieved, data);
			// Checking possibility of more notifications.
			if (data.length == count) {
				// Calling service to get more notifications.
				self.checkToastNotifications(offset, (index + count));
			}
			// Logging event data.
			propbag.addToBag("Total Time", (performance.now() - startTime));
			self.fxpLoggerService.logEvent("Fxp.Controllers.FxpToastNotificationService", "GetToastNotifications", propbag);
		}, (error) => {
			// Logging error data.
			var message = self.$rootScope.fxpUIConstants.UIMessages.NotificationGetServiceError;
			propbag.addToBag(self.fxpConstants.metricConstants.Status, error.status);
			propbag.addToBag(self.fxpConstants.metricConstants.StatusText, error.statusText);
			self.fxpLoggerService.logError('Fxp.Services.FxpToastNotificationService', message.ErrorMessageTitle, 2940, null, propbag);
		});
	}
}