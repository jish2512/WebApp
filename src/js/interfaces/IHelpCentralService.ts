export interface IHelpCentralService {
	getContextualHelpArticles(businessCapability, businessFunctions, topArticles, searchString): angular.IPromise<any>;
	getContextualHelpArticleContent(articleId): angular.IPromise<any>;
	saveArticleFeedback(feedback): angular.IPromise<any>;
	getSuggestions(searchPhrase): angular.IPromise<any>;
	saveArticleViewCount(articleId): angular.IPromise<any>;
}