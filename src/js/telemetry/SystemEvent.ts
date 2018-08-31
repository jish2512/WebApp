import { ComponentType } from './ComponentType';
declare module Telemetry {
	module Extensions {
		module AI {
			class SystemEvent {
				constructor(businessProcessName: string, componentType: ComponentType, systemMessage: string);
			}
		}
	}
}

var MsitTelemetry = Telemetry.Extensions.AI;

export class SystemEvent extends MsitTelemetry.SystemEvent {
	Xcv: any;
	constructor(businessProcessName: string, componentType: ComponentType, systemMessage: string) {
		super(businessProcessName, componentType, systemMessage);
	}
}