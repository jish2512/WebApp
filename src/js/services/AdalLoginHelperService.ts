/// <reference path="../../typings/angularjs/angular-resource.d.ts" />
/// <reference path="../../typings/adal-angular/adal.d.ts" />
/// <reference path="../../typings/adal-angular/adal-angular.d.ts" />
/**
 * @application  Fxp
 */
/**
 * @module Fxp.Utils.Services
 */

/**
   * A service keeping the generic methods used in the fxp application and for multiple adal requests  
   * @class Fxp.Services.AdalLoginHelperService
   * @classdesc A service used for generic methods in the fxp application and adal simultaneous cors requests
   * @example <caption> Example to create an instance of AdalLoginHelperService</caption>
   *  //Initializing AdalLoginHelperService
   *  angular.module('FxPApp').controller('AppController', ['AdalLoginHelperService', AppController]);
   *  function AppController(AdalLoginHelperService){ AdalLoginHelperService.getJsonData(path, callbackfunc); }
   */
export class AdalLoginHelperService {
	private adal;
	private $q;
	private $resource;
	private adalAuthenticationService: adal.AdalAuthenticationService;

	constructor($q: angular.IQService, $resource: angular.resource.IResourceService, adalAuthenticationService: adal.AdalAuthenticationService) {

		this.$q = $q;
		this.$resource = $resource;
		this.adal = new AuthenticationContext(adalAuthenticationService.config);
	}
	
	registerEndPoint(endpoint:string, applicationId:string){
		this.adal.config.endpoints[endpoint]=applicationId;
	}

	/**
   * Checks for whether the adal service request is in progress or not and returns boolean 
   * @method Fxp.Utils.Services.AdalLoginHelperService.accessTokenRequestInProgress
   * @param {EndPoint} endpoint is the api endpoint for the resource or the api to which adal authorizes.
   * @example <caption> Example to invoke accessTokenRequestInProgress</caption>
   *  AdalLoginHelperService.accessTokenRequestInProgress('http://oneprofiledevapi.azurewebsites.net');
   */
	accessTokenRequestInProgress(endpoint): boolean {
		var requestInProgress = false;

		var resource = this.adal.getResourceForEndpoint(endpoint);

		var keysString = this.adal._getItem(this.adal.CONSTANTS.STORAGE.TOKEN_KEYS) || '';
		if (keysString.length > 0 &&
			(keysString === resource ||
				keysString.indexOf(resource + this.adal.CONSTANTS.RESOURCE_DELIMETER) > -1)) {
			var tokenStored = this.adal.getCachedToken(resource);

			if (tokenStored === null &&
				this.isTokenRetrievalStarted(resource)) {
				requestInProgress = true;
			}
		}
		return requestInProgress;
	}

	/**
   * Returns cached token for a given endpoint 
   * @method Fxp.Utils.Services.AdalLoginHelperService.getCachedToken
   * @param {EndPoint} endpoint is the api endpoint for the resource or the api to which adal authorizes.
   * @example <caption> Example to invoke getCachedToken</caption>
   *  AdalLoginHelperService.getCachedToken('http://oneprofiledevapi.azurewebsites.net');
   */
	getCachedToken(endpoint) {
		var resource = this.adal.getResourceForEndpoint(endpoint);
		return this.adal.getCachedToken(resource);
	}

	/**
  * To kick off token acquisition manually on special cases 
  * @method Fxp.Utils.Services.AdalLoginHelperService.acquireToken
  * @param {EndPoint} endpoint is the api endpoint for the resource or the api to which adal authorizes.
  * @example <caption> Example to invoke acquireToken</caption>
  *  AdalLoginHelperService.acquireToken('http://oneprofiledevapi.azurewebsites.net');
  */
	acquireToken(endpoint, callback) {
		var resource = this.adal.getResourceForEndpoint(endpoint);
		this.adal.acquireToken(resource, callback);
		if (!this.getCachedToken(endpoint)) {
			var now = new Date().getTime();
			while (new Date().getTime() < now + 1000);
		}
	}
	/**
   * Checks for whether the token retrieval is started for the endpoint provided  
   * @method Fxp.Utils.Services.AdalLoginHelperService.isTokenRetrievalStarted
   * @param {Resource} resource an endpoint which is passed to check for it in the logs entry.
   * @example <caption> Example to invoke isTokenRetrievalStarted</caption>
   *  AdalLoginHelperService.isTokenRetrievalStarted('https://microsoft.onmicrosoft.com/FXPCouchBaseAPI');
   */
	isTokenRetrievalStarted(resource): boolean {
		var isTokenRetrievalStarted = false;

		var log = this.adal._getItem(this.adal.CONSTANTS.LOG_ENTRY + resource);
		if (log) {
			var logEntries = log.split(';');
			var lastEntry = logEntries[logEntries.length - 2];
			var entryTime = new Date(lastEntry.substr(0, lastEntry.indexOf('GMT:') + 3));
			var now = new Date();
			isTokenRetrievalStarted = now.getTime() < entryTime.getTime() + 10000;
		}

		return isTokenRetrievalStarted;
	}

}

