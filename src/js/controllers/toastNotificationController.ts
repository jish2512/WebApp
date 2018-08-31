/**
 * @application  Fxp
 */
/**
 * @module Fxp.Controllers
 */
import { FxpConstants } from "../common/ApplicationConstants";
import { FxpConfigurationService } from "../services/FxpConfiguration";
import { IRootScope } from "../interfaces/IRootScope";
import { NotificationStore } from "../services/NotificationStore";
import { NotificationActionCenter } from "../services/NotificationActionCenter";
import { FxpMessageService } from "../services/FxpMessageService";
import { ILogger } from "../interfaces/ILogger";
import { CommonUtils } from "../utils/CommonUtils";
import { FxpBroadcastedEvents } from "../services/FxpBroadcastedEvents";

/**
   * This is the controller having functionality and data for Toast Notifications.
   * @class Fxp.Controllers.ToastNotificationController
   * @classdesc A controller of FxpApp module
   * @example <caption> 
   *  //To Use ToastNotificationController
   *  angular.module('FxPApp').controller('ToastNotificationController', ['AnyDependency', ToastNotificationController]);
   *  function ToastNotificationController(AnyDependency){ AnyDependency.doSomething(); }
   */
export class ToastNotificationController {
	private toastNotifications: any;
	private toastNotificationLimit: number;
	private fxpConstants: FxpConstants;
	constructor(
		$scope: any,
		private $rootScope: IRootScope,
		private $window: angular.IWindowService,
		private $timeout: any,
		private fxpConfigurationService: FxpConfigurationService,
		private notificationStore: NotificationStore,
		private notificationActionCenter: NotificationActionCenter,
		private fxpMessage: FxpMessageService,
		private fxpLoggerService: ILogger
	) {
		var self = this,
			// Callback method when new notifications arrive.
			addToastNotifications = function (event, notifications) {
				// Appending icons to new notifications
				notifications = self.notificationActionCenter.appendPropertiesToNotifications(notifications);
				// Appending new notifications to collection.
				self.toastNotifications = self.toastNotifications.concat(notifications);
			};
		self.fxpConstants = FxpConstants;
		// Initialize collection.
		self.toastNotifications = [];
		// Set toast notification limit.
		self.toastNotificationLimit = CommonUtils.isNullOrEmpty(fxpConfigurationService.FxpBaseConfiguration.NotificationConfiguration.ToastNotificationLimit) ? 10 : parseInt(fxpConfigurationService.FxpAppSettings.ToastNotificationLimit);
		$scope.$on(FxpBroadcastedEvents.OnNewNotificationsRecieved, addToastNotifications);
	}

	/**
   * Method to read toast notification.
   * @method Fxp.Controllers.ToastNotificationController.readToastNotification
   * @param {any} notification is an object of containing details of notification.
   * @example <caption> Example to use readToastNotification</caption>
   * <div ng-click="readToastNotification({'Subject': 'new request','From': 'ResourceManagement'})">read notification</div>;
   */
	readToastNotification = function (notification) {
		var startTime = performance.now(),
			self = this,
			propbag = self.fxpLoggerService.createPropertyBag();
		// Perform Navigation.
		try {
			self.notificationActionCenter.excecuteNotificationAction(notification);
		} catch (error) {
			var message = self.$rootScope.fxpUIConstants.UIMessages.NotificationNavigationError;
			// Show error.
			self.fxpMessage.addMessage(message.ErrorMessage, self.fxpConstants.messageType.error);
			// Log error details.
			propbag.addToBag(self.fxpConstants.metricConstants.Status, error.status);
			propbag.addToBag(self.fxpConstants.metricConstants.StatusText, error.statusText);
			self.fxpLoggerService.logError('Fxp.Controllers.ToastNotificationController', message.ErrorMessageTitle, 2943, null, propbag);
		}
		// Recreate property bag.
		propbag = self.fxpLoggerService.createPropertyBag()
		// Mark Notification as read.
		self.notificationStore.markNotificationAsRead(notification.WebNotificationId).then((response) => {
			// Add notificaton EventId to prop bag.
			propbag.addToBag("EventId", notification.EventId);
			// Add notificaton id to prop bag.
			propbag.addToBag("Notification Id", notification.WebNotificationId);
			// Add more notification info.
			propbag.addToBag("From", notification.From);
			// Closing Notification Toast.
			self.closeToastNotification(notification);
			// Log event.
			propbag.addToBag("Total Time", (performance.now() - startTime));
			self.fxpLoggerService.logEvent("Fxp.Controllers.ToastNotificationController", "ReadNotification", propbag);
		}, (error) => {
			var message = self.$rootScope.fxpUIConstants.UIMessages.ToastNotificationReadError;
			// Show error.
			self.fxpMessage.addMessage(message.ErrorMessage, self.fxpConstants.messageType.error);
			// Log error details.
			propbag.addToBag(self.fxpConstants.metricConstants.Status, error.status);
			propbag.addToBag(self.fxpConstants.metricConstants.StatusText, error.statusText);
			self.fxpLoggerService.logError('Fxp.Controllers.ToastNotificationController', message.ErrorMessageTitle, 2943, null, propbag);
		});
	}

	/**
   * Method to read toast notification.
   * @method Fxp.Controllers.ToastNotificationController.closeToastNotification
   * @param {any} notification is an object of containing details of notification.
   * @example <caption> Example to use closeToastNotification</caption>
   * <div ng-click="closeToastNotification({'Subject': 'new request','From': 'ResourceManagement'})">Close notification</div>;
   */
	closeToastNotification = function (notification) {
		var self = this,
			// Find index of current notification.
			index = self.toastNotifications.indexOf(notification);
		// Remove notification from collection.
		self.toastNotifications.splice(index, 1);
	}
}