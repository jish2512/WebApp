import { ISettingsServiceConfig } from "../interfaces/ISettingsServiceConfig";
import { ISettingsService } from "../interfaces/ISettingsService";
import { ISettingsServiceProvider } from "../interfaces/ISettingsServiceProvider";
import { AdalLoginHelperService } from "../services/AdalLoginHelperService";
import { SettingsType } from "../common/SettingsType";

declare var deferred: any;

export class SettingsServiceProvider implements ISettingsServiceProvider {
	init() {
		//throw new Error("Method not implemented.");
	}
	addState(stateName: any, config: any): void {
		//throw new Error("Method not implemented.");
	}
	otherwise(input: any): void {
		//throw new Error("Method not implemented.");
	}
	private settingsServiceConfig: ISettingsServiceConfig = { settingsServiceBaseUrl: "" };
	private iReqCount: number;
	private sleepInterval: number;
	private http: angular.IHttpService;
	private adalLoginHelperService: AdalLoginHelperService;
	private timeout: angular.ITimeoutService;
	private q: angular.IQService;

	public configure(settingsSeerviceConfig: ISettingsServiceConfig) {
		angular.extend(this.settingsServiceConfig, settingsSeerviceConfig);
	}
	constructor() {
		this.$get.$inject = ['$http', 'AdalLoginHelperService', '$timeout', '$q'];
	}

	$get($http: angular.IHttpService,
		AdalLoginHelperService: AdalLoginHelperService,
		$timeout: angular.ITimeoutService,
		$q: angular.IQService): ISettingsService {
		this.http = $http;
		this.adalLoginHelperService = AdalLoginHelperService;
		this.timeout = $timeout;
		this.q = $q;
		this.iReqCount = 0;
		this.sleepInterval = 100;
		var settingsService: ISettingsService = {
			getSettings: (settingType: SettingsType, settingId: string, settingNames: string[]): angular.IPromise<string> => {
				var pathUrl = this.getPathUrl(settingType, settingId);
				var url = this.settingsServiceConfig.settingsServiceBaseUrl + pathUrl + '?settingNames=' + settingNames;
				return this.getSettingsSvc(url);
			},
			saveSettings: (settingType: SettingsType, settingId: string, settingName: string, settingValue: string): angular.IPromise<boolean> => {
				var pathUrl = this.getPathUrl(settingType, settingId);
				var url = this.settingsServiceConfig.settingsServiceBaseUrl + pathUrl;
				return this.saveSettingsSvc(url, { settingName: settingName, settingValue: settingValue });
			}
		};
		return settingsService;
	}

	getSettingsSvc(url: string): angular.IPromise<any> {
		var self = this;
		var deferred = self.q.defer();
		if (self.adalLoginHelperService.accessTokenRequestInProgress(url)) {
			self.iReqCount++;
			if (self.iReqCount == 5) {
				return deferred.promise;
			}

			self.timeout(function () {
				self.getSettingsSvc(url);
			}, self.sleepInterval);
		}
		else {
			self.iReqCount = 0;
			return self.http.get(url);
		}

		return deferred.promise;
	}

	saveSettingsSvc(url: string, value: any): angular.IPromise<any> {
		var self = this;
		var deferred = self.q.defer();
		if (self.adalLoginHelperService.accessTokenRequestInProgress(url)) {
			self.iReqCount++;
			if (self.iReqCount == 5) {
				return deferred.promise;
			}

			self.timeout(function () {
				self.saveSettingsSvc(url, value);
			}, self.sleepInterval);
		}
		else {
			self.iReqCount = 0;
			return self.http.post(url, value, { headers: { 'Content-Type': 'application/json' } });
		}

		return deferred.promise;
	}

	getPathUrl(settingType: SettingsType, settingId: string): string {
		var settingTypeValue = SettingsType[settingType];
		var pathUrl = '/' + settingTypeValue + '/' + settingId + '/settings';
		return pathUrl;
	}
}