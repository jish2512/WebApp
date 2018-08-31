import { IRootScope } from "../interfaces/IRootScope";
import { FxpConfigurationService } from "./FxpConfiguration";
import { FxpBroadcastedEvents } from "./FxpBroadcastedEvents";

/**
 * @application  Fxp
 */
/**
 * @module Fxp.Services
 */
declare var Spinner: any;

/**
   * A service to connect to Page Loader Service  to fetch the detaisl of page loader
   * @class Fxp.Services.PageLoaderService
   * @classdesc A service to connect to Page Loader service to fetch the page loader details
   * @example <caption> Example to create an instance of Page Loader Service</caption>
   *  //Initializing Page Loader Service
   *  angular.module('FxPApp').controller('AppController', ['PageLoaderService', AppController]);
   *  function AppController(PageLoaderService){ PageLoaderService.fnHidePageLoader(); }
   */
export class PageLoaderService {

	private http: angular.IHttpService;
	private rootScope: IRootScope;
	private timeout: angular.ITimeoutService;
	private static _instance: PageLoaderService;
	private defaultLoaderName = 'fxploader';
	private loaderInstance;
	private timeoutIntervalInMs;
	private timeOutCallback;
	private pageLoadTimers: Array<angular.IPromise<any>>;

	constructor($http: angular.IHttpService,
		$rootScope: IRootScope,
		$timeout: angular.ITimeoutService,
		fxpConfigurationService: FxpConfigurationService) {
		this.http = $http;
		this.rootScope = $rootScope;
		this.timeout = $timeout;
		this.loaderInstance;
		this.timeoutIntervalInMs = fxpConfigurationService.FxpBaseConfiguration.PageLoadTimeOut || 30000;
		this.pageLoadTimers = [];

		if (PageLoaderService._instance) {
			return PageLoaderService._instance;
		}
		PageLoaderService._instance = this;
	}

	/**
   * Gets Show Page Loader from the Page Loader Service
   * @method Fxp.Services.PageLoaderService.fnShowPageLoader       
   * @example <caption> Example to invoke fnShowPageLoader</caption>
   *  PageLoaderService.fnShowPageLoader('loading text');
   */
	fnShowPageLoader(loadingText, timeOutCallback?) {
		this.disablePageLoaderTimers();
		var loader = this.fnCreateLoaderData(true, this.defaultLoaderName, loadingText);
		this.fnChangeLoaderState(loader);
		var self = this;
		self.timeOutCallback = timeOutCallback;

		var pageLoadTimer = this.timeout(function () {
			self.fnHidePageLoader();
			if (self.timeOutCallback)
				self.timeOutCallback();
		}, this.timeoutIntervalInMs);

		// Storing timers in collection to cancel all of them once hide event is called. 
		this.pageLoadTimers.push(pageLoadTimer);
	}

	/**
	* A method to show page loader which are part of series of steps
	* @method Fxp.Services.PageLoaderService.fnShowPageLoaderStep
	* @example <caption> Example to invoke fnShowPageLoaderStep</caption>
	*  PageLoaderService.fnShowPageLoaderStep('Authenticating', 1, 2); // Will have a string "Authenticating (1/2)"
	*/
	fnShowPageLoaderStep(loadingText: string, currentStepIndex: number, totalStepsCount: number, timeOutCallback?) {
		let loadingTextWithStep = `${loadingText} (${currentStepIndex}/${totalStepsCount})`;
		this.fnShowPageLoader(loadingTextWithStep, timeOutCallback);
	}
	/**
	* Gets Hide Page Loader from the Page Loader Service
	* @method Fxp.Services.PageLoaderService.fnHidePageLoader
	* @example <caption> Example to invoke fnHidePageLoader</caption>
	*  PageLoaderService.fnHidePageLoader();
	*/
	fnHidePageLoader() {
		this.disablePageLoaderTimers();
		var loader = this.fnCreateLoaderData(false, this.defaultLoaderName, '');
		this.fnChangeLoaderState(loader);
	}

	/**
   * Gets Show In line Loader from the Page Loader Service
   * @method Fxp.Services.PageLoaderService.fnShowInlineLoader
   * @example <caption> Example to invoke fnShowInlineLoader</caption>
   *  PageLoaderService.fnShowInlineLoader('loader name','loading text');
   */
	fnShowInlineLoader(loaderName, loadingText) {
		var loader = this.fnCreateLoaderData(true, loaderName, loadingText);
		this.fnBroadcastInlineLoading(loader)
	}

	/**
	* Gets Hide In line Loader from the Page Loader Service
	* @method Fxp.Services.PageLoaderService.fnHideInlineLoader
	* @example <caption> Example to invoke fnHideInlineLoader</caption>
	*  PageLoaderService.fnHideInlineLoader('loader name');
	*/
	fnHideInlineLoader(loaderName) {
		var loader = this.fnCreateLoaderData(false, loaderName, '');
		this.fnBroadcastInlineLoading(loader)
	}

