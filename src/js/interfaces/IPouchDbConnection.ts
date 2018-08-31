declare var pouchDB: any;
export interface IPouchDbConnection {
	createDatabase(localDatabaseName: string): void;
	getDatabase(localDatabaseName: string): any;
	destroy(localDatabaseName: string);
}