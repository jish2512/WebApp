import { IHelpCentralService } from "../interfaces/IHelpCentralService";
import { FxpConfigurationService } from "./FxpConfiguration";
import { UserInfoService } from "./UserInfoService";

/**
 * @application  Fxp
 */
/**
 * @module Fxp.Services
 */
/**
   * A service to handle service call for Contextual Help Articles
   * @class Fxp.Services.HelpCentralService
   * @classdesc A service to handle service calls for Contextual Help Articles
   * @example <caption> Example to create an instance of HelpCentralService</caption>
   * //Initializing HelpCentralService
   * angular.module('FxPApp').controller('AppController', ['HelpCentralService', AppController]);
   * function AppController(helpCentralService, fxpConstants){ helpCentralService.getContextualHelpArticles(); }
   */
export class HelpCentralService implements IHelpCentralService {

	private helpCentralServiceEndPoint: string;
	private roleGroupId: string;
	private tenantName: string;
	private helpCentralServiceAppId: string;
	constructor(
		private $http: angular.IHttpService,
		private fxpConfiguration: FxpConfigurationService,
		private userInfoService: UserInfoService,
		private deviceFactory: any
	) {

		this.helpCentralServiceEndPoint = fxpConfiguration.FxpAppSettings.HelpCentralServiceEndpoint;
		this.helpCentralServiceAppId =window["tenantConfiguration"].UIStrings.HelpCentralAppId;
		this.roleGroupId = this.userInfoService.getCurrentUserData().roleGroupId;
		this.tenantName = this.userInfoService.getCurrentUserData().TenantName;
	}

	/**
	* Get Help Article content
	* @method Fxp.Services.HelpCentralService.getContextualHelpArticles
	* @param {number} topArticles mandatory number value which contains number of notification to be fetched.
	* @param {number} businessCapability optional number value which contains GLN-L0 Help Articles to be fetched.
	* @param {number} businessFunctions optional number value which contains GLN-L1 Help Articles to be fetched.
	* @param {string} searchString optional string value which contains search value against which Help Articles are to be fetched.
	* @example <caption> Example to invoke getNotifications</caption>
	*  helpCentralService.getContextualHelpArticles(startIndex, count);
	*/
	getContextualHelpArticles(topArticles, businessCapability?, businessFunctions?, searchString?): angular.IPromise<any> {
		var self = this,
			deviceType = self.deviceFactory.isMobile() ? "Mobile" : "Desktop";
		var url = self.helpCentralServiceEndPoint + "tenants/" + self.tenantName + "/app/" + self.helpCentralServiceAppId
			+ "/search?Filter=Meta_ViewPort:" + deviceType + ";";
		if (searchString) {
			url += "&SearchString=" + searchString;
		} else {
			url += "Meta_RoleGroup:" + self.roleGroupId + ";";
			url += (businessCapability) ? "Meta_L0:" + businessCapability + ";" : '';
			url += (businessFunctions) ? "Meta_L1:" + businessFunctions + ";" : '';
		}
		url += "&top=" + topArticles + "&skip=0";
		return this.$http.get(url);
	}

	/**
	* Get Help Article content
	* @method Fxp.Services.HelpCentralService.getContextualHelpArticleContent
	* @param {object} articleId mandatory value which contains id of article to be fetched.
	* @example <caption> Example to invoke getContextualHelpArticleContent</caption>
	* helpCentralService.getContextualHelpArticleContent(articleId);
	*/
	getContextualHelpArticleContent(articleId): angular.IPromise<any> {
		var urlGetArticle = this.helpCentralServiceEndPoint + "articles/" + articleId + "?tenantid=" + this.tenantName + "&appid=" + this.helpCentralServiceAppId;
		return this.$http.get(urlGetArticle);
	}
	getSuggestions(searchPhrase: string): angular.IPromise<any> {
		var url = this.helpCentralServiceEndPoint + "tenants/" + this.tenantName + "/app/" + this.helpCentralServiceAppId + "/suggest?SuggestString=" + searchPhrase + "&FuzzySearch=true";
		return this.$http.get(url);
	}

	saveArticleFeedback(feedback): angular.IPromise<any> {
		var url = this.helpCentralServiceEndPoint + "article/feedback?tenantid=" + this.tenantName + "&appid=" + this.helpCentralServiceAppId;
		return this.$http.post<string>(url, feedback, { headers: { 'Content-Type': 'application/json' } });
	}

	saveArticleViewCount(articleId): angular.IPromise<any> {
		var url = this.helpCentralServiceEndPoint + "articles/" + articleId + "/readhistory?tenantid=" + this.tenantName + "&appid=" + this.helpCentralServiceAppId;
		return this.$http.post<string>(url, { headers: { 'Content-Type': 'application/json' } });
	}
}

