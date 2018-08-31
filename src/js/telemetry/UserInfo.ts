export class UserInfo {
	public userId: string;
	public userRole: string;

	constructor(private _userId: string, private _userRole: string) {
		this.userId = _userId;
		this.userRole = _userRole;
	}
}