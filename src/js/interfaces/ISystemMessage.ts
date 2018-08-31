import ng = angular;
export interface ISystemMessage {
	id: string;
	messageType: SystemMessageType;
	message: string;
	businessCapability: any;
	businessFunction: any;
	startTime: any;
	startTimeString: string;
	endTime: any;
	endTimeString: string;
	createdOn: any;
	createdBy: string;
	lastModifiedBy: string,
	isActive: boolean|string,
	isDeleted: boolean
}

export type SystemMessageType = "Intermittent" | "SystemDown";