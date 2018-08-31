
export class IframeAppMessage {
	public static FailedToLoadMessage = `We are facing issues loading {0}\nPlease visit [{1}]({1}) and try refreshing this page`
}

export enum IframeAppRequestType {
	InitAckRequest = "InitAckRequest",
	ServiceFuncRequest = "ServiceFuncRequest"

}