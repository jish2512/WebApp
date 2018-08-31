/**
 * @application  Fxp
 */
/**
 * @module Fxp.Controllers
 */
declare type IStateService = any;
import { IHelpControllerScope } from "../interfaces/IHelpControllerScope";
import { CreateAskOpsModalConstant } from "../constants/CreateAskOpsRequest.constants";
import { IHelpCentralService } from "../interfaces/IHelpCentralService";
import { HelpArticleImageModalConstant } from "../constants/HelpArticle.constants";
import { FxpConfigurationService } from "../services/FxpConfiguration";
import { IRootScope } from "../interfaces/IRootScope";
import { PageLoaderService } from "../services/pageLoaderService";
import { FxpConstants, CustomEvents, ApplicationConstants } from "../common/ApplicationConstants";
import { ILogger } from "../interfaces/ILogger";
import { CommonUtils } from "../utils/CommonUtils";
import { DashBoardHelper } from "../factory/DashBoardHelper";

 /**
     * A main controller for FxpApp module. This is the controller having basic scopes and events.
     * @class Fxp.Controllers.HelpController
     * @classdesc A main controller of FxpApp module
     * @example <caption>
     *  //To Use HelpController
     *  angular.module('FxPApp').controller('HelpController', ['AnyDependency', HelpController]);
     *  function HelpController(AnyDependency){ AnyDependency.doSomething(); }
     */

export class HelpController {
	private fxpDefaultHelp: {};

	//Flighting variables
	private fxpHelpWithoutFlighting: any;
	private leftNavItem: any;
	constructor(
		private $scope: IHelpControllerScope,
		private $rootScope: IRootScope,
		private $location: angular.ILocationService,
		private fxpConfigurationService: FxpConfigurationService,
		private pageLoaderService: PageLoaderService,
		private fxpLoggerService: ILogger,
		private deviceFactory: any,
		private dashBoardHelper: DashBoardHelper,
		private $state: IStateService,
		private $timeout: any,
		private $window: angular.IWindowService,
		private $uibModal: any,
		private createAskOpsConstant: CreateAskOpsModalConstant,
		private helpArticleImageConstant: HelpArticleImageModalConstant,
		private helpCentralService: IHelpCentralService
	) {
		// Start time for performance calculation.
		var startTime = performance.now();
		//Initializes value
		var self = this;
		self.$scope.defaultHelpArticleLimit = fxpConfigurationService.FxpAppSettings.DefaultHelpArticleLimit;
		var helpCentralUrl = fxpConfigurationService.FxpAppSettings.HelpCentralUrl.replace(/\/$/, ''); //removing last slash
		self.$scope.helpCentralUrl = helpCentralUrl + "/tenant/" + window["tenantConfiguration"].TenantId;
		self.$scope.toggleHelp = self.toggleHelp.bind(self);
		self.$scope.stateSpecificHelpLinks = self.stateSpecificHelpLinks.bind(self);
		self.$scope.pullFocus = self.pullFocus.bind(self);
		self.$scope.logFxpHelpEvent = self.logFxpHelpEvent.bind(self);
		self.$scope.logHelpIconEvent = self.logHelpIconEvent.bind(self);
		self.$scope.navigateToArticle = self.navigateToArticle.bind(self);
		self.$scope.navigateToPreviousState = self.navigateToPreviousState.bind(self);
		self.$scope.navigateToNextState = self.navigateToNextState.bind(self);
		self.$scope.navigateToHome = self.navigateToHome.bind(self);
		self.$scope.showMoreContextualHelpLinks = self.showMoreContextualHelpLinks.bind(self);
		self.$scope.expandArticleImage = self.expandArticleImage.bind(self);
		self.$scope.saveHelpFeedback = self.saveHelpFeedback.bind(self);
		self.$scope.navigateToHelpCentral = self.navigateToHelpCentral.bind(self);
		self.$scope.onPinHelpFlyoutClick = self.onPinHelpFlyoutClick.bind(self);

		// Search
		self.$scope.searchValue = "";
		self.$scope.searchSuggestions = self.searchSuggestions.bind(self);
		self.$scope.onSearchKeyDown = self.onSearchKeyDown.bind(self);
		self.$scope.searchHelpArticles = self.searchHelpArticles.bind(self);
		self.$scope.onSearchSuggestionSelect = self.onSearchSuggestionSelect.bind(self);
		self.$scope.templateCheck = self.templateCheck.bind(self);

		self.pageLoaderService.fnHidePageLoader();
		self.resetNavigation();

		try {
			self.fxpDefaultHelp = JSON.parse(fxpConfigurationService.FxpAppSettings.FxpHelp);
		}
		catch (e) {
			self.fxpDefaultHelp = {};
		}
		self.fxpHelpWithoutFlighting = CommonUtils.isNullOrEmpty(window["tenantConfiguration"].HelpConfiguration) ? self.fxpDefaultHelp : window["tenantConfiguration"].HelpConfiguration;

		//flighting code
		self.flightHandler();
		var flightHandlerCleanUp = self.$rootScope.$on(CustomEvents.StartUpFlagRetrieved, self.flightHandler.bind(this));
		var createAskOpsRequestCleanUp = $rootScope.$on('createAskOpsRequest', self.openCreateAskOpsModal.bind(this));
		$scope.$on('$destroy', function () {
			flightHandlerCleanUp();
			createAskOpsRequestCleanUp();
		});

		// Logging pageload metrics.
		self.fxpLoggerService.logPageLoadMetrics(performance.now() - startTime);
	}

