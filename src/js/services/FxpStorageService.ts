/**
 * @application  Fxp
 */
/**
 * @module Fxp.Services
 */
/**
  * A service to connect to dashboard service to fetch the leftnav data of the user
  * @class Fxp.Services.FxpStorageService
  * @classdesc A service to connect to dashaboard service to fetch the leftnav data 
  * @example <caption> Example to create an instance of dashboard service</caption>         
  *  //Initializing FxpStorageService
  *  angular.module('FxPApp').controller('LeftNavController', ['FxpStorageService', LeftNavController]);
  *  function LeftNavController(FxpStorageService){ FxpStorageService.getLeftNavData(userAlias,roleGroupId); }
  */
export class FxpStorageService {
	private static _instance: FxpStorageService;
	private $window;

	constructor($window) {
		this.$window = $window;
		if (FxpStorageService._instance) {
			return FxpStorageService._instance;
		}
		FxpStorageService._instance = this;
	}

	saveInLocalStorage(key: string, data: any): void {
		var self = this;
		if (data)
			self.$window.localStorage && self.$window.localStorage.setItem(key, JSON.stringify(data));
	}

	getFromLocalStorage(key: string): any {
		var self = this;
		var data;
		data = (self.$window.localStorage && self.$window.localStorage.getItem(key));
		if (data)
			data = JSON.parse(data);
		return data;
	}

	deleteFromLocalStorage(key: string): any {
		var self = this;
		self.$window.localStorage && self.$window.localStorage.removeItem(key);
	}
}