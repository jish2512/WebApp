import { GlobalExceptionHandler } from "./telemetry/GlobalExceptionHandler";
import { CommonUtils } from "./utils/CommonUtils";
declare var FxpBaseConfiguration: any;
declare var requirejs: any;
declare var define: any; 

requirejs.config({
	//Base URL for relative paths
	baseUrl: "js",
	//waitsSeconds has been set to 0 to avoid timeout while downloading js file. It was observed that huge bundle files was getting timeout while downloading.
	waitSeconds: 0,
	//Defining Paths Key value pair
	paths: {
		'angularAMD': 'lib/angularAMD',
		'ngload': 'lib/ngload',
		'app': 'boot/FXPAMDBoot'
	},
	shim: {
	},
	//Application dependencies and start point
	deps: ['angularAMD', 'app']
});

requirejs.onError = function (err) {
	var error = new Error(), systemDownHeader, systemDownDescription, systemDownPageTitle;
	error.message = 'FxP App Boot Failure';
	if (FxpBaseConfiguration.FxpConfigurationStrings.UIMessages.JavaScriptException) {
		systemDownHeader = FxpBaseConfiguration.FxpConfigurationStrings.UIMessages.JavaScriptException.ErrorMessageTitle;
        systemDownDescription = FxpBaseConfiguration.FxpConfigurationStrings.UIMessages.JavaScriptException.ErrorMessage;
        systemDownPageTitle = CommonUtils.getTenantURLSpecificPageTitle(FxpBaseConfiguration.FxpConfigurationStrings.UIMessages.JavaScriptException.PageTitle);
	} else {
		console.log("Failed to load JavaScriptException error string from UIMessages");
	}
	// More specific error logging.
	console.error("FxP App Boot Failure: ", err.message);
	GlobalExceptionHandler.logError(error, { Details: err.message, ErrorCode: "3012" }, "Requirejs.OnError");
	GlobalExceptionHandler.logFxpBootFailure({ ErrorDetails: err.message }, "Requirejs.OnError", false, systemDownHeader, systemDownDescription, systemDownPageTitle);
};
// global error handler



define(['angularAMD'], function (angularAMD) {
	// UIStateHelper is accessing it from window object. 
	window["angularAMD"] = angularAMD;
});