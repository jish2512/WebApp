export interface IDataStrategy {
	getData(serviceUrl: string, payload: string, tileHtmlId: string): angular.IPromise<any>;
}