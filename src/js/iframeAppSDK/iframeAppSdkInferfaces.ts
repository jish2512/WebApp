
export interface FxpMessageEvent extends MessageEvent {
	data: FxpResponseEventData
}

export interface FxpResponseEventData {
	response?: any;
	error?: any;
	callbackId: string;
	contextInfo?: FxpContextInfo
}
export enum RequestMessageType {
	ServiceFuncRequest = "ServiceFuncRequest",
	InitAckRequest = "InitAckRequest",
}
export interface FxpServiceFuncRequest {
	serviceName: string;
	serviceFuncName: string;
	params: Array<any>;
}
export interface FxpRequestMessage<T> {
	type: RequestMessageType,
	data?: T,
	callbackId?: string
}

export interface FxpContextInfo {
	correlationId: string
}

export interface FxpResponseCallback {
	(error: any, response: any, contextInfo: FxpContextInfo): void
}