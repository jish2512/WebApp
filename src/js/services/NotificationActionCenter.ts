import { FxpRouteService } from "./FxpRouteService";
import { FxpConfigurationService } from "./FxpConfiguration";
import { IRootScope } from "../interfaces/IRootScope";
import {StateService} from "@uirouter/core"
/**
 * @application  Fxp
 */
/**
 * @module Fxp.Services
 */
/**
   * A service to handle notification actions
   * @class Fxp.Services.NotificationActionCenter
   * @classdesc A service to handle actions for Notifications
   * @example <caption> Example to create an instance of NotificationActionCenter</caption>         
   *  //Initializing NotificationActionCenter
   *  angular.module('FxPApp').controller('AppController', ['NotificationActionCenter', AppController]);
   *  function AppController(notificationActionCenter, fxpConstants){ notificationActionCenter.excecuteNotificationAction('New Resource Request'); }
   */
export class NotificationActionCenter {
	private notificationActions: any;
	private iconConfiguration: any;
	constructor(
		private $rootScope: IRootScope,
		private $state: StateService,
		fxpConfigurationService: FxpConfigurationService,
		private fxpRouteService: FxpRouteService
	) {
		this.notificationActions = fxpConfigurationService.FxpBaseConfiguration.NotificationConfiguration ? fxpConfigurationService.FxpBaseConfiguration.NotificationConfiguration.ActionConfiguration : [];
		this.iconConfiguration = fxpConfigurationService.FxpBaseConfiguration.NotificationConfiguration ? fxpConfigurationService.FxpBaseConfiguration.NotificationConfiguration.IconConfiguration : [];
	}

	/**
        * Navigate to a state/url based on the subject passed
        * @method Fxp.Services.notificationActionCenter.excecuteNotificationAction
        * @param {any} is an object of containing details of notification.
        * @example <caption> Example to invoke excecuteNotificationAction</caption>
        *  notificationActionCenter.excecuteNotificationAction('New Resource Request');
        */
	   excecuteNotificationAction(item) {
		var self = this,
			target = "",
			actions;

		actions = self.notificationActions.filter(function (notification) {
			return notification.Subject.toLowerCase() == item.Subject.toLowerCase();
		});
		if (actions.length) {
			if (actions[0].OpenInNewTab) {
				target = "_blank";
			}
			if (actions[0].ActionType.toLowerCase() == "state" && self.$state.get(actions[0].Action)) {
				if (target)
					self.fxpRouteService.navigateToSpecificUrl(self.$state.href(actions[0].Action, {}, { absolute: true }), target);
				else
					self.fxpRouteService.navigatetoSpecificState(actions[0].Action);
			} else if (actions[0].ActionType.toLowerCase() == "url") {
				self.fxpRouteService.navigateToSpecificUrl(actions[0].Action, target);
			} else if (actions[0].ActionType.toLowerCase() == "function") {
				self.$rootScope.$broadcast(actions[0].Action, item);
			}
		}
	}

	/**
	* Register to a new state to map with notification
	* @method Fxp.Services.notificationActionCenter.registerNotificationAction
	* @param {string} a mandatory string value which contains notification subject.
	* @param {string} a mandatory string value which contains action to be performed.
	* @param {string} a mandatory string value which contains action type: state/url/function.
	* @param {boolean} a mandatory bool value whether to perform the action in new tab.
	* @example <caption> Example to invoke registerNotificationAction</caption>
	*  notificationActionCenter.registerNotificationAction('New Resource Request');
	*/
	registerNotificationAction(subject, action, actionType, openInNewTab) {
		var notificationAction = this.notificationActions.filter(item => item.Subject == subject);
		if (!notificationAction.length) {
			this.notificationActions.push({
				Subject: subject,
				ActionType: actionType,
				OpenInNewTab: openInNewTab,
				Action: action
			});
		} else {
			notificationAction[0].ActionType = actionType;
			notificationAction[0].OpenInNewTab = openInNewTab;
			notificationAction[0].Action = action;
		}
	}

	/**
	* Appends icons and other properties to the notification
	* @method Fxp.Services.notificationActionCenter.appendPropertiesToNotifications
	* @param {any} notifications mandatory array of notifications.
	* @example <caption> Example to invoke appendPropertiesToNotifications</caption>
	*  notificationActionCenter.appendPropertiesToNotifications([]);
	*/
	appendPropertiesToNotifications(notifications) {
		var self = this;
		notifications.forEach(function (item) {
			// Find icon corresponding to notification.
			var icon = self.iconConfiguration.filter(function (icon) {
				return icon.From.toLowerCase() == item.From.toLowerCase();
			});
			// Check if notification has corresponding icon.
			if (icon.length)
				item.icon = icon[0].Icon;
			// Check notification has corresponding action.
			item.hasAction = self.notificationActions.some(function (action) {
				return action.Subject.toLowerCase() == item.Subject.toLowerCase();
			});
			// Convert date to local.
			item.PublishedLocalDate = new Date(item.PublishedUtcDate);
		});
		return notifications;
	}
}
