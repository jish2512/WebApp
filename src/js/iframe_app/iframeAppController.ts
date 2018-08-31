import { FxpUIData } from "../factory/FxpUIDataFactory";
import { PageLoaderService } from "../services/pageLoaderService";
import { FxpMessageService } from "../services/FxpMessageService";
import { IframeAppRequestType, IframeAppMessage } from "./iframeAppConstants";
import { CommonUtils } from "../utils/CommonUtils";
import { IframeBridgeService } from "./iframeBridgeService";
import { FxpResponseEventData, FxpRequestMessage, FxpContextInfo, FxpServiceFuncRequest } from "../iframeAppSDK/iframeAppSdkInferfaces";

export interface IframeAppCtrlScope extends angular.IScope {
	iframeAppTitle: string;
	iframeAppUrl: string;
}
export class IframeAppController {
	private iframeElement = (document.getElementById("externalIframe") as HTMLIFrameElement);
	private iframeWindow = this.iframeElement.contentWindow;
	private initSuccess: boolean = false;

	static $inject = ['$scope', 'IframeBridgeService', 'FxpUIData', '$location', '$stateParams', 'PageLoaderService', 'FxpMessageService'];
	public constructor(private $scope: IframeAppCtrlScope,
		private IframeBridgeService: IframeBridgeService,
		private fxpUIData: FxpUIData,
		private $location: angular.ILocationService,
		private $stateParams: any,
		private pageLoaderService: PageLoaderService,
		private fxpMessageService: FxpMessageService) {

		var self = this;
		$scope.iframeAppTitle = fxpUIData.getHeaderText();

		//get pathUrl by removing app prefix from url
		var pathUrl = $location.url().replace(/^\/[a-zA-Z0-9]+/, '');
		$scope.iframeAppUrl = $stateParams.baseUrl + pathUrl;

		window.addEventListener("message", this.iframeMessageEventHandler, false);
		angular.element('#externalIframe').on('load', function () {
			self.pageLoaderService.fnHidePageLoader();
			self.sendMessage({ callbackId: "init" });
			setTimeout(function () {
				self.checkInitSuccess();
			}, 3000);
		});

		this.pageLoaderService.fnShowPageLoader("Loading " + this.$scope.iframeAppTitle);
	}

	private sendMessage(message: FxpResponseEventData) {
		message.contextInfo = this.getContextInfo();

		this.iframeWindow.postMessage(this.getClonableMessage(message), this.$scope.iframeAppUrl);
	}

	private iframeMessageEventHandler = (event: MessageEvent) => {
		if (this.$scope.iframeAppUrl.indexOf(event.origin) == 0) {
			try {
				var self = this;
				var data = event.data as FxpRequestMessage<any>;
				switch (data.type as string) {
					case IframeAppRequestType.InitAckRequest:
						{
							self.handleInitAck();
							break;
						}
					case IframeAppRequestType.ServiceFuncRequest:
						{
							self.handleServiceFuncRequest(data);
							break;
						}
				}

			}
			catch (error) {

				self.sendMessage({ error: error, callbackId: data.callbackId });
			}

		}
	}

	private handleServiceFuncRequest(message: FxpRequestMessage<any>) {
		var self = this;
		var data = message.data as FxpServiceFuncRequest;
		var result = this.IframeBridgeService.callNgServiceFunc(data.serviceName,
			data.serviceFuncName, data.params);

		if (result && result.then) //Handling promises
		{
			result.then(function success(response) {
				self.sendMessage({ response: response, callbackId: message.callbackId });
			},
				function fail(err) {
					self.sendMessage({ error: err, callbackId: message.callbackId });
				});
		}
		else
			self.sendMessage({ response: result, callbackId: message.callbackId });
	}

	private handleInitAck() {
		this.initSuccess = true;
	}

	private checkInitSuccess() {
		if (!this.initSuccess) {
			var errorMessage = CommonUtils.stringFormat(IframeAppMessage.FailedToLoadMessage,
				this.$scope.iframeAppTitle, this.$scope.iframeAppUrl);
			this.fxpMessageService.addMessage(errorMessage, "error", true);
		}
	}

	private getClonableMessage(message: FxpResponseEventData) {
		var clonableMessage = {};
		Object.getOwnPropertyNames(message).forEach((key) => {
			clonableMessage[key] = this.getObjectClone(message[key]);
		});
		return clonableMessage;
	}

	private getObjectClone(obj) {
		if (!CommonUtils.isObject(obj) && !(obj instanceof Error)) return obj;
		var objClone = {}
		//converting all getters to properties
		Object.getOwnPropertyNames(obj).forEach(function (key) {
			objClone[key] = obj[key];
		});
		//removing functions from object
		return JSON.parse(JSON.stringify(objClone));
	}

	private getContextInfo(): FxpContextInfo {
		return {
			correlationId: $.correlator.getCorrelationId()
		}
	}
}

 export var NonFxpApp: string = "NonFxpApp";

angular.module(NonFxpApp, [])
	 .controller("IframeAppController", IframeAppController);