	flightHandler(): void {
		this.$scope.fxpHelp = angular.copy(this.fxpHelpWithoutFlighting);
		//prevent undefined issue
		this.$rootScope.initialFlags = this.$rootScope.initialFlags || {};
		if (!(this.$rootScope.initialFlags && this.$rootScope.initialFlags.botEnabled))
			this.removeBotLink();
		if (!(this.$rootScope.initialFlags && this.$rootScope.initialFlags.askOpsEnabled))
			this.removeAskOpslinks();
	}

	removeAskOpslinks(): void {
		let helpSections = this.$scope.fxpHelp.FxpHelpLinks;
		for (let i = 0; i < helpSections.length; i++) {
			helpSections[i].HelpLinks = helpSections[i].HelpLinks.filter(function (link) {
				return !(link.EventName == FxpConstants.askOps.createLink || link.Href == FxpConstants.askOps.viewLink);
			});
		}
	}

	removeBotLink(): void {
		let helpSections = this.$scope.fxpHelp.FxpHelpLinks;
		for (let i = 0; i < helpSections.length; i++) {
			helpSections[i].HelpLinks = helpSections[i].HelpLinks.filter(function (link) {
				return link.EventName != CustomEvents.SkypeBotInit;
			});
		}
	}

	 /**
      * A function to update user help links based on the state.
      * @method Fxp.Controllers.HelpController.stateSpecificHelpLinks
      * this.stateSpecificHelpLinks();
      */
	 stateSpecificHelpLinks() {
		let self = this;
		let isAdded = false;
		var linksWithoutAuthorStates = [];
		this.flightHandler();
		let helpSections = this.$scope.fxpHelp.FxpHelpLinks[1];//Get Assisted helplinks
		for (let i = 0; i < helpSections.HelpLinks.length; i++) {
			helpSections.HelpLinks = helpSections.HelpLinks.filter(function (link) {
				//verify if the current state is present in AuthorStateNames in tenant configuration
				if (link.AuthorStateNames && 
					//verify if the current state is present in AuthorStateNames
					(link.AuthorStateNames.indexOf(self.$state.$current.name) > -1 ||
					//verify if the current state is unauthorized in which case get previous state
					(link.AuthorStateNames.indexOf(self.$rootScope.pageLoadMetrics.sourceRoute) > -1) && ApplicationConstants.ErrorStateNames.indexOf(self.$state.$current.name) > -1)) {
					isAdded = true;
					return link;
				}
				//if the current state is not present in tenant configuration get all the help links which are default or has no AuthorStateNames
				else if (!(link.AuthorStateNames) ||
						(link.AuthorStateNames && link.AuthorStateNames.length === 0) ||
						(link.AuthorStateNames && link.AuthorStateNames.indexOf(ApplicationConstants.DefaultHelpLink) > -1))
				{
					linksWithoutAuthorStates.push(link);
				}
			});
		}
		//in case no configured help link is shown, display the default help links
		if (!isAdded && linksWithoutAuthorStates)
		{
			helpSections.HelpLinks = linksWithoutAuthorStates;
		}
	}

