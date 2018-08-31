import { IPouchDbService } from "../interfaces/ipouchdbservice";
import { IPouchDbConnection } from "../interfaces/IPouchDbConnection";

export class PouchDbService implements IPouchDbService {
	private _database: any;
	private _localDbName: string;
	private _docId: string = "";

	constructor(localDatabaseName: string, pouchDbConnection: IPouchDbConnection) {
		this._localDbName = localDatabaseName;
		this._database = pouchDbConnection.getDatabase(localDatabaseName);
	}

	public save(jsonDocument: string): angular.IPromise<any> {
		var jsonDoc = JSON.parse(jsonDocument);
		return this._database.post(jsonDoc);
	};

	public delete(documentId: string, documentRevision: string) {
		return this._database.remove(documentId, documentRevision);
	};

	public saveUpdateDocument(jsonDocument: string, documentId: string): angular.IPromise<any> {
		var jsonDoc = JSON.parse(jsonDocument);
		return this._database.put(jsonDoc, documentId);
	};

	public getAllDocuments(): angular.IPromise<any> {
		return this._database.allDocs();
	};

	public get(documentId: string): angular.IPromise<any> {
		return this._database.get(documentId);
	};
}