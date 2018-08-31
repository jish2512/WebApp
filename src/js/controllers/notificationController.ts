/**
 * @application  Fxp
 */
/**
 * @module Fxp.Controllers
 */
import { FxpConstants, ApplicationConstants } from "../common/ApplicationConstants";
import { IRootScope } from "../interfaces/IRootScope";
import { FxpConfigurationService } from "../services/FxpConfiguration";
import { NotificationStore } from "../services/NotificationStore";
import { NotificationActionCenter } from "../services/NotificationActionCenter";
import { FxpToastNotificationService } from "../services/FxpToastNotificationService";
import { ILogger } from "../interfaces/ILogger";
import { SettingsServiceProvider } from "../provider/SettingsServiceProvider";
import { UserInfoService } from "../services/UserInfoService";
import { FxpMessageService } from "../services/FxpMessageService";
import { FxpContext } from "../context/FxpContext";
import { CommonUtils } from "../utils/CommonUtils";
import { SettingsType } from "../common/SettingsType";
import { ISettingsService } from "../interfaces/ISettingsService";
import { FxpBroadcastedEvents } from "../services/FxpBroadcastedEvents";

/**
	* This is the controller having functionality and data for Notifications.
	* @class Fxp.Controllers.NotificationsController
	* @classdesc A controller of FxpApp module
	* @example <caption> 
	*  //To Use NotificationsController
	*  angular.module('FxPApp').controller('NotificationsController', ['AnyDependency', NotificationsController]);
	*  function NotificationsController(AnyDependency){ AnyDependency.doSomething(); }
	*/
export class NotificationsController {
	// Private variables
	private notificationLimit: number;
	private notificationList: any;
	private unreadNotificationCount: number;
	private currentOffset: number;
	private notificationCollection: any;
	private isNotificationFlyoutOpen: boolean;
	private hasNotificationError: boolean;
	private notificationErrorMsg: any;
	private fxpConstants: FxpConstants;
	private notifcationCountPollInterval: number;
	private offsetExpirationInterval: number;
	private moreNotificationsAvailable: boolean;
	private unreadPollIntervalPromise: angular.IPromise<any>;
	private offsetExpirationPromise: angular.IPromise<any>;

	constructor(
		private $rootScope: IRootScope,
		private $scope: angular.IScope,
		private $window: angular.IWindowService,
		private $interval: angular.IIntervalService,
		private fxpConfigurationService: FxpConfigurationService,
		private $timeout: any,
		private notificationStore: NotificationStore,
		private notificationActionCenter: NotificationActionCenter,
		private toastNotificationService: FxpToastNotificationService,
		private fxpLoggerService: ILogger,
		private settingsService: ISettingsService,
		private userInfoService: UserInfoService,
		private fxpMessage: FxpMessageService,
		private fxpContext: FxpContext,
		private device: any
	) {
		//Initializes value
		var self = this;
		self.unreadNotificationCount = 0;
		self.currentOffset = 0;
		self.notificationCollection = [];
		self.isNotificationFlyoutOpen = false;
		self.hasNotificationError = false;
		self.notificationErrorMsg = "";
		self.moreNotificationsAvailable = false;
		self.notifcationCountPollInterval = self.fxpConfigurationService.FxpBaseConfiguration.NotificationConfiguration ? (self.fxpConfigurationService.FxpBaseConfiguration.NotificationConfiguration.PollingInterval || 5000) : 5000;
		self.offsetExpirationInterval = self.fxpConfigurationService.FxpBaseConfiguration.NotificationConfiguration ? (self.fxpConfigurationService.FxpBaseConfiguration.NotificationConfiguration.OffsetExpirationInterval || 1800000) : 1800000;
		self.notificationLimit = self.fxpConfigurationService.FxpBaseConfiguration.NotificationConfiguration ? (self.fxpConfigurationService.FxpBaseConfiguration.NotificationConfiguration.DefaultNotificationLimit || 20) : 20;
		self.pauseNotificationsPoll = this.pauseNotificationsPoll.bind(self);
		self.resumeNotificationsPoll = this.resumeNotificationsPoll.bind(self);
		self.pollNotificationUnreadCount();
		angular.element($window).on("blur", self.pauseNotificationsPoll);
		angular.element($window).on("focus", self.resumeNotificationsPoll);

		self.$scope.$on('$destroy', function cleanUpPollingTimer() {
			if (self.offsetExpirationPromise) {
				self.$timeout.cancel(self.offsetExpirationPromise);
				self.offsetExpirationPromise = null;
			}
			if (self.unreadPollIntervalPromise) {
				self.$interval.cancel(self.unreadPollIntervalPromise);
				self.unreadPollIntervalPromise = null;

				angular.element($window).off("blur", self.pauseNotificationsPoll);
				angular.element($window).off("focus", self.resumeNotificationsPoll);
			}
		});
		self.$scope.$on(FxpBroadcastedEvents.OnReduceReadNotificationCount, function reduceNotificationCount(event, count) {
			self.unreadNotificationCount = self.unreadNotificationCount - count;
		});
	}

