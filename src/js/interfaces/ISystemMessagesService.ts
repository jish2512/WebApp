import ng = angular;
import { ISystemMessage } from "./isystemmessage";
import { IHttpPromise } from "angular";
// type systemMessageList = Array<ISystemMessage>;

export interface ISystemMessagesService {

	/** Gets list of System Messages. */
	getSystemMessagesCollectionAsync(messageCount: number, pageOffset: number, sortOrder: string): IHttpPromise<Array<ISystemMessage>>;

	/**
	 * Creates new widget.
	 * @param systemMessage Widget to be created.
	 */
	saveSystemMessageAsync(systemMessage: ISystemMessage): ng.IPromise<any>;

	/**
	 * Updates an existing widget.
	 * @param systemMessage Widget to be updated.
	 */
	deleteSystemMessageAsync(systemMessageId: string): ng.IPromise<any>;
}