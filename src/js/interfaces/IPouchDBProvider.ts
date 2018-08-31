import { IPouchDbService } from "./ipouchdbservice";

export interface IPouchDBProvider {
	getDBConnection(applicationName: string): IPouchDbService;
}