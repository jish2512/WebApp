import { ISettingsServiceConfig } from "./ISettingsServiceConfig";

export interface ISettingsServiceProvider extends angular.IServiceProvider {
	configure(settingServiceConfig: ISettingsServiceConfig): void;
}