export interface ILeftNavPersonalizationControllerScope extends angular.IScope {
	adminUIStrings: any;
	buttonStrings: any;
	personalizationUser: any;
	selectedGlobalLeftNavItems(): void;
	addToUserNavPersonalizationList(): void;
	removeUserNavPresonalization(): void;
	submitUserNavPresonalization(): void;
	selectedUserNavItems(): void;
	navigateToUserLookup(): void;
	isAddPersonalizeAllow: boolean;
	isRemovePersonalizeAllow: boolean;
	hideConfirmPopup(): void;
	showConfirmPopup(): void;
	displayPopup: boolean;
	navigationList: any;
	pullFocusToElement(element, navItem, itemType): void;
}