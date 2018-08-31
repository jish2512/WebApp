import { IFxpContext } from "../interfaces/IFxpContext";
import { IPouchDbService } from "../interfaces/ipouchdbservice";
import { IPouchDBProvider } from "../interfaces/IPouchDBProvider";
import { ApplicationConstants } from "../common/ApplicationConstants";
import { PouchDBProvider } from "../common/PouchDBProvider";

declare var Promise: any;
/**
 * @module  Fxp.Context
 */

/**
    * Represents an FxpContext
    * @class Fxp.Context.FxpContext
    * @example <caption> Example to create an object of FxpContext</caption>         
    *  //Initializing FxpContext
    *  var fxpContext = new Fxp.Context.FxpContext();    
    */
export class FxpContext implements IFxpContext {
	private static _instance: FxpContext;
	private pouchService: IPouchDbService;
	private _iPouchDBProvider: IPouchDBProvider;

	constructor(iPouchDBProvider: IPouchDBProvider) {
		if (FxpContext._instance) {
			return FxpContext._instance;
		}
		this._iPouchDBProvider = iPouchDBProvider;
		this.pouchService = this._iPouchDBProvider.getDBConnection(ApplicationConstants.GlobalContextDBName);

		FxpContext._instance = this;
	}

	//Keeping this function as is for backward Compatibility
	public static GetInstance(): FxpContext {
		if (!FxpContext._instance) {
			FxpContext._instance = new FxpContext(new PouchDBProvider());
		}

		return FxpContext._instance;
	}

	/**
   * Saves the current value in PouchDB using specified key and returns a Javascript Promise
   * @method Fxp.Context.FxpContext#saveContext
   * @param {string} key A key which will be identifier of the value of the data to be saved in PouchDB              
   * @param {string} value The value that needs to be saved
   * @param {string} applicationName The name of application. It is optional.
   * @example <caption> Example to use saveContext</caption>
   *  var fxpContext = Fxp.Context.FxpContext.GetInstance()
   *  fxpContext.saveContext("UIConfigDB","UIConfigDBName");
   *  fxpContext.saveContext("UIConfigDB","UIConfigDBName", "ApplicationName");
   */

	public saveContext(key: string, value: string, applicationName?: string): Promise<any> {
		try {
			return this.saveData(key, value, applicationName);
		}
		catch (exception) {
			//TODO: REVISIT THE scenario where exception occurs                
		}
	}

	/**
	* Read Data from Context using specified key and application name. If application name is null then it will fetch data from Global context otherwise ApplicationContext. 
	* It returns a Javascript Promise
	* @method Fxp.Context.FxpContext#readContext
	* @param {string} key A key which will be identifier of the value of the data that needs to be fetched from PouchDB              
	* @param {string} applicationName The name of application. It is optional parameter.
	* @example <caption> Example to use readContext</caption>
	*  var fxpContext = Fxp.Context.FxpContext.GetInstance()
	*  fxpContext.readContext("sessionId", "FXP");
	*  fxpContext.readContext("sessionId");
	*/
	public readContext(key: string, applicationName?: string): Promise<any> {
		try {
			return this.readData(key, applicationName);
		}
		catch (exception) {
			//TODO: REVISIT THE scenario where exception occurs
		}
	}

	/**
   * Delete data from context using specified key and application name. If application name is null then it will delete data from Global context otherwise ApplicationContext. 
   * It returns a Javascript Promise
   * @method Fxp.Context.FxpContext#deleteContext
   * @param {string} key A key which will be identifier of the value of the data that needs to be fetched from PouchDB              
   * @param {string} applicationName The name of application. It is optional parameter.
   * @example <caption> Example to use deleteContext</caption>
   *  var fxpContext = new Fxp.Context.deleteContext()
   *  fxpContext.deleteContext("sessionId", "FXP");
   *  fxpContext.deleteContext("sessionId");
   */
	public deleteContext(key: string, applicationName?: string): Promise<any> {
		try {
			var db: IPouchDbService = this.getDBService(applicationName);

			return new Promise(function (resolve, reject) {
				db.get(key).then(function (doc) {
					db.delete(key, doc._rev).
						then(function (doc) {
							resolve(doc)
						}).catch(function (err) {
							db.get(key).then(function (doc) {
								db.delete(key, doc._rev).then(function () {
									resolve(doc)
								}).catch(function (err) {
									console.log(err);
								});
							});
						});
				}).catch(function (err) {
					if (err.name == "not_found") {
						console.log("not-found");
					}
				});
			});
		}
		catch (exception) {
			//TODO: REVISIT THE scenario where exception occurs
		}
	}


