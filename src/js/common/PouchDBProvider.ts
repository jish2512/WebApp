import { IPouchDbService } from "../interfaces/ipouchdbservice";
import { PouchDbConnection } from "./PouchDbConnection";
import { IPouchDBProvider } from "../interfaces/IPouchDBProvider";
import { PouchDbService } from "./PouchDbService";


/**
* A service which provides PouchDb Connection
* @class Fxp.Common.PouchDBProvider
* @classdesc A service which provides PouchDb Connection
* @example <caption> Example to create an instance of Fxp PouchDBProvider</caption>         
*  //Initializing Fxp Message
*      angular.module('FxPApp').service('FxpContextService', ['PouchDBProvider', FxpContext]);
*  function FxpContext(PouchDBProvider){ PouchDBProvider.getDBConnection(Fxp.Common.Constants.ApplicationConstants.GlobalContextDBName)}
*/
export class PouchDBProvider implements IPouchDBProvider {

	constructor() { }

	/**
  * Saves the current value in PouchDB using specified key and returns a Javascript Promise
  * @method Fxp.Context.FxpContext#saveContext
  * @param {string} applicationName The name of the DB for which connection object has to be fetched         
  * @example <caption> Example to use getDBConnection</caption>
  *  PouchDBProvider.getDBConnection(Fxp.Common.Constants.ApplicationConstants.GlobalContextDBName)
  */
	getDBConnection(applicationName: string): IPouchDbService {
		var DbConnection = new PouchDbConnection();
		DbConnection.createDatabase(applicationName);
		return new PouchDbService(applicationName, DbConnection);
	}
}