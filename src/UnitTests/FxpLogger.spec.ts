describe("Given FxpLogger Suite", function () {
    var fxpLogger, telemetryConfig, FxpLoggingStrategyFactory, fxpConfigurationService;
    var propbag = jasmine.createSpyObj("LogPropertyBag", ["addToBag", "getItems", "addRange", "propBagInternal"]);
    var propBagInternal = [];
    var oboUserInfo = {
        "RoleGroupId": "1",
        "RoleGroupName": "Delivery Manager"
    };
    var loggedInUserInfo = {
        "RoleGroupId": "5",
        "RoleGroupName": "Non Service User"
    };
    propbag.addToBag = jasmine.createSpy("addToBag").and.callFake(function (key, value) {
        propBagInternal[key] = value;
    });
    propbag.getItems = jasmine.createSpy("getItems").and.callFake(function (key, value) {
        return propBagInternal;
    });
    propbag.propBagInternal = {
        ServiceLine: "ServiceLine Test",
        Program: "Program Test",
        ComponentName: "ComponentName Test",
        LoggedInUserRoleGroupId: "1",
        LoggedInUserRoleGroupName: "Delivery Manager",
        OBORoleGroupId: "5",
        OBORoleGroupName: "Non Service User"
    }

    Fxp.Telemetry.Helper.FxpLogHelper.createPropertyBag = jasmine.createSpy("createPropertyBag").and.callFake(function () {
        return propbag;
    });
    var metricsbag = jasmine.createSpyObj("LogMetricBag", ["addToBag", "getItems", "addRange"]);
    Fxp.Telemetry.Helper.FxpLogHelper.createMetricBag = jasmine.createSpy("createMetricBag").and.callFake(function () {
        return metricsbag;
    });
    beforeEach(angular.mock.module('FxPApp'));
    beforeEach(angular.mock.module('Telemetry'));
    beforeEach(function () {
        angular.mock.module(function ($provide) {
            $provide.service("FxpConfigurationService", function () {
                var configData = {
                    "Telemetry": {
                        "DiagnosticLevel": 4,
                        "EventEnabled": true,
                        "PerformanceMetricEnabled": true,
                        "InstrumentationKey": '05f8sd6c0-c4c1-476d-9cd7-5ed08bcsdf4c',
                        "DebugEnabled": false
                    }
                };
                this.FxpBaseConfiguration = configData;
            });
            $provide.service("TelemetryConfiguration", function () {
                this.DiagnosticLevel = 4;
                this.EventEnabled = true;
                this.PerformanceMetricEnabled = true;
                this.InstrumentationKey = '05f8sd6c0-c4c1-476d-9cd7-5ed08bcsdf4c';
                this.DebugEnabled = false;
                this.PerfMarkersEnabled = true;
            });
            $provide.service("FxpLoggingStrategyFactory", function () {
                this.GetLoggingStrategy = jasmine.createSpy("GetLoggingStrategy").and.callFake(function () {
                    var LogginStrategy = jasmine.createSpyObj("ILoggingStrategy", ["logError", "logException", "logWarning", "logInformation", "logTrace", "stopTrackEvent", "startTrackEvent", "logEvent", "logMetric", "trackPageView", "startTrackEvent", "stopTrackEvent"]);
                    return LogginStrategy;
                });
            });
        });
    });
    beforeEach(inject(function (_FxpLoggerService_, TelemetryConfiguration, FxpConfigurationService, FxpLoggingStrategyFactory) {
        telemetryConfig = TelemetryConfiguration;
        FxpLoggingStrategyFactory = FxpLoggingStrategyFactory;
        fxpConfigurationService = FxpConfigurationService;
        fxpLogger = _FxpLoggerService_;
    }));
    describe("When we call stopTrackPerformance and no parameters passed", function () {
        beforeEach(function () {
            fxpLogger.telemetryConfig.DebugEnabled = true;
            spyOn(console, "warn").and.callThrough();
            fxpLogger.stopTrackPerformance();
        });
        it("Then it should log warning in console if DebugEnabled is true ", function () {
            expect(console.warn).toHaveBeenCalledWith("Stop was called before calling start for event : Perfundefined");
        });
    });
    describe("When we call getPageLoadMetrics", function () {
        var result;
        beforeEach(function () {
            fxpLogger.pageLoadMetric = {
                "sourceRoute": "Home",
                "destinationRoute": "ActOnBehalf",
                "pageTransitionStatus": "viewContentLoaded",
                "stateChangeDuration": 32.23,
                "viewLoadDuration": 31.34,
                "statePageLoadError": "",
                "viewPageLoadError": "",
                "totalDuration": 63.57
            };
            result = fxpLogger.getPageLoadMetrics();
        });
        it("Then it should return PageLoadMetrics ", function () {
            expect(result).toBeDefined();
            expect(result).not.toBeNull();
        });
        it("Then PageLoadMetrics.sourceRoute should have value ", function () {
            expect(result.sourceRoute).toEqual("Home");
        });
        it("Then PageLoadMetrics.destinationRoute should have value ", function () {
            expect(result.destinationRoute).toEqual("ActOnBehalf");
        });
        it("Then PageLoadMetrics.pageTransitionStatus should have value ", function () {
            expect(result.pageTransitionStatus).toEqual("viewContentLoaded");
        });
        it("Then PageLoadMetrics.stateChangeDuration should have value ", function () {
            expect(result.stateChangeDuration).toEqual(32.23);
        });
        it("Then PageLoadMetrics.viewLoadDuration should have value ", function () {
            expect(result.viewLoadDuration).toEqual(31.34);
        });
        it("Then PageLoadMetrics.totalDuration should have value ", function () {
            expect(result.totalDuration).toEqual(63.57);
        });
    });
    describe("When we call getPageLoadMetrics and PageLoadMetrics doesn't have value", function () {
        var result;
        beforeEach(function () {
            fxpLogger.pageLoadMetric = {};
            result = fxpLogger.getPageLoadMetrics();
        });
        it("Then getPageLoadMetrics should return null", function () {
            expect(result).toEqual({});
        });
    });
    describe("When we call logPageLoadMetrics", function () {
        var pageLoad;
        beforeEach(function () {
            pageLoad = {
                "sourceRoute": "Home",
                "destinationRoute": "ActOnBehalf",
                "pageTransitionStatus": "viewContentLoaded",
                "stateChangeDuration": 32.23,
                "viewLoadDuration": 31.34,
                "preViewLoadingDuration": 21.23,
                "pageLoadError": "",
                "pageLoadDuration": 0,
                "totalDuration": 63.57,
                "preStateDuration": 11,
                "pageDisplayName": "Act On Behalf",
                "threshold": {
                    "thresholdCrossed": false,
                    "thresholdValue": 0
                }
            };
            fxpLogger.pageLoadMetric = pageLoad;
            fxpLogger.logPageLoadMetrics(50);
        });
        it("Then it should call log Event of LogginStrategy", function () {
            expect(fxpLogger.loggingStrategy.logEvent).toHaveBeenCalled();
        });
    });
    describe("When we call logError with params", function () {
        var transactionId = "0987654321";
        beforeEach(function () {
            Fxp.Telemetry.TelemetryContext.CurrentContext.getEnvironmentDetails = jasmine.createSpy("getEnvironmentDetails").and.callFake(function () {
                return "abc";
            });
            Fxp.Telemetry.TelemetryContext.CurrentContext.getGlobalPropertyBag = jasmine.createSpy("getGlobalPropertyBag").and.callFake(function () {
                return propbag;
            });
            Fxp.Telemetry.TelemetryContext.CurrentContext.getLoggedInUserRoleGroupInfo = jasmine.createSpy("getLoggedInUserRoleGroupInfo").and.callFake(function () {
                return oboUserInfo;
            });
            Fxp.Telemetry.TelemetryContext.CurrentContext.getOBOUserRoleGroupInfo = jasmine.createSpy("getOBOUserRoleGroupInfo").and.callFake(function () {
                return loggedInUserInfo;
            });
            spyOn(fxpLogger, "getCorrelationId").and.callThrough();
            spyOn(fxpLogger, "buildCommonLogProperties").and.callThrough();
            spyOn(fxpLogger, "addEnvironmentDetails").and.callThrough();
            var propBag1 = {
                propBagInternal: {
                    ServiceLine: "ServiceLine Test",
                    Program: "Program Test",
                    ComponentName: "ComponentName Test"
                }
            };
            fxpLogger.logError("FXP:Tests", "CustomErrorNew", "100002", "stack trace", propbag, metricsbag, transactionId);
        });
        it("Then it should call log Error of LogginStrategy", function () {
            expect(fxpLogger.loggingStrategy.logError).toHaveBeenCalledWith("CustomErrorNew", "100002", "stack trace", fxpLogger.addEnvironmentDetails(propbag, transactionId), metricsbag, "0987654321");
        });
        it("Then it should call getCorrelationId of Log Error", function () {
            expect(fxpLogger.getCorrelationId).toHaveBeenCalledWith("0987654321");
        });
        it("Then it should call buildCommonLogProperties of log Error", function () {
            expect(fxpLogger.buildCommonLogProperties).toHaveBeenCalledWith(propbag, "FXP:Tests", "100002", "stack trace");
        });
        it("Then it should call addEnvironmentDetails log Error", function () {
            expect(fxpLogger.addEnvironmentDetails).toHaveBeenCalledWith(propbag, "0987654321");
        });
    });
    describe("When we call logError without params", function () {
        var properties, tranid;
        beforeEach(function () {
            spyOn(fxpLogger, "getCorrelationId").and.callThrough();
            spyOn(fxpLogger, "buildCommonLogProperties").and.callThrough();
            spyOn(fxpLogger, "addEnvironmentDetails").and.callFake(function (a, b) {
                properties = a;
                tranid = b;
            });
            fxpLogger.logError();
        });
        it("Then it call log Error of LogginStrategy with undefined values ", function () {
            expect(fxpLogger.loggingStrategy.logError).toHaveBeenCalledWith(undefined, undefined, undefined, undefined, undefined, tranid);
        });
        it("Then it should call getCorrelationId of Log Error with undefined value", function () {
            expect(fxpLogger.getCorrelationId).toHaveBeenCalledWith(undefined);
        });
        it("Then it should call buildCommonLogProperties of log Error with undefined values", function () {
            expect(fxpLogger.buildCommonLogProperties).toHaveBeenCalledWith(undefined, undefined, undefined, undefined);
        });
        it("Then it should call addEnvironmentDetails log Error with values set from getCorrelationId,buildCommonLogProperties", function () {
            expect(fxpLogger.addEnvironmentDetails).toHaveBeenCalledWith(properties, tranid);
        });
    });
    describe("When we call logError and it throws exception", function () {
        beforeEach(function () {
            fxpLogger.telemetryConfig.DebugEnabled = true;
            spyOn(fxpLogger, "addEnvironmentDetails").and.callFake(function (a, b) {
                throw "Exception Thrown";
            });
            spyOn(fxpLogger, "internalCustomLog").and.callThrough();
            fxpLogger.logError();
        });
        it("Then it should catch exception and log in console ", function () {
            expect(fxpLogger.internalCustomLog).toHaveBeenCalledWith("Exception Thrown");
        });
    });
    describe("When we call logException with params", function () {
        var transactionId = "0987654321";
        var error = new Error();
        error.message = "From Log Exception";
        error.name = "Exception";
        error.stack = "StackTrace";
        beforeEach(function () {
            spyOn(fxpLogger, "getCorrelationId").and.callThrough();
            spyOn(fxpLogger, "buildCommonLogProperties").and.callThrough();
            spyOn(fxpLogger, "addEnvironmentDetails").and.callThrough();
            fxpLogger.logException("FXP:Tests", error, propbag, metricsbag, transactionId);
        });
        it("Then it should call log exception of LogginStrategy", function () {
            expect(fxpLogger.loggingStrategy.logException).toHaveBeenCalledWith(error, fxpLogger.addEnvironmentDetails(propbag, transactionId), metricsbag, "0987654321");
        });
        it("Then it should call getCorrelationId of log exception", function () {
            expect(fxpLogger.getCorrelationId).toHaveBeenCalledWith("0987654321");
        });
        it("Then it should call buildCommonLogProperties log exception", function () {
            expect(fxpLogger.buildCommonLogProperties).toHaveBeenCalledWith(propbag, "FXP:Tests", null, "StackTrace");
        });
        it("Then it should call addEnvironmentDetails log exception", function () {
            expect(fxpLogger.addEnvironmentDetails).toHaveBeenCalledWith(propbag, "0987654321");
        });
    });
    describe("When we call logException without params", function () {
        beforeEach(function () {
            spyOn(fxpLogger, "internalCustomLog").and.callThrough();
            fxpLogger.logException();
        });
        it("Then it should catch exception when no paramaters are there", function () {
            expect(fxpLogger.internalCustomLog).toHaveBeenCalled();
        });
    });
    describe("When we have getCorrelationId with null transaction id and correlationProvider", function () {
        var result;
        beforeEach(function () {
            fxpLogger.correlationProvider = null;
            result = fxpLogger.getCorrelationId(null);
        });
        it("Then it should set transactionId with guid ", function () {
            expect(result).toBeDefined();
            expect(result).not.toBeNull();
        });
    });
    describe("When we have getCorrelationId with null transactionID and correlationProvider is not null", function () {
        var result;
        beforeEach(function () {
            fxpLogger.correlationProvider = jasmine.createSpyObj("correlationProvider", ["getCorrelationId"]);
            fxpLogger.correlationProvider.getCorrelationId = jasmine.createSpy("getCorrelationId").and.returnValue("12343424");
            result = fxpLogger.getCorrelationId(null);
        });
        it("Then it should set transactionId when we have null transaction id and correlationProvider is not null", function () {
            expect(result).toBeDefined();
            expect(result).toEqual("12343424");
        });
    });
    describe("When we call logWarning with params", function () {
        var transactionId = "0987654321";
        beforeEach(function () {
            spyOn(fxpLogger, "getCorrelationId").and.callThrough();
            spyOn(fxpLogger, "buildCommonLogProperties").and.callThrough();
            spyOn(fxpLogger, "addEnvironmentDetails").and.callThrough();
            fxpLogger.logWarning("FXP:Tests", "CustomErrorNew", propbag, metricsbag, transactionId);
        });
        it("Then it should call log Warning of LogginStrategy", function () {
            expect(fxpLogger.loggingStrategy.logWarning).toHaveBeenCalledWith("CustomErrorNew", fxpLogger.addEnvironmentDetails(propbag, transactionId), metricsbag, "0987654321");
        });
        it("Then it should call getCorrelationId of log Warning", function () {
            expect(fxpLogger.getCorrelationId).toHaveBeenCalledWith("0987654321");
        });
        it("Then it should call buildCommonLogProperties of log Warning", function () {
            expect(fxpLogger.buildCommonLogProperties).toHaveBeenCalledWith(propbag, "FXP:Tests", null, null);
        });
        it("Then it should call addEnvironmentDetails of log Warning", function () {
            expect(fxpLogger.addEnvironmentDetails).toHaveBeenCalledWith(propbag, "0987654321");
        });
    });
    describe("When we call logWarning without params", function () {
        var properties, tranid;
        beforeEach(function () {
            spyOn(fxpLogger, "getCorrelationId").and.callThrough();
            spyOn(fxpLogger, "buildCommonLogProperties").and.callThrough();
            spyOn(fxpLogger, "addEnvironmentDetails").and.callFake(function (a, b) {
                properties = a;
                tranid = b;
            });
            fxpLogger.logWarning();
        });
        it("Then it calls log Warning of LogginStrategy with undefined values ", function () {
            expect(fxpLogger.loggingStrategy.logWarning).toHaveBeenCalledWith(undefined, undefined, undefined, tranid);
        });
        it("Then it should call getCorrelationId of Log Warning with undefined value", function () {
            expect(fxpLogger.getCorrelationId).toHaveBeenCalledWith(undefined);
        });
        it("Then it should call buildCommonLogProperties of log Warning with undefined values", function () {
            expect(fxpLogger.buildCommonLogProperties).toHaveBeenCalledWith(undefined, undefined, null, null);
        });
        it("Then it should call addEnvironmentDetails log Warning with values set from getCorrelationId,buildCommonLogProperties", function () {
            expect(fxpLogger.addEnvironmentDetails).toHaveBeenCalledWith(properties, tranid);
        });
    });
    describe("When we call logWarning and it throws exception", function () {
        beforeEach(function () {
            fxpLogger.telemetryConfig.DebugEnabled = true;
            spyOn(fxpLogger, "addEnvironmentDetails").and.callFake(function (a, b) {
                throw "Exception Thrown";
            });
            spyOn(fxpLogger, "internalCustomLog").and.callThrough();
            fxpLogger.logWarning();
        });
        it("Then it should catch exception and log in console", function () {
            expect(fxpLogger.internalCustomLog).toHaveBeenCalledWith("Exception Thrown");
        });
    });
    describe("When we call logInformation with params", function () {
        var transactionId = "0987654321";
        beforeEach(function () {
            spyOn(fxpLogger, "getCorrelationId").and.callThrough();
            spyOn(fxpLogger, "buildCommonLogProperties").and.callThrough();
            spyOn(fxpLogger, "addEnvironmentDetails").and.callThrough();
            fxpLogger.logInformation("FXP:Tests", "CustomErrorNewInformation", propbag, metricsbag, transactionId);
        });
        it("Then it should call log Information of LogginStrategy", function () {
            expect(fxpLogger.loggingStrategy.logInformation).toHaveBeenCalledWith("CustomErrorNewInformation", fxpLogger.addEnvironmentDetails(propbag, transactionId), metricsbag, "0987654321");
        });
        it("Then it should call getCorrelationId of log Information", function () {
            expect(fxpLogger.getCorrelationId).toHaveBeenCalledWith("0987654321");
        });
        it("Then it should call buildCommonLogProperties of log Information", function () {
            expect(fxpLogger.buildCommonLogProperties).toHaveBeenCalledWith(propbag, "FXP:Tests", null, null);
        });
        it("Then it should call addEnvironmentDetails of log Information", function () {
            expect(fxpLogger.addEnvironmentDetails).toHaveBeenCalledWith(propbag, "0987654321");
        });
    });
    describe("When we call logInformation without params", function () {
        var properties, tranid;
        beforeEach(function () {
            spyOn(fxpLogger, "getCorrelationId").and.callThrough();
            spyOn(fxpLogger, "buildCommonLogProperties").and.callThrough();
            spyOn(fxpLogger, "addEnvironmentDetails").and.callFake(function (a, b) {
                properties = a;
                tranid = b;
            });
            fxpLogger.logInformation();
        });
        it("Then it calls log Information of LogginStrategy with undefined values  ", function () {
            expect(fxpLogger.loggingStrategy.logInformation).toHaveBeenCalledWith(undefined, undefined, undefined, tranid);
        });
        it("Then it should call getCorrelationId of Log Information with undefined value", function () {
            expect(fxpLogger.getCorrelationId).toHaveBeenCalledWith(undefined);
        });
        it("Then it should call buildCommonLogProperties of log Information with undefined values", function () {
            expect(fxpLogger.buildCommonLogProperties).toHaveBeenCalledWith(undefined, undefined, null, null);
        });
        it("Then it should call addEnvironmentDetails log Information with values set from getCorrelationId,buildCommonLogProperties", function () {
            expect(fxpLogger.addEnvironmentDetails).toHaveBeenCalledWith(properties, tranid);
        });
    });
    describe("When we call logInformation and it throws exception", function () {
        beforeEach(function () {
            fxpLogger.telemetryConfig.DebugEnabled = true;
            spyOn(fxpLogger, "addEnvironmentDetails").and.callFake(function (a, b) {
                throw "Exception Thrown";
            });
            spyOn(fxpLogger, "internalCustomLog").and.callThrough();
            fxpLogger.logInformation();
        });
        it("Then it should catch exception and log in console", function () {
            expect(fxpLogger.internalCustomLog).toHaveBeenCalledWith("Exception Thrown");
        });
    });
    describe("When we have logEvent with params", function () {
        var transactionId = "0987654321";
        beforeEach(function () {
            spyOn(fxpLogger, "getCorrelationId").and.callThrough();
            spyOn(fxpLogger, "buildCommonLogProperties").and.callThrough();
            spyOn(fxpLogger, "addEnvironmentDetails").and.callThrough();
            fxpLogger.logEvent("FXP:Tests", "LogEvent", propbag, metricsbag, transactionId);
        });
        it("Then it should call log Event of LogginStrategy", function () {
            expect(fxpLogger.loggingStrategy.logEvent).toHaveBeenCalledWith("LogEvent", fxpLogger.addEnvironmentDetails(propbag, transactionId), metricsbag, "0987654321");
        });
        it("Then it should call getCorrelationId of log Event", function () {
            expect(fxpLogger.getCorrelationId).toHaveBeenCalledWith("0987654321");
        });
        it("Then it should call buildCommonLogProperties log Event", function () {
            expect(fxpLogger.buildCommonLogProperties).toHaveBeenCalledWith(propbag, "FXP:Tests", null, null);
        });
        it("Then it should call addEnvironmentDetails log Event", function () {
            expect(fxpLogger.addEnvironmentDetails).toHaveBeenCalledWith(propbag, "0987654321");
        });
    });
    describe("When we call logEvent without params", function () {
        var properties, tranid;
        beforeEach(function () {
            spyOn(fxpLogger, "getCorrelationId").and.callThrough();
            spyOn(fxpLogger, "buildCommonLogProperties").and.callThrough();
            spyOn(fxpLogger, "addEnvironmentDetails").and.callFake(function (a, b) {
                properties = a;
                tranid = b;
            });
            fxpLogger.logEvent();
        });
        it("Then it calls log Event of LogginStrategy with undefined values  ", function () {
            expect(fxpLogger.loggingStrategy.logEvent).toHaveBeenCalledWith(undefined, undefined, undefined, tranid);
        });
        it("Then it should call getCorrelationId of Log Event with undefined value", function () {
            expect(fxpLogger.getCorrelationId).toHaveBeenCalledWith(undefined);
        });
        it("Then it should call buildCommonLogProperties of log Event with undefined values", function () {
            expect(fxpLogger.buildCommonLogProperties).toHaveBeenCalledWith(undefined, undefined, null, null);
        });
        it("Then it should call addEnvironmentDetails log Event with values set from getCorrelationId,buildCommonLogProperties", function () {
            expect(fxpLogger.addEnvironmentDetails).toHaveBeenCalledWith(properties, tranid);
        });
    });
    describe("When we call logEvent and it throws exception", function () {
        beforeEach(function () {
            fxpLogger.telemetryConfig.DebugEnabled = true;
            spyOn(fxpLogger, "addEnvironmentDetails").and.callFake(function (a, b) {
                throw "Exception Thrown";
            });
            spyOn(fxpLogger, "internalCustomLog").and.callThrough();
            fxpLogger.logEvent();
        });
        it("Then it should catch exception and log in console", function () {
            expect(fxpLogger.internalCustomLog).toHaveBeenCalledWith("Exception Thrown");
        });
    });
    describe("When we call logTrace with params", function () {
        var transactionId = "0987654321";
        beforeEach(function () {
            spyOn(fxpLogger, "getCorrelationId").and.callThrough();
            spyOn(fxpLogger, "buildCommonLogProperties").and.callThrough();
            spyOn(fxpLogger, "addEnvironmentDetails").and.callThrough();
            fxpLogger.logTrace("FXP:Tests", "LogTrace", propbag, transactionId);
        });
        it("Then it should call log Trace of LogginStrategy", function () {
            expect(fxpLogger.loggingStrategy.logTrace).toHaveBeenCalledWith("LogTrace", fxpLogger.addEnvironmentDetails(propbag, transactionId), "0987654321");
        });
        it("Then it should call getCorrelationId of log Trace", function () {
            expect(fxpLogger.getCorrelationId).toHaveBeenCalledWith("0987654321");
        });
        it("Then it should call buildCommonLogProperties of log Trace", function () {
            expect(fxpLogger.buildCommonLogProperties).toHaveBeenCalledWith(propbag, "FXP:Tests", null, null);
        });
        it("Then it should call addEnvironmentDetails log Trace", function () {
            expect(fxpLogger.addEnvironmentDetails).toHaveBeenCalledWith(propbag, "0987654321");
        });
    });
    describe("When we call logTrace without params", function () {
        var properties, tranid;
        beforeEach(function () {
            spyOn(fxpLogger, "getCorrelationId").and.callThrough();
            spyOn(fxpLogger, "buildCommonLogProperties").and.callThrough();
            spyOn(fxpLogger, "addEnvironmentDetails").and.callFake(function (a, b) {
                properties = a;
                tranid = b;
            });
            fxpLogger.logTrace();
        });
        it("Then it calls log Trace of LogginStrategy with undefined values  ", function () {
            expect(fxpLogger.loggingStrategy.logTrace).toHaveBeenCalledWith(undefined, undefined, tranid);
        });
        it("Then it should call getCorrelationId of Log Trace with undefined value", function () {
            expect(fxpLogger.getCorrelationId).toHaveBeenCalledWith(undefined);
        });
        it("Then it should call buildCommonLogProperties of log Trace with undefined values", function () {
            expect(fxpLogger.buildCommonLogProperties).toHaveBeenCalledWith(undefined, undefined, null, null);
        });
        it("Then it should call addEnvironmentDetails log Trace with values set from getCorrelationId,buildCommonLogProperties", function () {
            expect(fxpLogger.addEnvironmentDetails).toHaveBeenCalledWith(properties, tranid);
        });
    });
    describe("When we call logTrace and it throws exception", function () {
        beforeEach(function () {
            fxpLogger.telemetryConfig.DebugEnabled = true;
            spyOn(fxpLogger, "addEnvironmentDetails").and.callFake(function (a, b) {
                throw "Exception Thrown";
            });
            spyOn(fxpLogger, "internalCustomLog").and.callThrough();
            fxpLogger.logTrace();
        });
        it("Then it should catch exception and log in console", function () {
            expect(fxpLogger.internalCustomLog).toHaveBeenCalledWith("Exception Thrown");
        });
    });
    describe("When we call logMetric with params", function () {
        var transactionId = "0987654321";
        beforeEach(function () {
            spyOn(fxpLogger, "getCorrelationId").and.callThrough();
            spyOn(fxpLogger, "buildCommonLogProperties").and.callThrough();
            spyOn(fxpLogger, "addEnvironmentDetails").and.callThrough();
            fxpLogger.logMetric("FXP:Tests", "MetricName", "MetricValue", propbag, transactionId);
        });
        it("Then it should call log Metric of LogginStrategy", function () {
            expect(fxpLogger.loggingStrategy.logMetric).toHaveBeenCalledWith("MetricName", "MetricValue", fxpLogger.addEnvironmentDetails(propbag, transactionId), "0987654321");
        });
        it("Then it should call getCorrelationId of log Metric", function () {
            expect(fxpLogger.getCorrelationId).toHaveBeenCalledWith("0987654321");
        });
        it("Then it should call buildCommonLogProperties of log Metric", function () {
            expect(fxpLogger.buildCommonLogProperties).toHaveBeenCalledWith(propbag, "FXP:Tests", null, null);
        });
        it("Then it should call addEnvironmentDetails of log Metric", function () {
            expect(fxpLogger.addEnvironmentDetails).toHaveBeenCalledWith(propbag, "0987654321");
        });
    });
    describe("When we call logMetric without params", function () {
        var properties, tranid;
        beforeEach(function () {
            spyOn(fxpLogger, "getCorrelationId").and.callThrough();
            spyOn(fxpLogger, "buildCommonLogProperties").and.callThrough();
            spyOn(fxpLogger, "addEnvironmentDetails").and.callFake(function (a, b) {
                properties = a;
                tranid = b;
            });
            fxpLogger.logMetric();
        });
        it("Then it calls log Metric of LogginStrategy with undefined values ", function () {
            expect(fxpLogger.loggingStrategy.logMetric).toHaveBeenCalledWith(undefined, undefined, undefined, tranid);
        });
        it("Then it should call getCorrelationId of Log Metric with undefined value", function () {
            expect(fxpLogger.getCorrelationId).toHaveBeenCalledWith(undefined);
        });
        it("Then it should call buildCommonLogProperties of log Metric with undefined values", function () {
            expect(fxpLogger.buildCommonLogProperties).toHaveBeenCalledWith(undefined, undefined, null, null);
        });
        it("Then it should call addEnvironmentDetails log Metric with values set from getCorrelationId,buildCommonLogProperties", function () {
            expect(fxpLogger.addEnvironmentDetails).toHaveBeenCalledWith(properties, tranid);
        });
    });
    describe("When we call logMetric and it throws exception", function () {
        beforeEach(function () {
            fxpLogger.telemetryConfig.DebugEnabled = true;
            spyOn(fxpLogger, "addEnvironmentDetails").and.callFake(function (a, b) {
                throw "Exception Thrown";
            });
            spyOn(fxpLogger, "internalCustomLog").and.callThrough();
            fxpLogger.logMetric();
        });
        it("Then it should catch exception and log in console", function () {
            expect(fxpLogger.internalCustomLog).toHaveBeenCalledWith("Exception Thrown");
        });
    });
    describe("When we call trackPageView with params", function () {
        var transactionId = "0987654321";
        beforeEach(function () {
            spyOn(fxpLogger, "getCorrelationId").and.callThrough();
            spyOn(fxpLogger, "addEnvironmentDetails").and.callThrough();
            fxpLogger.trackPageView("FxpHome", "fxpdev.azurewebsites.net", propbag, metricsbag, "10", transactionId);
        });
        it("Then it should call trackPageView of LogginStrategy", function () {
            expect(fxpLogger.loggingStrategy.trackPageView).toHaveBeenCalledWith("FxpHome", "fxpdev.azurewebsites.net", fxpLogger.addEnvironmentDetails(propbag, transactionId), metricsbag, "10", "0987654321");
        });
        it("Then it should call getCorrelationId of trackPageView", function () {
            expect(fxpLogger.getCorrelationId).toHaveBeenCalledWith("0987654321");
        });
        it("Then it should call addEnvironmentDetails of trackPageView", function () {
            expect(fxpLogger.addEnvironmentDetails).toHaveBeenCalledWith(propbag, "0987654321");
        });
    });
    describe("When we call trackPageView without params", function () {
        var properties, tranid;
        beforeEach(function () {
            spyOn(fxpLogger, "getCorrelationId").and.callThrough();
            spyOn(fxpLogger, "addEnvironmentDetails").and.callFake(function (a, b) {
                properties = a;
                tranid = b;
            });
            fxpLogger.trackPageView();
        });
        it("Then it calls log TrackPageView of LogginStrategy with undefined values  ", function () {
            expect(fxpLogger.loggingStrategy.trackPageView).toHaveBeenCalledWith(undefined, undefined, undefined, undefined, undefined, tranid);
        });
        it("Then it should call getCorrelationId of Log TrackPageView with undefined value", function () {
            expect(fxpLogger.getCorrelationId).toHaveBeenCalledWith(undefined);
        });
        it("Then it should call addEnvironmentDetails log TrackPageView with values set from getCorrelationId", function () {
            expect(fxpLogger.addEnvironmentDetails).toHaveBeenCalledWith(properties, tranid);
        });
    });
    describe("When we call trackPageView and it throws exception", function () {
        beforeEach(function () {
            fxpLogger.telemetryConfig.DebugEnabled = true;
            spyOn(fxpLogger, "addEnvironmentDetails").and.callFake(function (a, b) {
                throw "Exception Thrown";
            });
            spyOn(fxpLogger, "internalCustomLog").and.callThrough();
            fxpLogger.trackPageView();
        });
        it("Then it should catch exception and log in console", function () {
            expect(fxpLogger.internalCustomLog).toHaveBeenCalledWith("Exception Thrown");
        });
    });
    describe("When we call logFeatureUsageEvent with params", function () {
        var eventData = {
            "EventType": "FeatureEvent",
            "EventName": "Feature",
            "ComponentType": "Executable",
            "Xcv": "xcv"
        };
        beforeEach(function () {
            spyOn(fxpLogger, "buildFeatureEventProperties").and.callThrough();
            spyOn(fxpLogger, "addEnvironmentDetails").and.callThrough();
            spyOn(fxpLogger, "buildCommonLogProperties").and.callThrough();
            fxpLogger.logFeatureUsageEvent("FxpFeature", eventData, propbag, metricsbag);
        });
        it("Then it should call logEvent of LogginStrategy", function () {
            expect(fxpLogger.loggingStrategy.logEvent).toHaveBeenCalledWith("Feature", fxpLogger.buildFeatureEventProperties(eventData, fxpLogger.addEnvironmentDetails(propbag, "xcv")), metricsbag);
        });
        it("Then it should call buildFeatureEventProperties of logEvent", function () {
            expect(fxpLogger.buildFeatureEventProperties).toHaveBeenCalledWith(eventData, fxpLogger.addEnvironmentDetails(propbag, "xcv"));
        });
        it("Then it should call addEnvironmentDetails of logEvent", function () {
            expect(fxpLogger.addEnvironmentDetails).toHaveBeenCalledWith(propbag, "xcv");
        });
        it("Then it should call buildCommonLogProperties of logEvent", function () {
            expect(fxpLogger.buildCommonLogProperties).toHaveBeenCalledWith(propbag, "FxpFeature", null, null);
        });
    });
    describe("When we call logFeatureUsageEvent without params", function () {
        beforeEach(function () {
            spyOn(fxpLogger, "internalCustomLog").and.callThrough();
            fxpLogger.logFeatureUsageEvent();
        });
        it("Then it should catch exception when no paramaters are there", function () {
            expect(fxpLogger.internalCustomLog).toHaveBeenCalled();
        });
    });
    describe("When we call logBusinessProcessEvent with params", function () {
        var eventData = {
            "EventType": "BusinessProcessEvent",
            "BusinessProcessName": "BusinessProcess",
            "ComponentType": "WebService",
            "Xcv": "xcv"
        };
        beforeEach(function () {
            spyOn(fxpLogger, "buildBusinessEventProperties").and.callThrough();
            spyOn(fxpLogger, "addEnvironmentDetails").and.callThrough();
            spyOn(fxpLogger, "buildCommonLogProperties").and.callThrough();
            fxpLogger.logBusinessProcessEvent("FxpBusiness", eventData, propbag, metricsbag);
        });
        it("Then it should call logEvent of LogginStrategy", function () {
            expect(fxpLogger.loggingStrategy.logEvent).toHaveBeenCalledWith("BusinessProcess", fxpLogger.buildBusinessEventProperties(eventData, fxpLogger.addEnvironmentDetails(propbag, "xcv")), metricsbag);
        });
        it("Then it should call buildBusinessEventProperties of logEvent", function () {
            expect(fxpLogger.buildBusinessEventProperties).toHaveBeenCalledWith(eventData, fxpLogger.addEnvironmentDetails(propbag, "xcv"));
        });
        it("Then it should call addEnvironmentDetails of logEvent", function () {
            expect(fxpLogger.addEnvironmentDetails).toHaveBeenCalledWith(propbag, "xcv");
        });
        it("Then it should call buildCommonLogProperties of logEvent", function () {
            expect(fxpLogger.buildCommonLogProperties).toHaveBeenCalledWith(propbag, "FxpBusiness", null, null);
        });
    });
    describe("When we call logBusinessProcessEvent without params", function () {
        beforeEach(function () {
            spyOn(fxpLogger, "internalCustomLog").and.callThrough();
            fxpLogger.logBusinessProcessEvent();
        });
        it("Then it should catch exception when no paramaters are there", function () {
            expect(fxpLogger.internalCustomLog).toHaveBeenCalled();
        });
    });
    describe("When we call startTrackPerformance and there is no events", function () {
        beforeEach(function () {
            fxpLogger._events["PerfFXP"] = null;
            fxpLogger.startTrackPerformance("FXP");
            var event = fxpLogger._events["PerfFXP"];
        });
        it("Then it should check if startTrackEvent is getting called with events getting initalized", function () {
            expect(fxpLogger.loggingStrategy.startTrackEvent).toHaveBeenCalledWith("PerfFXP");
            expect(fxpLogger._events["PerfFXP"]).toBeDefined();
        });
    });
    describe("When we call startTrackPerformance and there is events ", function () {
        beforeEach(function () {
            fxpLogger._events["PerfFXP"] = "FXP";
            fxpLogger.telemetryConfig.DebugEnabled = true;
            spyOn(console, "warn").and.callThrough();
            fxpLogger.startTrackPerformance("FXP");
        });
        it("Then it should log warning in console", function () {
            expect(console.warn).toHaveBeenCalledWith("Start was called before calling stop for event : PerfFXP");
        });
    });
    describe("When we call startTrackPerformance and it throws exception", function () {
        beforeEach(function () {
            fxpLogger.telemetryConfig.DebugEnabled = true;
            fxpLogger.loggingStrategy.startTrackEvent = jasmine.createSpy("startTrackEvent").and.callFake(function () {
                throw "Exception Thrown";
            });
            spyOn(fxpLogger, "internalCustomLog").and.callThrough();
            fxpLogger.startTrackPerformance();
        });
        it("Then it should catch exception and log in console", function () {
            expect(fxpLogger.internalCustomLog).toHaveBeenCalledWith("Exception Thrown");
        });
    });
    describe("When we call stopTrackPerformance and events is number", function () {
        beforeEach(function () {
            fxpLogger._events['PerfFXP'] = 500;
            spyOn(fxpLogger, "addEnvironmentDetails").and.callThrough();
            fxpLogger.stopTrackPerformance("FXP", "Source", propbag, metricsbag, "1212121");
        });
        it("Then it should stopTrackPerformance ", function () {
            expect(fxpLogger.loggingStrategy.stopTrackEvent).toHaveBeenCalledWith("PerfFXP", fxpLogger.addEnvironmentDetails(propbag, "1212121"), metricsbag, "1212121");
        });
        it("Then it should check if addEnvironmentDetails is getting called of  stopTrackPerformance ", function () {
            expect(fxpLogger.addEnvironmentDetails).toHaveBeenCalledWith(propbag, "1212121");
        });
    });
    describe("When we call stopTrackPerformance and it throws exception", function () {
        beforeEach(function () {
            fxpLogger._events['PerfFXP'] = 500;
            spyOn(fxpLogger, "addEnvironmentDetails").and.callFake(function (a, b) {
                throw "Exception Thrown";
            });
            spyOn(fxpLogger, "internalCustomLog").and.callThrough();
            fxpLogger.stopTrackPerformance("FXP", "Source", propbag, metricsbag, "1212121");
        });
        it("Then it should catch exception and log in console", function () {
            expect(fxpLogger.internalCustomLog).toHaveBeenCalledWith("Exception Thrown");
        });
    });
    describe("When we setCorrelationProvider and CorrelationProvider is passed", function () {
        var CorrelationProvider;
        beforeEach(function () {
            CorrelationProvider = jasmine.createSpyObj("ICorrelationProvider", ["getCorrelationId"]);
            fxpLogger.setCorrelationProvider(CorrelationProvider);
        });
        it("Then it should setCorrelationProvider", function () {
            expect(fxpLogger.correlationProvider).toBeDefined();
            expect(fxpLogger.correlationProvider).toEqual(CorrelationProvider);
        });
    });
    describe("When we setCorrelationProvider with null parameters", function () {
        beforeEach(function () {
            fxpLogger.setCorrelationProvider(null);
        });
        it("Then it should not setCorrelationProvider due to null parameters", function () {
            expect(fxpLogger.correlationProvider).toBeNull();
        });
    });
    describe("When we buildCommonLogProperties", function () {
        var result;
        beforeEach(function () {
            result = fxpLogger.buildCommonLogProperties(propbag, "FXP:TestBuild", "10002", "trace");
        });
        it("Then it should check if result is defined with properties", function () {
            expect(result.addRange).toBeDefined();
            expect(result.addToBag).toBeDefined();
            expect(result.getItems).toBeDefined();
        });
        it("Then it should check if Bag has the value when addToBag of propertyBag is called", function () {
            expect(propBagInternal["Source"]).toEqual("FXP:TestBuild");
            expect(propBagInternal["ErrorCode"]).toEqual("10002");
        });
    });
    describe("When we buildCommonLogProperties is called with null parameters", function () {
        var result;
        beforeEach(function () {
            fxpLogger.buildCommonLogProperties(null, null, null, null);
        });
        it("Then it will return a propertybag with null values", function () {
            expect(propBagInternal.Source).toBeNull();
        });
    });
    describe("When we setLoggedInUserContext ", function () {
        var result;
        beforeEach(function () {
            fxpLogger.setLoggedInUserContext(1, "Delivery Manager", false, "1", "TestTenant");
        });
        it("Then it will return a loggedInUserContext RoleGroupId", function () {
            expect(fxpLogger.loggedInUserContext.RoleGroupId).toEqual("1");
        });
        it("Then it will return a loggedInUserContext RoleGroupName", function () {
            expect(fxpLogger.loggedInUserContext.RoleGroupName).toEqual("Delivery Manager");
        });
        it("Then it will return a loggedInUserContext TenantKey", function () {
            expect(fxpLogger.loggedInUserContext.TenantKey).toEqual("1");
        });
        it("Then it will return a loggedInUserContext TenantName", function () {
            expect(fxpLogger.loggedInUserContext.TenantName).toEqual("TestTenant");
        });
    });
    describe("When we setOBOUserContext ", function () {
        var result;
        beforeEach(function () {
            fxpLogger.setOBOUserContext(5, "Non Service User", true, "1", "TestTenant");
        });
        it("Then it will return a loggedInUserContext RoleGroupId", function () {
            expect(fxpLogger.OBOUserContext.RoleGroupId).toEqual("5");
        });
        it("Then it will return a loggedInUserContext RoleGroupName", function () {
            expect(fxpLogger.OBOUserContext.RoleGroupName).toEqual("Non Service User");
        });
        it("Then it will return a loggedInUserContext TenantKey", function () {
            expect(fxpLogger.OBOUserContext.TenantKey).toEqual("1");
        });
        it("Then it will return a loggedInUserContext TenantName", function () {
            expect(fxpLogger.OBOUserContext.TenantName).toEqual("TestTenant");
        });
    });
    describe("When we addUserRoleGroupDetails is called with Obo User and Logged In User Details ", function () {
        var result;
        beforeEach(function () {
            fxpLogger.setLoggedInUserContext(1, "Delivery Manager", false, "1", "TestTenant");
            fxpLogger.setOBOUserContext(5, "Non Service User", true, "1", "TestTenant");
            fxpLogger.addUserRoleGroupDetails(propbag);
            fxpLogger.addUserTenantDetails(propbag);
        });
        it("Then it will return a LoggedInUserRoleGroupId", function () {
            expect(propBagInternal.LoggedInUserRoleGroupId).toEqual("1");
        });
        it("Then it will return a LoggedInUserRoleGroupName", function () {
            expect(propBagInternal.LoggedInUserRoleGroupName).toEqual("Delivery Manager");
        });
        it("Then it will return a TenantKey", function () {
            expect(propBagInternal.LoggedInUserTenantKey).toEqual("1");
        });
        it("Then it will return a TenantName", function () {
            expect(propBagInternal.LoggedInUserTenantName).toEqual("TestTenant");
        });
        it("Then it will return a OBORoleGroupId", function () {
            expect(propBagInternal.OBOUserRoleGroupId).toEqual("5");
        });
        it("Then it will return a OBORoleGroupName", function () {
            expect(propBagInternal.OBOUserRoleGroupName).toEqual("Non Service User");
        });
        it("Then it will return a TenantKey", function () {
            expect(propBagInternal.OBOUserTenantKey).toEqual("1");
        });
        it("Then it will return a TenantName", function () {
            expect(propBagInternal.OBOUserTenantName).toEqual("TestTenant");
        });
    });
    describe("When we call getDefaultPropertyBagValues ", function () {
        var result;
        beforeEach(function () {
            propbag.addToBag("TestError", "Error");
            result = fxpLogger.getDefaultPropertyBagValues(propbag);
        });
        it("Then it should call logGlobalAppInsightException of Global Exception", function () {
            expect(result).not.toBeNull();
            expect(result).toBeDefined();
        });
    });

});
