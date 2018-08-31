export interface IAppControllerScope extends angular.IScope {
	fxpheaderdata: any;
	footerdata: any;
	leftNavStaticData: any;
	ViewFullProfile: any;
	profileStateName: string;
	userThumbnailPhoto: string;
	pageTitle: string;
	renderHeaderForClick(event): void;
	renderHeaderForKeydown(event): void;
	renderSideBarForKeydown(event): void;
	renderHeaderForFocusout(event): void;
	renderHeaderMenuForKeydown(event): void;
	renderSideBarForKeydown(event): void;
	onMessageKeyDown(event): void;
	OnNavigationClick(item): void;
	onFxpLoaded(): void;
	OnNavigationClickWithParams(item, params): void;
	leftNavConfig: any;
	getPageLoadPropertyBag(pageloadData): any;
}