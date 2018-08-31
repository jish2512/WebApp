export interface IPouchDbService {
	save(jsonDocument: string): angular.IPromise<any>;
	delete(documentId: string, documentRevision: string);
	get(documentId: string): angular.IPromise<any>;
	getAllDocuments(): angular.IPromise<any>;
	saveUpdateDocument(jsonDocument: string, documentId: string): angular.IPromise<any>;
}