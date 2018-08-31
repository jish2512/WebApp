import { INotification } from "../interfaces/INotification";

export class NotificationAPI implements INotification {
	constructor() { }

	ShowNotification(message: string, title: string, type: string) {

		alert(message);

	}
}