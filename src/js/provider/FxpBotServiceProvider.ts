import { IFxpBotContext } from "../interfaces/IFxpBotContext";
import { UserInfoService } from "../services/UserInfoService";

export class FxpBotService {
	private _botContext: IFxpBotContext;

	static $inject = ['UserInfoService', '$http'];

	constructor(public userInfoService: UserInfoService, public $http: angular.IHttpService, botContext: IFxpBotContext) {
		this._botContext = botContext;
	}

	public setUserContext(otherData?: any): angular.IHttpPromise<any> {
		var config: angular.IRequestShortcutConfig = {
			headers: { 'Content-Type': 'application/json' }
		}
		var data = {
			UserAlias: this.userInfoService.getLoggedInUser(),
			AppID: this._botContext.AppID,
			TopicID: this._botContext.TopicID,
			OtherData: otherData
		}

		var requestUrl = this._botContext.Url + '/SetContext'
		var promise = this.$http.post(requestUrl, data, config);
		return promise;
	}
}

export class FxpBotServiceProvider implements angular.IServiceProvider {
	init() {
		//throw new Error("Method not implemented.");
	}
	addState(stateName: any, config: any): void {
		//throw new Error("Method not implemented.");
	}
	otherwise(input: any): void {
		throw new Error("Method not implemented.");
	}
	private _botContext: IFxpBotContext;

	constructor() {
		this.$get.$inject = ['UserInfoService', '$http']
	}

	$get(userInfoService: UserInfoService, $http: angular.IHttpService) {
		return new FxpBotService(userInfoService, $http, this._botContext);
	}

	public configure(botContext: IFxpBotContext): void {
		this._botContext = botContext;
	}
}