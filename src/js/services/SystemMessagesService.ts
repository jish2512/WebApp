import { ISystemMessagesService } from "../interfaces/ISystemMessagesService";
import { FxpConfigurationService } from "./FxpConfiguration";
import { ISystemMessage } from "../interfaces/isystemmessage";
import { IHttpPromise, IPromise } from "angular";

export class SystemMessagesService implements ISystemMessagesService {
	private systemMessagesEndPoint: string;

	constructor(private http: angular.IHttpService,
		private fxpConfiguration: FxpConfigurationService) {
		this.systemMessagesEndPoint = this.fxpConfiguration.FxpAppSettings.FxpServiceEndPoint + "/systemmessages";
	}

	getSystemMessagesCollectionAsync = (messageCount: number, pageOffset: number, sortOrder: string): IHttpPromise<Array<ISystemMessage>> => {
		let params = {
			'pageSize': messageCount,
			'pageNo': pageOffset,
			'sortOrder': sortOrder
		};
		return this.http.get(this.systemMessagesEndPoint, { params: params });
	}

	saveSystemMessageAsync = (systemMessage: ISystemMessage): IPromise<any> => {
		return this.http.post(this.systemMessagesEndPoint, systemMessage, { headers: { 'Content-Type': 'application/json' } });
	}

	deleteSystemMessageAsync = (systemMessageId: string): IPromise<any> => {
		let params = { 'id': systemMessageId };
		return this.http.delete(this.systemMessagesEndPoint, { params: params });
	}

	getPlannedDownTimeCollection = (): IHttpPromise<Array<ISystemMessage>> => {
		return this.http.get(this.systemMessagesEndPoint + "/getplanneddowntime");
	}
}