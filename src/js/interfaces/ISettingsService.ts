import { SettingsType } from "../common/SettingsType";

export interface ISettingsService {
	getSettings(settingType: SettingsType, settingId: string, settingNames: string[] | string): angular.IPromise<string>;
	saveSettings(settingType: SettingsType, settingId: string, settingName: string, settingValue: string): angular.IPromise<boolean>;
}