import { IRootScope } from "../interfaces/IRootScope";
import { NotificationService } from "./NotificationService";
import { FxpBroadcastedEvents } from "./FxpBroadcastedEvents";
/**
 * @application  Fxp
 */
/**
 * @module Fxp.Services
 */
/**
* A service to handle service call for notifications
* @class Fxp.Services.NotificationStore
* @classdesc A service to handle service calls for notifications
* @example <caption> Example to create an instance of NotificationStore</caption>
*  //Initializing NotificationService
*  angular.module('FxPApp').controller('AppController', ['NotificationStore', AppController]);
*  function AppController(notificationStore, fxpConstants){ notificationStore.getUnreadNotificationCount(); }
*/
export class NotificationStore {
	constructor(
		private $rootScope: IRootScope,
		private $q: angular.IQService,
		private notificationService: NotificationService
	) {
	}

	/**
	* Get Number of notifications which are unread
	* @method Fxp.Services.notificationStore.getUnreadNotificationCount
	* @example <caption> Example to invoke getUnreadNotificationCount</caption>
	*  notificationStore.getUnreadNotificationCount();
	*/
	getUnreadNotificationCount(): angular.IPromise<any> {
		var self = this,
			defered = self.$q.defer();
		self.notificationService.getUnreadNotificationsCount().then((response) => {
			defered.resolve(response);
		}, (error) => {
			defered.reject(error);
		});
		return defered.promise;
	}

	/**
	* Get notifications
	* @method Fxp.Services.notificationStore.getNotifications
	* @param {number} startIndex mandatory number value which contains index after which notification is to be fetched.
	* @param {number} count mandatory number value which contains number of notification to be fetched.
	* @param {string} status optional string value which contains status of notification to be fetched.
	* @param {number} offset optional number value which contains id of last notification fetched.
	* @example <caption> Example to invoke getNotifications</caption>
	*  notificationStore.getNotifications(startIndex, count);
	*/
	getNotifications(startIndex, count, status?, offset?): angular.IPromise<any> {
		var self = this,
			defered = self.$q.defer();
		self.notificationService.getNotifications(startIndex, count, status, offset).then((response) => {
			defered.resolve(response);
		}, (error) => {
			defered.reject(error);
		});
		return defered.promise;
	}

	/**
	* Delete notification
	* @method Fxp.Services.notificationStore.deleteNotification
	* @param {number} webNotificationId mandatory number value which contains id of the notification which is to be deleted.
	* @example <caption> Example to invoke deleteNotification</caption>
	*  notificationStore.deleteNotification(webNotificationId);
	*/
	deleteNotification(webNotificationId): angular.IPromise<any> {
		var self = this,
			defered = self.$q.defer();
		if (webNotificationId >= 0) {
			//Delete particular notification
			self.notificationService.deleteNotification(webNotificationId).then((response) => {
				defered.resolve(response);
			}, (error) => {
				defered.reject(error);
			});
		} else {
			//Delete all notification
			self.notificationService.deleteAllNotification().then((response) => {
				defered.resolve(response);
			}, (error) => {
				defered.reject(error);
			});
		}
		return defered.promise;
	}

	/**
	* Mark notification as Read
	* @method Fxp.Services.notificationStore.markNotificationAsRead
	* @param {number} webNotificationId mandatory number value which contains id of the notification which is to be marked as read.
	* @example <caption> Example to invoke markNotificationAsRead</caption>
	*  notificationStore.markNotificationAsRead(webNotificationId);
	*/
	markNotificationAsRead(webNotificationId?): angular.IPromise<any> {
		var self = this,
			defered = self.$q.defer();
		if (webNotificationId) {
			//Mark particular notification as Read
			self.notificationService.markNotificationAsRead(webNotificationId).then((response) => {
				// Broadcasting event for reducing unread notification count.
				self.$rootScope.$broadcast(FxpBroadcastedEvents.OnReduceReadNotificationCount, 1);
				defered.resolve(response);
			}, (error) => {
				defered.reject(error);
			});
		} else {
			//Mark particular notification as Read
			self.notificationService.markAllNotificationsAsRead().then((response) => {
				defered.resolve(response);
			}, (error) => {
				defered.reject(error);
			});
		}
		return defered.promise;
	}

	/**
	* Publish notifications
	* @method Fxp.Services.notificationStore.publishNotifications
	* @param {any} notificationArray array of notification object.
	* @example <caption> Example to invoke publishNotifications</caption>
	*  notificationStore.publishNotifications(startIndex, count);
	*/
	publishNotifications(notificationArray): angular.IPromise<any> {
		var self = this,
			defered = self.$q.defer();
		self.notificationService.publishNotifications(notificationArray).then((response) => {
			defered.resolve(response);
		}, (error) => {
			defered.reject(error);
		});
		return defered.promise;
	}
	/**
	* Publish notifications
	* @method Fxp.Services.notificationStore.publishNotificationsRolesRoleGroup
	* @param {any} notificationArray array of notification object.
	* @example <caption> Example to invoke publishNotificationsRolesRoleGroup</caption>
	*  notificationStore.publishNotificationsRolesRoleGroup(notificationArray);
	*/
	publishNotificationsRolesRoleGroup(notificationArray): angular.IPromise<any> {
		var self = this,
			defered = self.$q.defer();
		self.notificationService.publishNotificationsRolesRoleGroup(notificationArray).then((response) => {
			defered.resolve(response);
		}, (error) => {
			defered.reject(error);
		});
		return defered.promise;
	}
}