import { ComponentType } from './ComponentType';

declare module Telemetry {
	module Extensions {
		module AI {
			 class BusinessProcessEvent {
				constructor(businessProcessName: string, componentType: ComponentType);
			}
		}
	}
}

 var MsitTelemetry = Telemetry.Extensions.AI;

export class BusinessProcessEvent extends MsitTelemetry.BusinessProcessEvent {
    Xcv: any;
    constructor(businessProcessName: string, componentType: ComponentType) {
        super(businessProcessName, componentType);
    }
}


