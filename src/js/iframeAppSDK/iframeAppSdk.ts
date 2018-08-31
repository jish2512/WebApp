import { FxpResponseCallback, FxpRequestMessage, FxpServiceFuncRequest, RequestMessageType, FxpMessageEvent } from "./iframeAppSdkInferfaces";



export class FxpIframeClient {
	private callbackMap: Object = {};
	private origin: string;
	private source: Window;
	private initCallbackId: string = "init";
	private initCallback: Function;

	/**
	 * Array of trusted origin the sdk can connect with
	 * 
	 * @type {Array<string>}
	 * @memberof FxpIframeClient
	 */
	public trustedOrigin: Array<string> = [];


	/**
	 * Creates an instance of FxpIframeClient.
	 * @memberof FxpIframeClient
	 */
	public constructor() {
		window.addEventListener("message", this.receivedMessageHandler.bind(this), false);
		this.callbackMap[this.initCallbackId] = this.sendInitAck;
	}

	/**
	 * Calls an angular function inside Fxp context
	 * 
	 * @param {FxpResponseCallback} callback 
	 * @param {string} serviceName 
	 * @param {string} serviceFuncName 
	 * @param {...any[]} params 
	 * @memberof FxpIframeClient
	 */
	public callNgServiceFunc(callback: FxpResponseCallback, serviceName: string,
		serviceFuncName: string, ...params: any[]) {

		if (!this.origin)
			throw new Error("Origin is not defined");
		var callbackId = this.getUniqueId();
		this.callbackMap[callbackId] = callback;

		var fxpRequestMessage: FxpRequestMessage<FxpServiceFuncRequest> = {
			type: RequestMessageType.ServiceFuncRequest,
			data: {
				serviceName: serviceName,
				serviceFuncName: serviceFuncName,
				params: params
			},
			callbackId: callbackId
		};

		this.sendMessage(fxpRequestMessage);
	}

	/**
	 * Sets the callback to be called when fxpsdk is initialised
	 * 
	 * @param {Function} callback 
	 * @memberof FxpIframeClient
	 */
	public onInit(callback: Function) {
		this.initCallback = callback;
	}

	private sendInitAck = () => {
		this.sendMessage({ type: RequestMessageType.InitAckRequest });
		if (this.initCallback)
			this.initCallback();
	}

	/**
	 * Returns whether client is connected to fxp or not
	 * 
	 * @returns {boolean} 
	 * @memberof FxpIframeClient
	 */
	public isConnected(): boolean {
		return (this.trustedOrigin.indexOf(this.origin) > -1);
	}

	private receivedMessageHandler(event: FxpMessageEvent) {
		if (this.trustedOrigin.indexOf(event.origin) > -1) {
			this.origin = event.origin;
			this.source = event.source;
			var callbackId = event.data.callbackId;
			if (callbackId && this.callbackMap[callbackId]) {
				this.callbackMap[callbackId](event.data.error, event.data.response, event.data.contextInfo);
				delete this.callbackMap[callbackId];
			}

		}

	}

	private sendMessage(message: FxpRequestMessage<any>) {
		this.source.postMessage(message, this.origin);
	}

	private getUniqueId() {
		var ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
		let ID_LENGTH = 8
		let rtn = '';
		while (rtn === '' || this.callbackMap[rtn]) {
			for (let i = 0; i < ID_LENGTH; i++) {
				rtn += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
			}
		}
		return rtn;
	}

}