	/**
   * An event handler whenever notification flyout is closed using close icon.
   * @method Fxp.Controllers.NotificationsController.closeNotificationFlyout
   * @example <caption> Example to use closeNotificationFlyout</caption>
   * <div ng-click="closeNotificationFlyout()">Dropdown closed</div>;
   */
	closeNotificationFlyout(): void {
		var self = this;
		self.isNotificationFlyoutOpen = false;
		$("#notification-open").focus();
	}

	/**
	  *A method to Get the notifications
	  * @method Fxp.Controllers.NotificationsController.getNotifications
	  * @param {number} index is an index from where notifications are to be fetched.
	  * @param {number} count is a number of records to be fetched.
	  * @param {number?} currentIndex is an index where focus is now.
	  * @example <caption> Example to use getNotifications</caption>
	  * NotificationsController.getNotifications()
	  */
	getNotifications = function (index, count, currentIndex?) {
		// Start time for performance calculation.
		var startTime = performance.now(),
			self = this,
			propbag = self.fxpLoggerService.createPropertyBag();
		if (self.isNotificationFlyoutOpen) {
			self.notificationStore.getNotifications(index, count).then((response) => {
				var data = response.data;
				data = self.notificationActionCenter.appendPropertiesToNotifications(data);
				self.moreNotificationsAvailable = data.length == count;
				self.notificationCollection = index ? self.notificationCollection.concat(data) : data;
				self.removeErrorMessage();
				self.getUnreadNotificationCount();
				if (index) {
					currentIndex = currentIndex || currentIndex == 0 ? currentIndex : index;
					self.$timeout(function () { self.setFocusOnNotification(currentIndex); });
				}
				propbag.addToBag("Total Time", (performance.now() - startTime));
				self.fxpLoggerService.logEvent("Fxp.Controllers.NotificationsController", "GetNotifications", propbag);
			}, (error) => {
				self.logError(error, self.$rootScope.fxpUIConstants.UIMessages.NotificationGetServiceError, 2940);
			});
		}
	}

	/**
	  *A method to Get the unread notification count
	  * @method Fxp.Controllers.NotificationsController.getUnreadNotificationCount
	  * @example <caption> Example to use getUnreadNotificationCount</caption>
	  * NotificationsController.getUnreadNotificationCount()
	  */
	getUnreadNotificationCount = function () {
		// Start time for performance calculation.
		var startTime = performance.now(),
			self = this,
			propbag = self.fxpLoggerService.createPropertyBag();
		self.notificationStore.getUnreadNotificationCount().then((response) => {
			var offset = parseInt(response.data.CurrentOffset);
			self.unreadNotificationCount = parseInt(response.data.UnreadCount);
			if (self.isToastNotificationNeeded(offset)) {
				self.toastNotificationService.checkToastNotifications(self.currentOffset);
			}
			self.currentOffset = offset;
			if (!self.isNotificationFlyoutOpen) {
				self.removeErrorMessage();
			}
			propbag.addToBag("Total Time", (performance.now() - startTime));
			self.fxpLoggerService.logEvent("Fxp.Controllers.NotificationsController", "GetUnreadNotificationCount", propbag);
		}, (error) => {
			self.logError(error, self.$rootScope.fxpUIConstants.UIMessages.NotificationGetCountServiceError, 2941);
		});
	}

	/**
	  *A method to check whether toast notifications are needed
	  * @method Fxp.Controllers.NotificationsController.isToastNotificationNeeded
	  * @param {number} offset is an id last notifications fetched.
	  * @example <caption> Example to use isToastNotificationNeeded</caption>
	  * NotificationsController.isToastNotificationNeeded()
	  */
	isToastNotificationNeeded(offset): boolean {
		var self = this,
			result = !self.device.isMobile() &&
				self.currentOffset != 0 &&
				offset > self.currentOffset &&
				!self.isNotificationFlyoutOpen &&
				!self.$rootScope.isNotificationDNDEnabled &&
				!self.$rootScope.actOnBehalfOfUserActive;
		return result;
	}

