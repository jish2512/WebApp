export interface IActOnBehalfOfControllerScope extends angular.IScope {
	userProfileDoesNotExist: boolean;
	actOnBehalfOf: string;
	footerdata: any;
	leftNavStaticData: any;
	oboUIStrings: any;
	displayErrorMessage: boolean;
	searchUsersList: Array<any>;
	errorMessage: string;
	selectedUser: string;
	selectedUserObject: any;
	isValidUserSelected: boolean;
	profileStateName: string;
	reset(): void;
	actOnBehalfOfUserClick(): void;
	OBOAdminstratorClick(): void;
	searchUser(value: string): void;
	onSelect($item, $model, $label): void;
	createProfile(): void;
	handleEnterKeyOnSearchUserInput(event: KeyboardEvent);
	pullFocusToElement(elementId): void;
}