export class AuthorNotificationConstant {
	public static ConfirmationOptions = {
		"templateUrl": "../../templates/author_notification/confirmationPopup.html",
		"windowClass": "author-notification-confirmation-popup",
		"keyboard": false,
		"backdrop": "static",
		"controller": "AuthorNotificationConfirmationController",
		"controllerAs": "ctrl",
		"bindToController": true
	};
}