	/**
   * An event handler whenever header is clicked.
   * @method Fxp.Controllers.HelpController.logFxpHelpEvent
   * @param {object} helpItem An object which is passed from the view.
   * @param {object} parent An object which is passed from the view.
   * @param {string} type A value which determines if its clicked from child help link
   * @example <caption> Example to use logFxpHelpEvent</caption>
   * <div ng-click="logFxpHelpEvent(helpitem, parent,'Desktop')">Log Fxp Help</div>;
   */
	logFxpHelpEvent = function (helpItem, parent, view) {
		var self = this;
		var propBag = self.fxpLoggerService.createPropertyBag();
		propBag.addToBag(FxpConstants.metricConstants.HelpLinkParent, parent);
		propBag.addToBag(FxpConstants.metricConstants.HelpLinkChild, helpItem.DisplayText);
		if (view == 'FlyoutView')
			propBag.addToBag(FxpConstants.metricConstants.HelpView, view);
		self.fxpLoggerService.logEvent("Fxp.HelpClick", "FxpHelpLinkAccessed", propBag);
	};
	/**
  * An event handler whenever header is clicked.
  * @method Fxp.Controllers.HelpController.logHelpIconEvent
  * @param {boolean} isModalOpen a flag which states if modal is open/close
  * @example <caption> Example to use logHelpIconEvent</caption>
  * <div ng-click="logHelpIconEvent(true)">Log Fxp Help</div>;
  */
	logHelpIconEvent = function (isModalOpen) {
		if (isModalOpen) {
			var self = this;
			var propBag = self.fxpLoggerService.createPropertyBag();
			propBag.addToBag(FxpConstants.metricConstants.HelpIconClicked, "Yes");
			self.fxpLoggerService.logEvent("Fxp.HelpClick", "FxpHelpIconClick", propBag);
		}
	};

	/**
	* An event handler called whenever pullFocus function is called on loading of Help page .
	* @method Fxp.Controllers.HelpController.findNextTabStop
	* @example <caption> Example to use findNextTabStop</caption>
	* <div ng-click="findNextTabStop()">Select all interactive elements present in partner app</div>;
	*/
	findNextTabStop(): void {
		var focusableElements = $('.partner-app').find('input, button, select, textarea, a[href], details, div[tabindex]');
		var list = Array.prototype.filter.call(focusableElements, function (item) {
			return item.tabIndex == 0
		});

		return list[0];
	}

	/**
	* An event handler whenever Help page is loaded.
	* @method Fxp.Controllers.HelpController.pullFocus
	* @example <caption> Example to use pullFocus</caption>
	* <div ng-init="pullFocus()">Pull Focus to first active element</div>;
	*/
	pullFocus(): void {
		var self = this;
		if (self.fxpConfigurationService.FxpBaseConfiguration.FxpRouteCollection.indexOf(self.$state.current.name) === -1) {
			self.$timeout(function () {
				var activeElement: any = self.findNextTabStop();
				activeElement.focus();
			}, 100);
		}
	}

	/**
	* A function to open Create Ask Ops Modal.
	* @method Fxp.Controllers.HelpController.openCreateAskOpsModal
	* @example <caption> Example to use openCreateAskOpsModal</caption>
	* this.openCreateAskOpsModal();
	*/
	openCreateAskOpsModal(event, requestType) {
		// Show popup.
		let self = this,
			options = CreateAskOpsModalConstant.ModalOptions;
		options.resolve = { defaultRequestType: function () { return requestType } };
		self.$timeout(function () {
			self.$uibModal.open(options);
		}, 200);
	}

	toggleHelp(open) {
		let self = this;
		if (self.$rootScope.initialFlags && self.$rootScope.initialFlags.contextualHelpEnabled) {
			if (open) {
				self.$rootScope.isHelpFlyoutPinned = false; 
				self.resetNavigation();
				if (self.isCurrentLeftNavItemModified() || !(self.$scope.contextualHelp)) {
					self.showLoader(true);
					self.getArticles(self.$scope.defaultHelpArticleLimit, false);
				} 
			}
			self.$rootScope.isHelpOpen = open;
		}
	}

	resetNavigation() {
		let self = this;
		self.$scope.navigationCollection = [];
		self.$scope.currentNavigationIndex = 0;
		self.$scope.navigationCollection[0] = 'home';
		self.$scope.searchValue = '';
		self.enableShowMoreLink();
	}

	enableShowMoreLink() {
		var self = this;
		if (self.$scope.contextualHelp && !self.$scope.searchValue)
			self.$scope.isContextualFilterRequired = self.$scope.contextualHelp.length >= self.$scope.defaultHelpArticleLimit;
		if (self.$scope.searchedHelp && self.$scope.searchValue)
			self.$scope.isSearchFilterRequired = self.$scope.searchedHelp.length >= self.$scope.defaultHelpArticleLimit;
	}

