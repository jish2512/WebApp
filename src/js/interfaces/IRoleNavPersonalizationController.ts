export interface IRoleNavPersonalizationController extends angular.IScope {

	selectedGlobalLeftNavItems(): void;
	addToRoleNavPersonalizationList(): void;
	removeRoleGroupNavPresonalization(): void;
	submitRoleGroupNavPresonalization(): void;
	selectedUserNavItems(): void;
	isAddPersonalizeAllow: boolean;
	isRemovePersonalizeAllow: boolean;
	showConfirmPopup(): void;
	displayUnsavedChangesPopup: boolean;
	navigationList: any;
	isParentLinkEnabled(): boolean;
	pullFocusToElement(element, navItem, itemType): void;
	selectedRoleGroupNavItems(): any;
	showConfirmSavePopup(): void;
	hideConfirmSavePopup(): void;
	displaySavePopup: boolean;
	hideUnsavedConfirmPopup(): void;
	leaveConfirmPopup(): void;
	submitButtonDisabled(): boolean;
	selectedRole: any;
	selectedRoleGroup: any;
	roleGroupDetails: any;
	businessRoles: any;
	getRoleDetails(): void;
	selectedRoleDetails(): void;
	defaultBusinessRoleGroup: any;
}