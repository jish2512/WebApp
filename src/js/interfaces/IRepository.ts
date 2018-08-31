export interface IRepository {

	getById(payload: any): angular.IPromise<any>;

	getAll(payload: any): angular.IPromise<any>;

	search(payload: any): angular.IPromise<any>;

	delete(payload: any): angular.IPromise<any>;

	update(payload: any): angular.IPromise<any>;

	create(payload: any): angular.IPromise<any>;
}