export interface IUserLookupPersonalizationControllerScope extends angular.IScope {
	adminUIStrings: any;
	footerdata: any;
	leftNavStaticData: any;
	userProfileDoesNotExist: boolean;
	errorMessage: string;
	selectedUserObject: any;
	selectedUser: string;
	searchUser(value: string): void;
	setSelectedUser($item): void;
	pullFocusToElement(elementId): void;
	resetSelectedUser(): void;
	navigateToPersonalizationView(): void;
	searchfocused: boolean;
	resetfocused: boolean;
	isSelectedUserProfile: boolean;
	onUserChanged(): void;
	buttonStrings: any;
}