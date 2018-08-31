export class SessionTimeoutModalConstant {
	public static options = {
		"templateUrl": "../../templates/fxpsessiontimeout.html",
		"windowClass": "session-timeout-popup",
		"keyboard": false,
		"backdrop": "static",
		"controller": 'SessionTimeoutModalController',
		"controllerAs": "systemTimeout"
	};
}