	/**
	* Get FxpBaseUrl from FxpContext. It returns a Javascript Promise.
	* @method Fxp.Context.FxpContext#getFxpBaseUrl
	* @example <caption> Example to use getFxpBaseUrl</caption>
	*  var fxpContext = Fxp.Context.FxpContext.GetInstance()
	*  fxpContext.getFxpBaseUrl();
	*/
	public getFxpBaseUrl(): Promise<any> {
		try {
			return this.readData(ApplicationConstants.BaseUrl);
		}
		catch (exception) {
			console.log("Error while reading BaseUrl from context" + exception);
		}
	}
	/**
	* Get SessionId from FxpContext. It returns a Javascript Promise.
	* @method Fxp.Context.FxpContext#getAssetLibraryUrl
	* @example <caption> Example to use getAssetLibraryUrl</caption>
	*  var fxpContext = Fxp.Context.FxpContext.GetInstance()
	*  fxpContext.getAssetLibraryUrl();
	*/
	public getAssetLibraryUrl(): Promise<any> {
		try {
			return this.readData(ApplicationConstants.AssetsUrl);
		}
		catch (exception) {
			console.log("Error while reading Assets url from context" + exception);
		}
	}

	/**
	* Get SessionId from FxpContext. It returns a Javascript Promise.
	* @method Fxp.Context.FxpContext#getCurrentSessionId
	* @example <caption> Example to use getCurrentSessionId</caption>
	*  var fxpContext = new Fxp.Context.FxpContext()
	*  fxpContext.getCurrentSessionId();
	*/
	public getCurrentSessionId(): Promise<any> {
		try {
			return this.readData("sessionId");
		}
		catch (exception) {
			console.log("Error while reading SessionId from context" + exception);
		}
	}

	/**
  * Saves the current value in PouchDB using specified key and returns a Javascript Promise
  * @method Fxp.Context.FxpContext#saveData
  * @param {string} key A key which will be identifier of the value of the data to be saved in PouchDB              
  * @param {string} value The value that needs to be saved
  * @param {string} applicationName The name of application. It is optional.              
  */
	private saveData(key: string, value: string, applicationName?: string): Promise<any> {

		var saveUpdateDocument = this.saveUpdateDocument;

		try {
			var db: IPouchDbService = this.getDBService(applicationName);

			return new Promise(function (resolve, reject) {
				db.get(key).then(function (doc) {
					doc[key] = value;
					resolve(saveUpdateDocument(db, JSON.stringify(doc), key, value));
				}).catch(function (err) {
					if (err.name == "not_found") {
						var PropBagInternal: any = {};
						PropBagInternal[key] = value;
						var JSONData = JSON.stringify(PropBagInternal);
						resolve(saveUpdateDocument(db, JSONData, key, value));
					}
				});
			});
		}
		catch (exception) { }
	}

	/**
	* Saves Data to Context
	* It returns a any
	* @method Fxp.Context.FxpContext#saveUpdateDocument
	* @param {Fxp.Interfaces.IPouchDbService} db PouchDB Connnection Object
	* @param {string} document Json Document to be saved in PouchDB.            
	* @param {string} key A key which will be identifier of the value of the data to be saved in PouchDB              
	* @param {string} value The value that needs to be saved
	*/
	private saveUpdateDocument(db: IPouchDbService, document: string, key: string, value: string): any {
		db.saveUpdateDocument(document, key).
			then(function (doc) {
				return (doc)
			}).catch(function (err) {
				console.log(err);
			});
	}

	/**
	* Read Data from Context using specified key and application name. If application name is null then it will fetch data from Global context otherwise ApplicationContext. 
	* It returns a Javascript Promise
	* @method Fxp.Context.FxpContext#readData
	* @param {string} key A key which will be identifier of the value of the data that needs to be fetched from PouchDB              
	* @param {string} applicationName The name of application. It is optional parameter.                
	*/
	private readData(key: string, applicationName?: string): Promise<any> {
		try {
			var db: IPouchDbService = this.getDBService(applicationName);
			var PropBagInternal: any = {};
			return new Promise(function (resolve, reject) {
				db.get(key).then(function (doc) {
					PropBagInternal["IsError"] = false;
					PropBagInternal["Result"] = doc[key];
					PropBagInternal["Error"] = null;
					resolve(PropBagInternal);
				}).catch(function (err) {
					PropBagInternal["IsError"] = true;
					PropBagInternal["Result"] = null;
					PropBagInternal["Error"] = err;
					resolve(PropBagInternal);
				});
			});
			
		}
		catch (exception) { }
	}

	/**
	* Get DB Connetion Object
	* It returns a Fxp.Interfaces.IPouchDbService
	* @method Fxp.Context.FxpContext#getDBService        
	* @param {string} applicationName The name of application. It is optional parameter.                
	*/
	private getDBService(applicationName?: string): IPouchDbService {
		try {
			var db: IPouchDbService;
			switch (applicationName) {
				case "":
				case null:
				case undefined:
					db = this.pouchService;
					break;
				default:
					db = this._iPouchDBProvider.getDBConnection(applicationName);
					break;
			}
			return db;
		}
		catch (exception) { }
	}
}