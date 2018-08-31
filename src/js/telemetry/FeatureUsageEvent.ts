import { ComponentType } from './ComponentType';
declare module Telemetry {
	module Extensions {
		module AI {
			class FeatureUsageEvent {
				constructor(eventName: string, componentType: ComponentType) ;
			}
		}
	}
}
var MsitTelemetry = Telemetry.Extensions.AI;
export class FeatureUsageEvent extends MsitTelemetry.FeatureUsageEvent {
	Xcv: any;
	constructor(eventName: string, componentType: ComponentType) {
		// @ts-ignore: this is just a stub
		super(eventName, componentType);
	}
}