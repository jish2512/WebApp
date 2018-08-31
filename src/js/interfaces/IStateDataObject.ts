import { IStateDataExtendable } from "./IStateDataExtendable";

export interface IStateDataObject {
    headerName: string,
    breadcrumbText: string,
    pageTitle: string,
    requiredModules?: any,
    lazyLoad?: any,
    stateModulesMissing?: boolean,
    extendable?: IStateDataExtendable
}