	/**
	*A method to mark all notifications as read
	* @method Fxp.Controllers.NotificationsController.markAllNotificationsAsRead
	* @example <caption> Example to use markAllNotificationsAsRead</caption>
	* <div ng-click="markAllNotificationsAsRead()">markAllNotificationsAsRead()</div>
	*/
	markAllNotificationsAsRead(): void {
		// Start time for performance calculation.
		var startTime = performance.now(),
			self = this,
			propbag = self.fxpLoggerService.createPropertyBag();
		self.notificationStore.markNotificationAsRead().then((response) => {
			self.notificationCollection.forEach(function (item) {
				item.Status = "Read";
			});
			self.unreadNotificationCount = 0;
			propbag.addToBag("Total Time", (performance.now() - startTime).toString());
			self.fxpLoggerService.logEvent("Fxp.Controllers.NotificationsController", "MarkAllNotificationsAsRead", propbag);
		}, (error) => {
			self.logError(error, self.$rootScope.fxpUIConstants.UIMessages.NotificationReadServiceError, 2943);
		});
	}
	/**
	*A method to delete all notifications
	* @method Fxp.Controllers.NotificationsController.dismissAllNotifications
	* @example <caption> Example to use dismissAllNotifications</caption>
	* <div ng-click="dismissAllNotifications()">dismissAll()</div>
	*/
	dismissAllNotifications(): void {
		// Start time for performance calculation.
		var startTime = performance.now(),
			self = this,
			propbag = self.fxpLoggerService.createPropertyBag();
		self.notificationStore.deleteNotification(-1).then((response) => {
			self.notificationCollection = [];
			self.moreNotificationsAvailable = false;
			self.unreadNotificationCount = 0;
			CommonUtils.pullFocusToElement("closeNotification");
			propbag.addToBag("Total Time", (performance.now() - startTime).toString());
			self.fxpLoggerService.logEvent("Fxp.Controllers.NotificationsController", "DismissAllNotifications", propbag);
		}, (error) => {
			self.logError(error, self.$rootScope.fxpUIConstants.UIMessages.NotificationDeleteServiceError, 2942);
		});
	}
	/**
	*A method to load notifications based on the default limit
	* @method Fxp.Controllers.NotificationsController.loadMore
	* @param {any} event is a DOM Object that generated on action.
	* @example <caption> Example to use loadMore</caption>
	* <div ng-click="loadMore(event)">load More</div>
	*/
	loadMore(event): void {
		var self = this;
		event.stopPropagation();
		event.preventDefault();
		var totalNotificationCount = self.notificationCollection.length;
		self.getNotifications(totalNotificationCount, self.notificationLimit);
	}
	/**
	 *A method to  set the focus on available notification subject
	 * @method Fxp.Controllers.NotificationsController.setFocusOnNotification
	 * @param {number} notificationItemIndex is a notification number which specifies Notification limit before loading more.
	 * @example <caption> Example to use setFocusOnNotification</caption>
	 * NotificationsController.setFocusOnNotification(notificationItemIndex)
	 */
	setFocusOnNotification(notificationItemIndex): void {
		var notificationList = $("li.notification");
		notificationItemIndex = notificationItemIndex < notificationList.length ? notificationItemIndex : notificationList.length - 1;
		$(notificationList[notificationItemIndex]).find(".notification-subject").focus();
	}

	/**
	 *A method to make the unread notifications to read
	 * @method Fxp.Controllers.NotificationsController.readNotification
	 * @param {any} item is a notification object to be read.
	 * @example <caption> Example to use readNotification</caption>
	 * <div ng-click="readNotification(item)">load More</div>
	 */
	readNotification(item): void {
		// Start time for performance calculation.
		var startTime = performance.now(),
			self = this,
			propbag = self.fxpLoggerService.createPropertyBag();
		try {
			self.notificationActionCenter.excecuteNotificationAction(item);
			if (item != undefined && item != null && item.Status == "UnRead") {
				self.notificationStore.markNotificationAsRead(item.WebNotificationId).then((response) => {
					var notificationIndex = self.notificationCollection.indexOf(item);
					self.notificationCollection[notificationIndex].Status = "Read";
					propbag.addToBag("EventId", item.EventId);
					propbag.addToBag("Notification Id", item.WebNotificationId);
					propbag.addToBag("From", item.From);
					propbag.addToBag("Total Time", (performance.now() - startTime).toString());
					self.fxpLoggerService.logEvent("Fxp.Controllers.NotificationsController", "ReadNotification", propbag);
				}, (error) => {
					self.logError(error, self.$rootScope.fxpUIConstants.UIMessages.NotificationReadServiceError, 2943);
				});
			}
		} catch (error) {
			self.logError(error, self.$rootScope.fxpUIConstants.UIMessages.NotificationReadServiceError, 2943);
		}
	}