	/**
	* A function to get contextual help article.
	* @method Fxp.Controllers.HelpController.getArticles
	* @param {number} topArticles which is passed for howmany articles to get
	* @param {boolean} isShowAll a flag for which states if call for show more
	* @example <caption> Example to use getArticles</caption>
	* this.getArticles();
	*/
	getArticles(topArticles, isShowAll) {
		var self = this,
			businessCapability,
			businessFunctions,
			searchString,
			startTime = performance.now(),
			propbag = self.fxpLoggerService.createPropertyBag();

		if (self.$scope.searchValue) {
			searchString = self.$scope.searchValue;
		} else {
			if (self.$rootScope.currentLeftNavItem) {
				//finding currentLeftNavItem is L0 or L1 based on parentId
				businessCapability = (!self.$rootScope.currentLeftNavItem.parentId) ? self.$rootScope.currentLeftNavItem.id : self.$rootScope.currentLeftNavItem.parentId;
				businessFunctions = (self.$rootScope.currentLeftNavItem.parentId)?self.$rootScope.currentLeftNavItem.id:null;
			}
		}
		self.helpCentralService.getContextualHelpArticles(topArticles, businessCapability, businessFunctions, searchString).then((response) => {
			if (searchString) {
				self.$scope.searchedHelp = response.data.result;
			} else {
				self.$scope.contextualHelp = response.data.result;
			}
			if (isShowAll) {
				self.hideShowMoreLink();
			} else {
				self.enableShowMoreLink();
			}
			self.showLoader(false);
			propbag.addToBag("BusinessCapability", businessCapability);
			propbag.addToBag("BusinessFunctions", businessFunctions);
			propbag.addToBag("TopArticles", topArticles);
			propbag.addToBag("TotalTime", (performance.now() - startTime).toString());
			self.fxpLoggerService.logEvent("Fxp.Controllers.HelpController", "GetContextualHelpArticles", propbag);
		}, (error) => {
			self.showLoader(false);
			self.logError(error, self.$rootScope.fxpUIConstants.UIMessages.HelpCentralGetArticlesSvcError, "4001");
		});
	}

	getArticleData(articleId) {
		var self = this
			, startTime = performance.now()
			, propbag = self.fxpLoggerService.createPropertyBag();
		self.$scope.article = {};
		self.helpCentralService.getContextualHelpArticleContent(articleId).then((response) => {
			self.$scope.article = response.data;
			self.showLoader(false);
			propbag.addToBag("ArticleId", articleId);
			propbag.addToBag("TotalTime", (performance.now() - startTime).toString());
			self.fxpLoggerService.logEvent("Fxp.Controllers.HelpController", "GetContextualHelpArticleContent", propbag);
			self.saveViewCount(articleId);
		}, (error) => {
			self.showLoader(false);
			self.logError(error, self.$rootScope.fxpUIConstants.UIMessages.HelpCentralGetArticleDataSvcError, "4002");
		});
	}

	/**
	* A function to navigate to article.
	* @method Fxp.Controllers.HelpController.navigateToArticle
	* @example <caption> Example to use navigateToArticle</caption>
	* this.navigateToArticle(1);
	*/
	navigateToArticle(articleId) {
		let self = this;
		self.showLoader(true);
		self.getArticleData(articleId);
		// Add current article to Navigation collection. So that it can be visited again.
		self.$scope.currentNavigationIndex++;
		self.$scope.navigationCollection.splice(self.$scope.currentNavigationIndex);
		self.$scope.navigationCollection[self.$scope.currentNavigationIndex] = 'article?' + articleId;
	}

	navigateToPreviousState() {
		let self = this;
		if (self.$scope.navigationCollection[self.$scope.currentNavigationIndex - 1] == 'home') {
			let selectedArticle = self.$scope.contextualHelp.filter(function (article) {
				let result = false;
				if (article.id == self.$scope.navigationCollection[self.$scope.currentNavigationIndex].split('?')[1]) {
					result = true;
				} else {
					article.pullFocus = 'false';
					result = false;
				}
				return result;
			});
			if (selectedArticle.length) {
				selectedArticle[0].pullFocus = 'true';
			} else {
				self.$scope.contextualHelp[0].pullFocus = 'true';
			}
		} else if (self.$scope.navigationCollection[self.$scope.currentNavigationIndex - 1].indexOf('article') != -1) {
			self.showLoader(true);
			self.getArticleData(self.$scope.navigationCollection[self.$scope.currentNavigationIndex - 1].split('?')[1]);
		} else {
			self.showLoader(true);
			self.$scope.searchValue = self.$scope.navigationCollection[self.$scope.currentNavigationIndex - 1].split('?')[1];
			self.getArticles(self.$scope.defaultHelpArticleLimit, false);
		}
		self.$scope.currentNavigationIndex--;
	}

