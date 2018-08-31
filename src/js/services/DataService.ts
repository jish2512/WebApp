import { IDataService } from "../interfaces/IDataService";
import { AdalLoginHelperService } from "./AdalLoginHelperService";
import { ILogger } from "../interfaces/ILogger";
import { Observable } from "rxjs/Observable";

/**
* @application  Fxp
*/
/**
* @module Fxp.Utils.Services
*/
export class DataService implements IDataService {

	private sleepInterval: number = 100;
	private retryCount = {};

	constructor(
		private $http: angular.IHttpService,
		private $q: angular.IQService,
		private $timeout: angular.ITimeoutService,
		private adalLoginHelperService: AdalLoginHelperService,
		private fxploggerService: ILogger) {
	}

	public get(url: string, parentDeferred: any): angular.IPromise<any> {
		return this.getWithAdalTokenSync(url, parentDeferred);
	}

	public getAsObservable(url: string): Observable<any> {
		return Observable.create(observer=>{
			this.getWithAdalTokenSync(url, null).then((data) => {
				observer.next(data); 
				observer.complete(); 
			}).catch((error)=> {
				observer.error(error); 
			})
		})
		
	}
	private getWithAdalTokenSync(url: string, parentDeferred: any): angular.IPromise<any> {
		var self = this;
		var deferred = parentDeferred || self.$q.defer();

		if (self.adalLoginHelperService.accessTokenRequestInProgress(url)) {
			var retryCountForUrl = self.retryCount[url] || 0;
			retryCountForUrl++;
			self.retryCount[url] = retryCountForUrl;
			if (retryCountForUrl == 5) {
				delete self.retryCount[url];
				var propBag = self.fxploggerService.createPropertyBag();
				propBag.addToBag('ServiceUrl', url);

				self.fxploggerService.logError('Fxp.DataService', 'AdalTokenAquisitionFailed', '5001', null);
				return deferred.promise;
			}
			self.$timeout(function () {
				self.getWithAdalTokenSync(url, deferred);
			}, self.sleepInterval);
		}
		else {
			delete self.retryCount[url];
			return this.$http.get(url);
		}

		return deferred.promise;
	}
}