	/**
	 *A method to  delete the notificaiton based on the webnotification id
	 * @method Fxp.Controllers.NotificationsController.deleteNotification
	 * @param {any} item is a notification object to be deleted.
	 * @param {any} event is a DOM Object that generated on action.
	 * @example <caption> Example to use deleteNotification</caption>
	 * NotificationsController.deleteNotification()
	 */
	deleteNotification = function (item, event) {
		// Start time for performance calculation.
		var startTime = performance.now(),
			self = this,
			propbag = self.fxpLoggerService.createPropertyBag();
		event.stopPropagation();
		event.preventDefault();
		self.notificationStore.deleteNotification(item.WebNotificationId).then((response) => {
			var itemIndex = self.notificationCollection.indexOf(item);
			if (itemIndex >= 0) {
				self.notificationCollection.splice(itemIndex, 1);
				var totalNotificationsCount = self.notificationCollection.length;
				self.getNotifications(totalNotificationsCount, 1, itemIndex);
				var propbag = self.fxpLoggerService.createPropertyBag();
				propbag.addToBag("EventId", item.EventId);
				propbag.addToBag("Notification Id", item.WebNotificationId);
				propbag.addToBag("From", item.From);
				propbag.addToBag("Total Time", (performance.now() - startTime));
				self.fxpLoggerService.logEvent("Fxp.Controllers.NotificationsController", "DeleteNotification", propbag);
			}
		}, (error) => {
			self.logError(error, self.$rootScope.fxpUIConstants.UIMessages.NotificationDeleteServiceError, 2942);
		});
	}

	/**
	*A method to set the error message on notificaiton flyout
	* @method Fxp.Controllers.NotificationsController.setErrorMessage
	* @param {string}  msg is a error message to be shown on notificaiton flyout
	* @example <caption> Example to use setErrorMessage</caption>
	* NotificationsController.setErrorMessage(msg)
	*/
	setErrorMessage = function (msg) {
		var self = this;
		self.hasNotificationError = true;
		self.notificationErrorMsg = msg;
	};

	/**
	*A method to remove the error message on notificaiton flyout
	* @method Fxp.Controllers.NotificationsController.removeErrorMessage
	* @example <caption> Example to use removeErrorMessage</caption>
	* NotificationsController.removeErrorMessage(msg)
	*/
	removeErrorMessage = function () {
		var self = this;
		self.hasNotificationError = false;
		self.notificationErrorMsg = "";
	};

	/**
	*A method to poll for notification count
	* @method Fxp.Controllers.NotificationsController.pollNotificationUnreadCount
	* @example <caption> Example to use pollNotificationUnreadCount</caption>
	* NotificationsController.pollNotificationUnreadCount()
	*/
	pollNotificationUnreadCount(): void {
		var self = this;
		if (self.notifcationCountPollInterval > 0) {
			self.unreadPollIntervalPromise = this.$interval(function notificationPollJob() {
				if (!self.$window.document.hidden) {
					self.getUnreadNotificationCount();
				}
			}, self.notifcationCountPollInterval);
		};
	}

	/**
	* A method to pause poll for notification count
	* @method Fxp.Controllers.NotificationsController.pauseNotificationsPoll
	* @example <caption> Example to use pauseNotificationsPoll</caption>
	* NotificationsController.pauseNotificationsPoll()
	*/
	pauseNotificationsPoll() {
		var self = this;
		self.$timeout(function stopNotificationPoll() {
			if (self.unreadPollIntervalPromise) {
				self.$interval.cancel(self.unreadPollIntervalPromise);
				// Start offset expiration timer.
				self.offsetExpirationPromise = self.$timeout(function () {
					// Reset current offset to 0;
					self.currentOffset = 0;
					// Make offset expiration timer to null.
					self.offsetExpirationPromise = null;
				}, self.offsetExpirationInterval);
				self.unreadPollIntervalPromise = null;
			}
		});
	}

