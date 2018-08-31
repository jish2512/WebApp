export interface IDataService {
	get(url: string, parentDeferred?: any): angular.IPromise<any>;
}