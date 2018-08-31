
export interface IFxpContext {
	saveContext(key: string, value: string, applicationName?: string): Promise<any>;

	readContext(key: string, applicationName?: string): Promise<any>;

	getCurrentSessionId(): Promise<any>;
}