	/**
	* Gets Show Flyout Inline Loader from the Page Loader Service
	* @method Fxp.Services.PageLoaderService.fnShowFlyoutInlineLoader
	* @example <caption> Example to invoke fnShowFlyoutInlineLoader</caption>
	*  PageLoaderService.fnShowFlyoutInlineLoader('loader name','loader tooltip');
	*/
	fnShowFlyoutInlineLoader(loaderName, loaderTooltip) {
		var loader = this.fnCreateFlyoutLoaderData(true, loaderName, loaderTooltip);
		this.fnBroadcastInlineLoading(loader);
	}

	/**
	* Gets Hide Flyout Inline Loader from the Page Loader Service
	* @method Fxp.Services.PageLoaderService.fnHideFlyoutInlineLoader
	* @example <caption> Example to invoke fnHideFlyoutInlineLoader</caption>
	*  PageLoaderService.fnHideFlyoutInlineLoader('loader name');
	*/
	fnHideFlyoutInlineLoader(loaderName) {
		var loader = this.fnCreateFlyoutLoaderData(false, loaderName, '');
		this.fnBroadcastInlineLoading(loader)
	}

	/**
	* Gets Show Specific Page Loader from the Page Loader Service
	* @method Fxp.Services.PageLoaderService.fnShowSpecificPageLoader
	* @example <caption> Example to invoke fnShowSpecificPageLoader</caption>
	*  PageLoaderService.fnShowSpecificPageLoader('loader name','loader text');
	*/
	fnShowSpecificPageLoader(loaderName, loadingText) {
		var loader = this.fnCreateLoaderData(true, loaderName, loadingText);
		this.fnChangeLoaderState(loader);
	}

	/**
	* Gets Hide Specific Page Loader from the Page Loader Service
	* @method Fxp.Services.PageLoaderService.fnHideSpecificPageLoader
	* @example <caption> Example to invoke fnHideSpecificPageLoader</caption>
	*  PageLoaderService.fnHideSpecificPageLoader('loader name');
	*/
	fnHideSpecificPageLoader(loaderName) {
		var loader = this.fnCreateLoaderData(false, loaderName, '');
		this.fnChangeLoaderState(loader);
	}

	/**
   * Gets Create Loader Data from the Page Loader Service
   * @method Fxp.Services.PageLoaderService.fnCreateLoaderData
   * @example <caption> Example to invoke fnCreateLoaderData</caption>
   *  PageLoaderService.fnCreateLoaderData('show loader','loader name','loading text');
   */
	fnCreateLoaderData(showLoader, loaderName, loadingText) {
		return { name: loaderName, showLoader: showLoader, loadingText: loadingText };
	}

	/**
	* Gets Create Flyout Loader Data from the Page Loader Service
	* @method Fxp.Services.PageLoaderService.fnCreateFlyoutLoaderData
	* @example <caption> Example to invoke fnCreateFlyoutLoaderData</caption>
	*  PageLoaderService.fnCreateFlyoutLoaderData('show loader','loader name','loading text');
	*/
	fnCreateFlyoutLoaderData(showLoader, loaderName, loadingText) {
		return angular.extend(this.fnCreateLoaderData(showLoader, loaderName, loadingText), { flyout: true });
	}

	/**
	* Gets Broadcast Loading from the Page Loader Service
	* @method Fxp.Services.PageLoaderService.fnChangeLoaderState
	* @example <caption> Example to invoke fnChangeLoaderState</caption>
	*  PageLoaderService.fnChangeLoaderState('loader');
	*/
	fnChangeLoaderState(loader) {
		let self = this;
		self.rootScope.showLoader = loader.showLoader;
		if (loader.showLoader) {
			//Timeout to make sure angular digest runs for the above 
			//statement after which the spinContainer is available.
			self.timeout(function () {
				//Add spinner if not exists already.
				if (!self.loaderInstance) {
					var spinConfig = {
						lines: 9 // The number of lines to draw
						, length: 0 // The length of each line
						, width: 8 // The line thickness
						, radius: 20 // The radius of the inner circle
						, scale: 1.5 // Scales overall size of the spinner
						, corners: 1 // Corner roundness (0..1)
						, color: '#0063b1' // #rgb or #rrggbb or array of colors
						, opacity: 0.25 // Opacity of the lines
						, rotate: 0 // The rotation offset
						, direction: 1 // 1: clockwise, -1: counterclockwise
						, speed: 1.9 // Rounds per second
						, trail: 60 // Afterglow percentage
						, fps: 20 // Frames per second when using setTimeout() as a fallback for CSS                  
						, className: 'spinner' // The CSS class to assign to the spinner
					};
					self.loaderInstance = new Spinner(spinConfig).spin(document.getElementById('fxpLoaderContainer'));
				}
			});
			self.rootScope.loadingText = loader.loadingText || "Loading";
		}
	}

	/**
   * Gets Broadcast Inline Loading from the Page Loader Service
   * @method Fxp.Services.PageLoaderService.fnBroadcastInlineLoading
   * @example <caption> Example to invoke fnBroadcastInlineLoading</caption>
   *  PageLoaderService.fnBroadcastInlineLoading('loader');
   */
	fnBroadcastInlineLoading(loader) {
		this.rootScope.$broadcast(FxpBroadcastedEvents.OnShowHideInlineLoader, loader);
	}

	private disablePageLoaderTimers() {
		this.pageLoadTimers.forEach((timer) => this.timeout.cancel(timer));
		this.pageLoadTimers = [];
	}
}