	navigateToNextState() {
		let self = this;
		self.showLoader(true);
		self.$scope.currentNavigationIndex++;
		if (self.$scope.navigationCollection[self.$scope.currentNavigationIndex].indexOf('article') != -1) {
			self.getArticleData(self.$scope.navigationCollection[self.$scope.currentNavigationIndex].split('?')[1]);
		} else if (self.$scope.navigationCollection[self.$scope.currentNavigationIndex].indexOf('search') != -1) {
			self.searchHelpArticles(self.$scope.navigationCollection[self.$scope.currentNavigationIndex].split('?')[1]);
		}
	}

	navigateToHome() {
		let self = this;
		self.$scope.currentNavigationIndex = 0;
		self.$scope.navigationCollection.splice(self.$scope.currentNavigationIndex);
		self.$scope.navigationCollection[self.$scope.currentNavigationIndex] = 'home';
		self.$scope.searchValue = '';
		if (self.isCurrentLeftNavItemModified()) {
			self.showLoader(true);
			self.getArticles(self.$scope.defaultHelpArticleLimit, false);
		}
		self.$scope.contextualHelp.forEach(function (article) {
			article.pullFocus = 'false';
		});
		self.$scope.contextualHelp[0].pullFocus = 'true';
	}

	showMoreContextualHelpLinks() {
		let self = this;
		self.showLoader(true);
		self.getArticles(0, true);
	}

	saveHelpFeedback(articleId, isHelpful) {
		var self = this
			, startTime = performance.now()
			, propbag = self.fxpLoggerService.createPropertyBag();
		self.showLoader(true);
		var feedback = {
			articleId: articleId,
			IsHelpful: isHelpful
		};
		self.helpCentralService.saveArticleFeedback(feedback).then((response) => {
			propbag.addToBag("ArticleId", articleId);
			propbag.addToBag("IsHelpFul", isHelpful);
			propbag.addToBag("TotalTime", (performance.now() - startTime).toString());
			self.fxpLoggerService.logEvent("Fxp.Controllers.HelpController", "SaveHelpFeedback", propbag);
			self.$scope.feedbackId = response.data;
			self.showLoader(false);
		}, (error) => {
			self.showLoader(false);
			self.logError(error, self.$rootScope.fxpUIConstants.UIMessages.HelpCentralSaveArticleFeedbackSvcError, "4003");
		});
	}

	hideShowMoreLink() {
		var self = this;
		// hide "show more" link in contextual help
		if (self.$scope.contextualHelp && !self.$scope.searchValue) {
			self.$scope.isContextualFilterRequired = false;
			self.$scope.contextualHelp.forEach(function (article) {
				article.pullFocus = 'false';
			});
			if (self.$scope.contextualHelp[self.$scope.defaultHelpArticleLimit])
				self.$scope.contextualHelp[self.$scope.defaultHelpArticleLimit].pullFocus = 'true';
			else
				self.$scope.contextualHelp[self.$scope.contextualHelp.length - 1].pullFocus = 'true';
		}
		// hide "show more" link in search
		if (self.$scope.searchedHelp && self.$scope.searchValue) {
			self.$scope.isSearchFilterRequired = false;
			self.$scope.searchedHelp.forEach(function (article) {
				article.pullFocus = 'false';
			});
			if (self.$scope.searchedHelp[self.$scope.defaultHelpArticleLimit])
				self.$scope.searchedHelp[self.$scope.defaultHelpArticleLimit].pullFocus = 'true';
			else
				self.$scope.searchedHelp[self.$scope.searchedHelp.length - 1].pullFocus = 'true'
		}
	}

	expandArticleImage(source) {
		// Show modal.
		let self = this,
			options = HelpArticleImageModalConstant.ModalOptions;
		options.resolve = { source: function () { return source } };
		self.$timeout(function () {
			self.$uibModal.open(options);
		}, 200);
	}

