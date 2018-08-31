import { ILogger } from "../interfaces/ILogger";


export class SessionTimeoutModalController {
	constructor(
		private fxplogger: ILogger,
		private classNameSessionTimeoutModalController = "Fxp.SessionTimeoutModalController"

	) { }
	public reLaunch() {
		let self = this;
		self.fxplogger.logEvent(self.classNameSessionTimeoutModalController, "User Clicked on Relaunch");
		document.location.reload(true);
	}
}