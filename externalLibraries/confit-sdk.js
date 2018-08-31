
/**
* @namespace  Microsoft.PS.ConFit
*/
/**
 * @namespace Microsoft.PS.ConFit.Service
 */

(function (Microsoft) {
	var PS;
	(function (PS) {
		var ConFit;
		(function (ConFit) {
			var Service;
			(function (Service) {
				'use strict';
                /**
                * A service to connect to ConFit service to fetch configurations
                * @implements Microsoft.PS.ConFit.Interface.IConfigService
                * @class Microsoft.PS.ConFit.Service.ConFitService
                * @classdesc A service to connect to ConFit service to fetch configurations
                * @param {Object} $http    an instance of Angular HTTP service
                * @param {string} confitRootUrl basePath to connect ConFit service
                * @example <caption> Example to create an instance of ConFit service</caption>
                    // Inject 'ConFit' module in your module for example 'TestModule'
                    var module = angular.module('TestModule', ['ConFit']);
            
                    // In your module 'module', assign constant 'confitRootUrl' as the base adddress of ConFig Service. This is MUST for injecting url to ConFit Service
                     module.constant("confitRootUrl", "http://confitservicedev.azurewebsites.net/api/v1");
                */
				var ConFitService = (function () {
					function ConFitService($http, confitRootUrl) {
						this.httpService = $http;
						this.confitRootUrl = confitRootUrl;
					}
                    /**
                     * Gets configurations of a given entity from ConFit service
                     * @method Microsoft.PS.ConFit.Service.ConFitService#getConfig
                     * @param Microsoft.PS.ConFit.Domain.ConfigRequest request An instance of ConfigRequest
                     * @example <caption> Example to invoke getConfig</caption>
            
                        // Inject 'ConFitService' to your controller 'TestController'
                        module.controller('TestController', ['$scope', 'ConFitService', function ($scope, ConFitService) {
            
                        // Call the API as shown under
                        var request = new Microsoft.PS.ConFit.Domain.ConfigRequest("FXP", "Telemetry", ["Url", "ServerDns"]); // APP, FEATURE, KEYS
                        var response = ConFitService.getConfig(request);
            
                        response.then(function (jsonResponse) {
                            alert('Service Call Succeeded ');
                            $scope.Response = jsonResponse.data.data;
                        }, function (reason) {
                            alert('Service Call Failed ' + reason);
                        });
            
                        }]);
                    */
					ConFitService.prototype.getConfig = function (request) {
						var self = this;
						var path = self.confitRootUrl + "/configurations/" + request.app;
						var queryParameters = { feature: request.feature, keys: request.keys };
						var httpRequestParams = {
							method: 'GET',
							url: path,
							json: true,
							params: queryParameters
						};
						return self.httpService(httpRequestParams);
					};
					;
					ConFitService.$inject = ["$http"];
					return ConFitService;
				}());
				Service.ConFitService = ConFitService;
				angular.module("ConFit", []).service('ConFitService', ["$http", "confitRootUrl", ConFitService]);
			})(Service = ConFit.Service || (ConFit.Service = {}));
		})(ConFit = PS.ConFit || (PS.ConFit = {}));
	})(PS = Microsoft.PS || (Microsoft.PS = {}));
})(Microsoft || (Microsoft = {}));
/**
 * @namespace  Microsoft.PS.ConFit
 */
/**
 * @namespace Microsoft.PS.ConFit.Interfaces
 */
var Microsoft;
(function (Microsoft) {
	var PS;
	(function (PS) {
		var ConFit;
		(function (ConFit) {
			var Interface;
			(function (Interface) {
				'use strict';
			})(Interface = ConFit.Interface || (ConFit.Interface = {}));
		})(ConFit = PS.ConFit || (PS.ConFit = {}));
	})(PS = Microsoft.PS || (Microsoft.PS = {}));
})(Microsoft || (Microsoft = {}));
/**
* @namespace  Microsoft.PS.ConFit
*/
/**
 * @namespace Microsoft.PS.ConFit.Domain
 */
var Microsoft;
(function (Microsoft) {
	var PS;
	(function (PS) {
		var ConFit;
		(function (ConFit) {
			var Domain;
			(function (Domain) {
                /**
                 * Represents a ConfigRequest
                 * @class Microsoft.PS.ConFit.Domain.ConfigRequest
                 * @classdesc Represents a ConfigRequest
                 * @param {string} appId  uniqueid of an application
                 * @param {string} featureName  name of an feature
                 * @param {string} keys collection of keys against the feature
                 * @example <caption> Example to create a ConfigRequest</caption>
                 *  // Initializing EnityRequest
                 *  // var confiReq = new Microsoft.PS.ConFit.Domain.ConfigRequest("FXP");
                 *  // var confiReqFeature = new Microsoft.PS.ConFit.Domain.ConfigRequest("FXP","Telemetry");
                 *  // var confiReqFeatureForAKey = new Microsoft.PS.ConFit.Domain.ConfigRequest("FXP","Telemetry",['DiagnosticLevel','EventEnabled']);
                 */
				var ConfigRequest = (function () {
					function ConfigRequest(_appId, _featureName, _keys) {
						this.app = _appId;
						this.feature = _featureName;
						this.keys = _keys;
					}
					return ConfigRequest;
				}());
				Domain.ConfigRequest = ConfigRequest;
				var ConfigResponse = (function () {
					function ConfigResponse() {
					}
					return ConfigResponse;
				}());
				Domain.ConfigResponse = ConfigResponse;
			})(Domain = ConFit.Domain || (ConFit.Domain = {}));
		})(ConFit = PS.ConFit || (PS.ConFit = {}));
	})(PS = Microsoft.PS || (Microsoft.PS = {}));
})(Microsoft || (Microsoft = {}));
