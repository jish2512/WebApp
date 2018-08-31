var Microsoft;
(function (Microsoft) {
	var PS;
	(function (PS) {
		var Flighting;
		(function (Flighting) {
			var FeatureFlagService = (function () {
				function FeatureFlagService($http, featureFlagContext, context) {
					this.$http = $http;
					this.context = context;
					this.endpoint = featureFlagContext.ServiceEndpoint;
				}
				FeatureFlagService.prototype.getFeatureFlags = function (appName, env, features, params) {
					if (params === void 0) { params = {}; }
					if (features == null || features.length < 1)
						throw new Error("features parameter is empty");
					var url = this.endpoint + '/' + appName + '/' + env + '/flighting?featureNames=' + features.join();
					params = params || {};
					angular.extend(params, this.context);
					var config = {
						headers: { 'X-FlightContext': JSON.stringify(params) }
					};
					var promise = this.$http.get(url, config)
						.then(function (response) {
							return response.data;
						}, function (error) {
							console.error(error);
						});
					return promise;
				};
				FeatureFlagService.$inject = ['$http'];
				return FeatureFlagService;
			}());
			var FeatureFlagServiceProvider = (function () {
				function FeatureFlagServiceProvider() {
					this.$get.$inject = ['$http'];
				}
				FeatureFlagServiceProvider.prototype.$get = function ($http) {
					return new FeatureFlagService($http, this._featureFlagConfig, this._context);
				};
				FeatureFlagServiceProvider.prototype.configure = function (featureFlagConfig, context) {
					this._featureFlagConfig = featureFlagConfig;
					this._context = context;
				};
				return FeatureFlagServiceProvider;
			}());
			Flighting.FeatureFlagServiceProvider = FeatureFlagServiceProvider;
		})(Flighting = PS.Flighting || (PS.Flighting = {}));
	})(PS = Microsoft.PS || (Microsoft.PS = {}));
})(Microsoft || (Microsoft = {}));

var Microsoft;
(function (Microsoft) {
	var PS;
	(function (PS) {
		var Flighting;
		(function (Flighting) {
			'use strict';
			function featureFlag(featureFlagService) {
				return {
					restrict: 'AE',
					scope: {
						feature: '@',
						hiddenIfActive: '=?',
						appName: '=',
						env: '=',
						params: '=?'
					},
					transclude: true,
					template: '<div ng-show="enabled" ng-transclude></div>',
					link: function (scope, element, attributes) {
						var params = scope.params || {};
						scope.active = false;
						scope.enabled = !scope.hiddenIfActive;
						featureFlagService.getFeatureFlags(scope.appName, scope.env, [scope.feature], params)
							.then(function (response) {
								scope.active = response[scope.feature];
							});
						scope.$watch('active', function (newValue, oldValue) {
							scope.enabled = (scope.active && !scope.hiddenIfActive) || (!scope.active && scope.hiddenIfActive);
						});
					}
				};
			}
			Flighting.featureFlag = featureFlag;
		})(Flighting = PS.Flighting || (PS.Flighting = {}));
	})(PS = Microsoft.PS || (Microsoft.PS = {}));
})(Microsoft || (Microsoft = {}));

var Microsoft;
(function (Microsoft) {
	var PS;
	(function (PS) {
		var Flighting;
		(function (Flighting) {
			angular
				.module('Microsoft.PS.Flighting', [])
				.provider('FeatureFlagService', Microsoft.PS.Flighting.FeatureFlagServiceProvider)
				.directive('featureFlag', ['FeatureFlagService', Microsoft.PS.Flighting.featureFlag]);
		})(Flighting = PS.Flighting || (PS.Flighting = {}));
	})(PS = Microsoft.PS || (Microsoft.PS = {}));
})(Microsoft || (Microsoft = {}));