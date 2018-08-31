
export interface INotificationService {
	getUnreadNotificationsCount(): angular.IPromise<number>;
	getNotifications(startIndex, count): angular.IPromise<any>;
	deleteNotification(webNotificationId): angular.IPromise<any>;
	deleteAllNotification(): angular.IPromise<any>;
	markNotificationAsRead(webNotificationId): angular.IPromise<any>;
	markAllNotificationsAsRead(): angular.IPromise<any>;
	publishNotifications(notificationArray): angular.IPromise<any>;
}