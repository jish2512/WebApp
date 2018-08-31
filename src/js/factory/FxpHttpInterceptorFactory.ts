import { UserInfoService } from "../services/UserInfoService";
import { FxpConfigurationService } from "../services/FxpConfiguration";
import { ILogger } from "../interfaces/ILogger";
import { IRootScope } from "../interfaces/IRootScope";
import { CommonUtils } from "../utils/CommonUtils";

export function httpCorrelationInterceptor(userInfoService: UserInfoService,
	fxpConfigurationService: FxpConfigurationService,
	loggerService: ILogger) {

	var authExcludeExtnPat = new RegExp(fxpConfigurationService.FxpBaseConfiguration.FxpConfigurationStrings.AdalAuthExcludeExtn, "i");
	var requestInterceptor = {
		request(config) {
			if (authExcludeExtnPat.test(config.url))
				delete config.headers["Authorization"];

			var uniqueTransactionId = CommonUtils.getNewGuId();
			config.headers["X-CorrelationId"] = uniqueTransactionId;

			var propBag = loggerService.createPropertyBag();
			propBag.addToBag("ServiceUrl", config.url);
			propBag.addToBag("MessageID", uniqueTransactionId);
			loggerService.logEvent("Fxp.HttpRetryInterceptor", "ServiceCall", propBag);

			if (userInfoService.isActingOnBehalfOf()) {
				config.headers["X-ActonBehalfMode"] = 'true';
				config.headers["X-OnBehalfOfUser"] = userInfoService.getCurrentUserUpn();
				config.headers["X-OnBehalfOfUserObjectId"] = userInfoService.getAADObjectID();
			}

			return config;
		}
	};
	return requestInterceptor;
}

export function httpRetryInterceptor($q: angular.IQService,
	$injector: angular.auto.IInjectorService,
	$timeout: angular.IHttpInterceptorFactory,
	fxpConfigurationService: FxpConfigurationService,
	loggerService: ILogger,
	$rootScope: IRootScope) {
	var requestURL,
		retries = {},
		waitBetweenErrors = fxpConfigurationService.FxpBaseConfiguration.HttpRetryWaitTime || 1000,
		maxRetries = fxpConfigurationService.FxpBaseConfiguration.HttpRetryCount || 3;
	function onResponseError(httpConfig) {
		return $timeout(function () {
			var $http: any = $injector.get('$http');
			return $http(httpConfig);
		}, waitBetweenErrors);
	}

	return {
		request: function (config) {
			requestURL = config.url;
			return config;
		},
		response: function (response) {
			logResourceTiming("ResourceTimingSuccess", response.config.url, response.status);
			if (retries[response.config.url])
				delete retries[response.config.url];

			return response;
		},
		responseError: function (response) {
			if (response != null && response.config != null && response.config.url) {
				logResourceTiming("ResourceTimingFailure", response.config.url, response.status);
				var retryForUrlCount = retries[response.config.url] || 0;
				var retryEnabled = response.config.retryEnabled === undefined ? true : response.config.retryEnabled;

				var propBag = loggerService.createPropertyBag();
				propBag.addToBag("ServiceUrl", response.config.url);
				propBag.addToBag("Status", response.status);
				propBag.addToBag("StatusText", response.statusText);

				if (retryEnabled && response.status === -1) {
					if (retryForUrlCount < maxRetries) {
						retryForUrlCount++;
						retries[response.config.url] = retryForUrlCount;

						loggerService.logEvent("Fxp.HttpRetryInterceptor", "ServiceCallRetry", propBag);
						return onResponseError(response.config);
					}
					else {
						loggerService.logEvent("Fxp.HttpRetryInterceptor", "ServiceCallRetryExit", propBag);
					}
				} else {
					loggerService.logEvent("Fxp.HttpRetryInterceptor", "ServiceCallFailed", propBag);
				}

				delete retries[response.config.url];
			}
			else {
				var propBag = loggerService.createPropertyBag();
				propBag.addToBag("Message", "responseError function does not return response as object, response value: " + response);
				propBag.addToBag("ServiceUrl", requestURL);
				loggerService.logEvent("Fxp.HttpRetryInterceptor", "ResponseErrorHandling", propBag);
			}

			return $q.reject(response);
		}
	};

	function logResourceTiming(message, url, status) {
		if (fxpConfigurationService.FxpAppSettings.EnableHttpTransactionTimeLogging) {
			var resourcePerf = window.performance.getEntries().filter(function getFilteredRecords(event) { return event.name.indexOf(url) > -1 });
			for (var i = 0; i < resourcePerf.length; i++) {
				var dns = resourcePerf[i].domainLookupEnd - resourcePerf[i].domainLookupStart,//capture domain lookup start
					tcp = resourcePerf[i].connectEnd - resourcePerf[i].connectStart,// TCP handshake
					ttfb = resourcePerf[i].responseStart - resourcePerf[i].startTime,//time to take first byte
					transfer = resourcePerf[i].responseEnd - resourcePerf[i].responseStart,
					total = resourcePerf[i].responseEnd - resourcePerf[i].startTime;// total time taken
				if (total > 0 && ttfb > 0) {
					var propBag = loggerService.createPropertyBag();
					propBag.addToBag("ResourceName", url);
					propBag.addToBag("Status", status);
					propBag.addToBag("DNS", dns.toString());
					propBag.addToBag("TCP", tcp.toString());
					propBag.addToBag("TTFB", ttfb.toString());
					propBag.addToBag("Transfer", transfer.toString());
					propBag.addToBag("Total", total.toString());
					loggerService.logEvent("Fxp.HttpRetryInterceptor", message, propBag);
				}
			}
		}
	}
}