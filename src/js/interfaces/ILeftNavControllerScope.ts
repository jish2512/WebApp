export interface ILeftNavControllerScope extends angular.IScope {
	leftNavData: any;
	leftNavDataExists: boolean;
	expandLeftNav(): void;
	collapseLeftNav(): void;
	onPinFlyoutClick(event): void;
	headerMenuChange(event, item): void;
	openFlyoutOnClick(item): void;
	onMenuItemClick(item, innerItem): void;
	resetLeftNavFocus(): void;
	leftNavKeydown(event): void;
	setFocusToHamburger(): void;
	onMenuItemClick(item): void;
	resetLeftNavFocus(): void;
	isMoreLinkActive: boolean;
	isMoreButtonVisible: boolean;
	visibleInternalLinksCount: number;
	visibleExternalLinksCount: number;
	visibleSettingLinksCount: number;
	selectedLeftNavItemId: number;
	selectedLeftNavItemLinkId: number;
	selectedLeftNavItemSequence: number;
	leftNavBindingSuccess: void;
	leftNavItemClick: void;
}