import { IStateDataObject } from "./IStateDataObject";
import { StateParams } from "@uirouter/core";

export interface IStateConfig {
    name: string,
    url: string,
    templateUrl?: string,
    controller?: string,
    controllerAs?: string,
    component?: any,
    resolve?: string,
    params?: StateParams,
    data: IStateDataObject,
    views?: any
}