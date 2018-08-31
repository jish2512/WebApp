export interface IDashBoardControllerScope extends angular.IScope {
	OBOUser: any;
	closeActOnBehalofUserClick(): void;
	pullFocusToElement(elementId): void;
	oboUIStrings: any;
	footerdata: any;
	leftNavStaticData: any;
	headerLogo: any;
	applicationSpecificAttributes: any;
	feedbackItemCollection: any;
	feedbackConfiguration: any;
	feedbackContextItem: any;
}