	/**
	* A method called when search suggestions are to be provided.
	* @method Fxp.Controllers.HelpController.searchSuggestions
	* @param {string} value is a string on which suggestion will be based
	* @example <caption> Example to use searchSuggestions</caption>
	* HelpController.searchSuggestions('new')
	*/
	searchSuggestions(searchPhrase) {
		let self = this;
		return self.helpCentralService.getSuggestions(searchPhrase).then(
			(response) => {
				return response.data;
			}, (reject) => {
				self.logError(reject, self.$rootScope.fxpUIConstants.UIMessages.HelpCentralGetSuggestionsError, "4004")
			});

	}

	/**
	* A method called when help article are to be searched
	* @method Fxp.Controllers.HelpController.searchHelpArticles
	* @param {string} searchString is a string to be searched
	* @example <caption> Example to use searchHelpArticles</caption>
	* HelpController.searchHelpArticles('new')
	*/
	searchHelpArticles(searchString) {
		let self = this;
		self.showLoader(true);
		self.$scope.searchValue = searchString;
		self.getArticles(self.$scope.defaultHelpArticleLimit, false);

		// Add current search to Navigation collection. So that it can be visited again.
		self.$scope.currentNavigationIndex++;
		self.$scope.navigationCollection.splice(self.$scope.currentNavigationIndex);
		self.$scope.navigationCollection[self.$scope.currentNavigationIndex] = 'search?' + searchString;
	}

	saveViewCount(articleId) {
		var self = this
			, startTime = performance.now()
			, propbag = self.fxpLoggerService.createPropertyBag();
		self.helpCentralService.saveArticleViewCount(articleId).then((response) => {
			propbag.addToBag("ArticleId", articleId);
			propbag.addToBag("TotalTime", (performance.now() - startTime).toString());
			self.fxpLoggerService.logEvent("Fxp.Controllers.HelpController", "SaveHelpFeedback", propbag);
		}, (error) => {
			self.logError(error, self.$rootScope.fxpUIConstants.UIMessages.HelpCentralSaveArticleViewCountSvcError, "4004");
		});
	}

	/**
	* A method called when search suggestion is selected
	* @method Fxp.Controllers.HelpController.onSearchKeyDown
	* @param {any} item is a selected object
	* @example <caption> Example to use onSearchKeyDown</caption>
	* HelpController.onSearchKeyDown(event, 'new')
	*/
	onSearchKeyDown(event, searchString) {
		var self = this;
		if (event.keyCode == 13) {
			self.searchHelpArticles(searchString);
		}
	}

	/**
	* A method called when search suggestion is selected
	* @method Fxp.Controllers.HelpController.onSearchSuggestionSelect
	* @param {any} item is a selected object
	* @example <caption> Example to use onSearchSuggestionSelect</caption>
	* HelpController.onSearchSuggestionSelect(item)
	*/
	onSearchSuggestionSelect(item) {
		var self = this;
		self.searchHelpArticles(item);
	}

	/**
	* A method to log error
	* @method Fxp.Controllers.HelpController.logError
	* @param {any} error is a error object
	* @example <caption> Example to use sortObject</caption>
	* HelpController.logError(error)
	*/
	logError(error, message, code): void {
		var self = this;
		var propbag = self.fxpLoggerService.createPropertyBag();
		propbag.addToBag(FxpConstants.metricConstants.Status, error.status);
		propbag.addToBag(FxpConstants.metricConstants.StatusText, error.statusText);
		self.fxpLoggerService.logError('Fxp.Controllers.HelpController', message.ErrorMessageTitle, code, null, propbag);

	}

	onPinHelpFlyoutClick() {
		this.$rootScope.isHelpFlyoutPinned = !this.$rootScope.isHelpFlyoutPinned;
	}

	/**
	* A method to show hide loader in help flyout
	* @example <caption> Example to use showLoader</caption>
	* HelpController.showLoader(true)
	*/
	showLoader(status) {
		var self = this;
		self.$scope.showHelpLoader = status;
	}
	
	navigateToHelpCentral() {
		var self = this;
		self.$window.open(self.$scope.helpCentralUrl, '_blank');
	}

	isCurrentLeftNavItemModified() {
		var self = this,isLeftNavModified;
		isLeftNavModified = !angular.equals(self.leftNavItem, self.$rootScope.currentLeftNavItem);
		if (isLeftNavModified) {
			self.leftNavItem = angular.copy(self.$rootScope.currentLeftNavItem);
		}
		return isLeftNavModified;
	}	

	templateCheck(name) {
		let self = this,
			result = false;
		if(self.$scope.initialFlags.contextualHelpEnabled && self.$scope.navigationCollection[self.$scope.currentNavigationIndex].indexOf(name) != -1){
			result = true;
		}
		return result;
	}

}
