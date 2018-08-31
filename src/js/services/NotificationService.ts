import { INotificationService } from "../interfaces/INotificationService";
import { FxpConfigurationService } from "./FxpConfiguration";
import { IDataService } from "../interfaces/IDataService";

/**
 * @application  Fxp
 */
/**
 * @module Fxp.Services
 */
/**
    * A service to handle service call for notifications
    * @class Fxp.Services.NotificationService
    * @classdesc A service to handle service calls for notifications
    * @example <caption> Example to create an instance of NotificationService</caption>
    *  //Initializing NotificationService
    *  angular.module('FxPApp').controller('AppController', ['NotificationService', AppController]);
    *  function AppController(notificationService, fxpConstants){ notificationService.getUnreadNotificationCount(); }
    */
export class NotificationService implements INotificationService {
	private notificationCollection: any;
	private notificationApiBaseUrl: string;
	private fxpServiceEndPoint: string;
	private notificationApiWebNotifResourceUrl: string = "/webnotifications";

	constructor(
		private $http: angular.IHttpService,
		private fxpConfiguration: FxpConfigurationService,
		private fxpDataService: IDataService) {
		this.notificationApiBaseUrl = fxpConfiguration.FxpAppSettings.NotificationServiceEndpoint;
		this.fxpServiceEndPoint = fxpConfiguration.FxpAppSettings.FxpServiceEndPoint;
		this.notificationApiWebNotifResourceUrl = this.notificationApiBaseUrl + this.notificationApiWebNotifResourceUrl;
	}

	/**
	* Get Number of notifications which are unread
	* @method Fxp.Services.notificationService.getUnreadNotificationCount
	* @example <caption> Example to invoke getUnreadNotificationCount</caption>
	*  notificationService.getUnreadNotificationCount();
	*/
	getUnreadNotificationsCount(): angular.IPromise<number> {
		var urlGetUnreadNotificationsCount = this.notificationApiWebNotifResourceUrl + "/unreadcountforuser";

		return this.fxpDataService.get(urlGetUnreadNotificationsCount);
	}

	/**
	* Get notifications
	* @method Fxp.Services.notificationService.getNotifications
	* @param {number} startIndex mandatory number value which contains index after which notification is to be fetched.
	* @param {number} count mandatory number value which contains number of notification to be fetched.
	* @param {string} status optional string value which contains status of notifications to be fetched.
	* @param {number} offset optional number value which contains id of last notification fetched.
	* @example <caption> Example to invoke getNotifications</caption>
	*  notificationService.getNotifications(startIndex, count);
	*/
	getNotifications(startIndex, count, status?, offset?): angular.IPromise<any> {
		var urlGetNotiicationsByPage = this.notificationApiWebNotifResourceUrl + "?skipRecordCount=" + startIndex + "&batchSize=" + count;
		if (status) {
			urlGetNotiicationsByPage += "&status=" + status;
		}
		if (offset) {
			urlGetNotiicationsByPage += "&offset=" + offset;
		}

		return this.fxpDataService.get(urlGetNotiicationsByPage);
	}

	/**
	* Delete notification
	* @method Fxp.Services.notificationService.deleteNotification
	* @param {number} webNotificationId mandatory number value which contains id of the notification which is to be deleted.
	* @example <caption> Example to invoke deleteNotification</caption>
	*  notificationService.deleteNotification(webNotificationId);
	*/
	deleteNotification(webNotificationId): angular.IPromise<any> {
		var urlDeleteNotification = this.notificationApiWebNotifResourceUrl + "/" + webNotificationId;

		return this.$http.delete(urlDeleteNotification);
	}

	/**
	* Delete all notification
	* @method Fxp.Services.notificationService.deleteAllNotification
	* @example <caption> Example to invoke deleteAllNotification</caption>
	*  notificationService.deleteAllNotification();
	*/
	deleteAllNotification(): angular.IPromise<any> {
		var urlDeleteAllNotification = this.notificationApiWebNotifResourceUrl;

		return this.$http.delete(urlDeleteAllNotification);
	}

	/**
	* Mark notification as Read
	* @method Fxp.Services.notificationService.markNotificationAsRead
	* @param {number} webNotificationId mandatory number value which contains id of the notification which is to be marked as read.
	* @example <caption> Example to invoke markNotificationAsRead</caption>
	*  notificationService.markNotificationAsRead(webNotificationId);
	*/
	markNotificationAsRead(webNotificationId): angular.IPromise<any> {
		var urlMarkAsRead = this.notificationApiWebNotifResourceUrl + "/" + webNotificationId;

		return this.$http.patch(urlMarkAsRead, { "Status": "Read" });
	}

	/**
	* Mark all notification as Read
	* @method Fxp.Services.notificationService.markAllNotificationAsRead
	* @example <caption> Example to invoke markAllNotificationAsRead</caption>
	*  notificationService.markAllNotificationAsRead();
	*/
	markAllNotificationsAsRead(): angular.IPromise<any> {
		var urlMarkAllAsRead = this.notificationApiWebNotifResourceUrl + "/markallasread";

		return this.$http.patch(urlMarkAllAsRead, {});
	}

	/**
	* Publish Notification
	* @method Fxp.Services.notificationService.publishNotifications
	* @example <caption> Example to invoke publishNotifications</caption>
	*  notificationService.publishNotifications();
	*/
	publishNotifications(notificationArray): angular.IPromise<any> {
		var urlPublish = this.notificationApiWebNotifResourceUrl + "/publish";

		return this.$http.post(
			urlPublish,
			notificationArray,
			{
				headers:
				{
					'Content-Type': 'application/json; charset=UTF-8'
				}
			});
	}
	/**
	* Publish Notification
	* @method Fxp.Services.notificationService.publishNotificationsRolesRoleGroup
	* @example <caption> Example to invoke publishNotificationsRolesRoleGroup</caption>
	*  notificationService.publishNotificationsRolesRoleGroup();
	*/
	publishNotificationsRolesRoleGroup(notificationArray): angular.IPromise<any> {
		var urlPublish = this.fxpServiceEndPoint + "/notification";

		return this.$http.post(
			urlPublish,
			notificationArray,
			{
				headers:
				{
					'Content-Type': 'application/json; charset=UTF-8'
				}
			});
	}
}