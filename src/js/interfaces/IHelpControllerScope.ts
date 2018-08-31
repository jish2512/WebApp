export interface IHelpControllerScope extends angular.IScope {
	pullFocus(): void;
	fxpHelp: any;
	logFxpHelpEvent(helpItem, parent): void;
	fxpConfigurationService: any;
	deviceFactory: any;
	dashBoardHelper: any;
	helpContainer: any;
	onPinHelpFlyoutClick(): void;
}