	/**
	*A method to resume poll for notification count
	* @method Fxp.Controllers.NotificationsController.resumeNotificationsPoll
	* @example <caption> Example to use resumeNotificationsPoll</caption>
	* NotificationsController.resumeNotificationsPoll()
	*/
	resumeNotificationsPoll() {
		var self = this;
		self.$timeout(function startNotificationPoll() {
			// Check if offset expiration timer exist.
			if (self.offsetExpirationPromise) {
				// Stop offset expiration timer.
				self.$timeout.cancel(self.offsetExpirationPromise);
				// Make offset expiration timer to null.
				self.offsetExpirationPromise = null;
			}
			self.getUnreadNotificationCount();
			self.pollNotificationUnreadCount();
		});
	}

	/**
	*A method to log error
	* @method Fxp.Controllers.NotificationsController.logError
	* @param {any} error is a error object
	* @example <caption> Example to use sortObject</caption>
	* NotificationsController.logError(error)
	*/
	logError(error, message, code): void {
		var self = this;
		var propbag = self.fxpLoggerService.createPropertyBag();
		propbag.addToBag(FxpConstants.metricConstants.Status, error.status);
		propbag.addToBag(FxpConstants.metricConstants.StatusText, error.statusText);
		self.fxpLoggerService.logError('Fxp.Controllers.NotificationsController', message.ErrorMessageTitle, code, null, propbag);
		self.setErrorMessage(message.ErrorMessage);
	}


	/**
	*A method on DND Setting value change
	* @method Fxp.Controllers.NotificationsController.onDNDValueChange
	* @param {boolean} value is a boolean value
	* @example <caption> Example to use onDNDValueChange</caption>
	* NotificationsController.onDNDValueChange(true)
	*/
	onDNDValueChange(value: boolean): void {
		var self = this;
		self.$rootScope.isNotificationDNDEnabled = value;
		self.saveNotificationDNDSetting(value);
	}

	/**
   *A method to save the Notification DND Setting
   * @method Fxp.Controllers.NotificationsController.saveNotificationDNDSetting
   * @param {boolean} value is a boolean value
   * @example <caption> Example to use saveNotificationDNDSetting</caption>
   * NotificationsController.saveNotificationDNDSetting(true)
   */
	saveNotificationDNDSetting(value: boolean): void {
		let self = this;
		let userAlias = self.userInfoService.getLoggedInUser();
		var propbag = self.fxpLoggerService.createPropertyBag();
		let userPreferencesStorageKey = ApplicationConstants.UserPreferencesStorageKey.replace('{0}', userAlias);
		self.fxpContext.readContext(userPreferencesStorageKey, ApplicationConstants.FxPAppName).then(function (context) {
			let userPreferences = (context && context.Result) ? JSON.parse(context.Result) : {};
			userPreferences.isNotificationDNDEnabled = value;
			let strUserPreferences = JSON.stringify(userPreferences);
			let saveSettingsAPIStartTime = performance.now();
			self.settingsService.saveSettings(SettingsType.User, userAlias, ApplicationConstants.UserPreferencesSettings,
				strUserPreferences).then(function (response) {
					var saveSettingsAPIDuration = performance.now() - saveSettingsAPIStartTime;
					var notificationDNDStatus = userPreferences.isNotificationDNDEnabled ? "Enabled" : "Disabled";
					propbag.addToBag("NotificationDNDStatus", notificationDNDStatus);
					propbag.addToBag(FxpConstants.metricConstants.SaveSettingsAPIResponseDuration, saveSettingsAPIDuration.toString());
					self.fxpLoggerService.logEvent('Fxp.Client.NotificationsController', "Fxp.NotificationsController.NotificationDNDStatusChange", propbag);
					self.fxpContext.saveContext(userPreferencesStorageKey, strUserPreferences, ApplicationConstants.FxPAppName);
				}, function (error) {
					propbag.addToBag(FxpConstants.metricConstants.Status, error.status);
					propbag.addToBag(FxpConstants.metricConstants.StatusText, error.statusText + ' ' + error.data);
					self.fxpMessage.addMessage(self.$rootScope.fxpUIConstants.UIMessages.DNDSaveSettingsFailedError.ErrorMessage, FxpConstants.messageType.error);
					self.fxpLoggerService.logError('Fxp.Client.NotificationsController', self.$rootScope.fxpUIConstants.UIMessages.DNDSaveSettingsFailedError.ErrorMessageTitle, "3503", null, propbag);
				});

		})
	}

}