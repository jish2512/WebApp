import { IStateConfig } from "./IStateConfig";

export declare abstract class IAppService {
    getRoutes(userContext: any): Array<IStateConfig>;
    getAngular2Modules?(): Array<any>;
    getAngular1Modules?(): Array<string>;
    getRegisteredEndpoints(): Array<IServiceEndpoint>;
}
export interface IServiceEndpoint {
    ServiceEndpoint: string,
    ClientId: string
}