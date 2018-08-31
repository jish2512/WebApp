import { IPouchDbConnection } from "../interfaces/IPouchDbConnection";

declare var PouchDB : any;

export class PouchDbConnection implements IPouchDbConnection {

	public destroy(localDatabaseName: string) {
		var database= new PouchDB(localDatabaseName);
		database.destroy();
	};

	public createDatabase(localDatabaseName: string) {
		var database = new PouchDB(localDatabaseName);
	};

	public getDatabase(localDatabaseName: string): any {
		var database = new PouchDB(localDatabaseName);
		return database;
	};


}