/// <chutzpah_reference path="../testlink.js" />
import{FxpOnlineLoggingStrategy}from '../js/telemetry/FxpOnlineLoggingStrategy';
declare var angular:any;
describe("Given FxpOnlineLoggingStrategy Suite", () => {
    var val1, val2, val3, val4, val5, val6, val7, val8, telemetryConfig, fxpOnlineLoggingStrategy, fxpTelemetryContext;
    var appInsights;

    var propBag = jasmine.createSpyObj("LogPropertyBag", ["addToBag", "getItems"])

    var metricBag = jasmine.createSpyObj("LogMetricBag", ["addToBag", "getItems"])

    beforeEach(angular.mock.module('FxPApp'));
    beforeEach(angular.mock.module('Telemetry'));
    beforeEach(function () {
        angular.mock.module(function ($provide) {
            $provide.service("TelemetryConfiguration", function () {
                this.DiagnosticLevel = 4;
                this.EventEnabled = true;
                this.PerformanceMetricEnabled = true;
                this.PerfMarkersEnabled = false;
                this.InstrumentationKey = '05f8sd6c0-c4c1-476d-9cd7-5ed08bcsdf4c';
                this.DebugEnabled = false;
            });

            $provide.service("FxpTelemetryContext", function () {
                this.addContextChangeListener = jasmine.createSpy("addContextChangeListener").and.callFake(function (a) {
                });
                this.getUserRole = jasmine.createSpy("getUserRole").and.callFake(function () {
                    return "RM";
                });
                this.getUserID = jasmine.createSpy("getUserID").and.callFake(function () {
                    return "1001";
                });
                this.getSessionID = jasmine.createSpy("getSessionID").and.callFake(function () {
                    return "1545454";
                });
                this.getAppVersion = jasmine.createSpy("getAppVersion").and.callFake(function () {
                    return "1";
                });
                this.getGeography = jasmine.createSpy("getGeography").and.callFake(function () {
                    return "India";
                });
            });

            $provide.service("Microsoft.ApplicationInsights.AppInsights", function () {
                var IConfig = jasmine.createSpyObj("IConfig", ["instrumentationKey", "endpointUrl"]);
                var properties = jasmine.createSpyObj("Users", ["accountId", "id", "ver", "ip"]);
                var telContext = jasmine.createSpyObj("TelemetryContext", ["operation", "user", "session", "application", "location"]);

                this.config = IConfig;
                telContext.operation = properties.id;
                telContext.user = properties;
                telContext.session = properties;
                telContext.application = properties;
                telContext.location = properties;
                telContext.addTelemetryInitializer = jasmine.createSpy("addTelemetryInitializer").and.callFake(function (a, b, c, d) {
                    val1 = a;
                });
                this.context = telContext;

                this.trackException = jasmine.createSpy("trackException").and.callFake(function (a, b, c, d) {
                    val1 = a;
                });
                this.trackEvent = jasmine.createSpy("trackEvent").and.callFake(function (a, b, c, d) {
                    val2 = a;
                });
                this.trackTrace = jasmine.createSpy("trackTrace").and.callFake(function (a, b) {
                    val3 = a;
                });
                this.trackPageView = jasmine.createSpy("trackPageView").and.callFake(function (a, b, c, d) {
                    val4 = a;
                });
                this.trackMetric = jasmine.createSpy("trackMetric").and.callFake(function (a, b, c, d) {
                    val5 = a;
                });
                this.setAuthenticatedUserContext = jasmine.createSpy("setAuthenticatedUserContext").and.callFake(function (a, b) {
                    val6 = a;
                });
                this.startTrackEvent = jasmine.createSpy("startTrackEvent").and.callFake(function (a) {
                    val7 = a;
                });
                this.stopTrackEvent = jasmine.createSpy("stopTrackEvent").and.callFake(function (a, b, c, d) {
                    val8 = a;
                });
            });
        });
    });

    beforeEach(angular.mock.inject(function (TelemetryConfiguration, $injector, FxpTelemetryContext, _FxpOnlineLoggingStrategy_) {
        telemetryConfig = TelemetryConfiguration;
        appInsights = $injector.get('Microsoft.ApplicationInsights.AppInsights');
        fxpTelemetryContext = FxpTelemetryContext;
        fxpOnlineLoggingStrategy = _FxpOnlineLoggingStrategy_;
    }));

    describe("When we have trackException and transactionId of Log Exception", () => {
        var exception = { "stack": "Exception" };
        var transactionId = "123445";
        beforeEach(function () {
            fxpOnlineLoggingStrategy.logException(exception, propBag, metricBag, transactionId);
        });
        it("Then it should invoke trackException of Appinsights", () => {
            expect(fxpOnlineLoggingStrategy.appInsights.trackException).toHaveBeenCalledWith(exception, "Exception", undefined, undefined);
        });

        it("Then it should check whether Appinsights operation.id is getting set or not", () => {
            expect(fxpOnlineLoggingStrategy.appInsights.context.operation.id).toEqual("123445");
        });
    });
    describe("When we have null transactionId of Log Exception", () => {
        var exception = { "stack": "Exception" };
        var transactionId = null;
        beforeEach(function () {
            fxpOnlineLoggingStrategy.logException(exception, propBag, metricBag, transactionId);
        });
        it("Then it should check Appinsights operation.id is set to null", () => {
            fxpOnlineLoggingStrategy.logException(exception, propBag, metricBag, transactionId);
            expect(fxpOnlineLoggingStrategy.appInsights.context.operation.id).toEqual("");
        });
    });
    describe("When we have Log Error", () => {
        var transactionId = "564781";
        var error = new Error();
        error.message = "Error";
        error.stack = "123";
        beforeEach(function () {
            spyOn(fxpOnlineLoggingStrategy, "logException");
            fxpOnlineLoggingStrategy.logError("Error", "123", "StackTrace", propBag, metricBag, transactionId);
        });
        it("Then it should invoke LogException of FxpOnlineLogginStrategy", () => {
            expect(fxpOnlineLoggingStrategy.logException).toHaveBeenCalledWith(error, propBag, metricBag, transactionId);
        });
    });
    describe("When we have trackException and transactionId of Log Warning", () => {
        var transactionId = "123445";
        beforeEach(function () {
            fxpOnlineLoggingStrategy.logWarning("Warning", propBag, metricBag, transactionId);
        })
        it("Then it should invoke trackException of Appinsights", () => {
            expect(fxpOnlineLoggingStrategy.appInsights.trackEvent).toHaveBeenCalledWith("Warning", undefined, undefined);
        });
        it("Then it should check whether Appinsights operation.id is getting set or not", () => {
            expect(fxpOnlineLoggingStrategy.appInsights.context.operation.id).toEqual("123445");
        });
    });
    describe("When we have null transactionId Log Warning", () => {
        var transactionId = null, isInvoked = false;
        beforeEach(function () {
            fxpOnlineLoggingStrategy.logWarning("Warning", propBag, metricBag, transactionId);
        })
        it("Then it should check Appinsights operation.id is set to null", () => {
            expect(fxpOnlineLoggingStrategy.appInsights.context.operation.id).toEqual("");
        });
    });
    describe("When we have trackException and transactionId of Log Information", () => {
        var transactionId = "123445";
        beforeEach(function () {
            fxpOnlineLoggingStrategy.logInformation("Information", propBag, metricBag, transactionId);
        });
        it("Then it should invoke trackEvent of Appinsights", () => {
            expect(fxpOnlineLoggingStrategy.appInsights.trackEvent).toHaveBeenCalledWith("Information", undefined, undefined);
        });
        it("Then it should check operation.id Appinsights is getting set", () => {
            expect(fxpOnlineLoggingStrategy.appInsights.context.operation.id).toEqual("123445");
        });
    });
    describe("When we have null transactionId Log Information", () => {
        var transactionId = null, isInvoked = false;
        beforeEach(function () {
            fxpOnlineLoggingStrategy.logInformation("Information3", propBag, metricBag, transactionId);
        });
        it("Then it should check operation.id Appinsights is getting set is null", () => {
            expect(fxpOnlineLoggingStrategy.appInsights.context.operation.id).toEqual("");
        });
    });
    describe("When we have trackException and transactionId of Log Event", () => {
        var transactionId = "123445";
        beforeEach(function () {
            fxpOnlineLoggingStrategy.logEvent("Event1", propBag, metricBag, transactionId);
        });
        it("Then it should invoke trackEvent of Appinsights", () => {
            expect(fxpOnlineLoggingStrategy.appInsights.trackEvent).toHaveBeenCalledWith("Event1", undefined, undefined);
        });
        it("Then it should check operation.id Appinsights is getting set", () => {
            expect(fxpOnlineLoggingStrategy.appInsights.context.operation.id).toEqual("123445");
        });
    });
    describe("When we have null transactionId Log Event", () => {
        var transactionId = null;
        beforeEach(function () {
            fxpOnlineLoggingStrategy.logEvent("Event3", propBag, metricBag, transactionId);
        });
        it("Then it should check operation.id Appinsights is getting set is null", () => {
            expect(fxpOnlineLoggingStrategy.appInsights.context.operation.id).toEqual("");
        });
    });
    describe("When we have trackException and transactionId of Log Trace", () => {
        var transactionId = "123445";
        beforeEach(function () {
            fxpOnlineLoggingStrategy.logTrace("trace1", propBag, transactionId);
        });
        xit("Then it should invoke trackTrace of Appinsights", () => {
            expect(fxpOnlineLoggingStrategy.appInsights.trackTrace).toHaveBeenCalledWith("trace1", undefined);
        });
        it("Then it should check operation.id Appinsights is getting set", () => {
            expect(fxpOnlineLoggingStrategy.appInsights.context.operation.id).toEqual("123445");
        });
    });
    describe("When we have null transactionId Log Trace", () => {
        var transactionId = null;
        beforeEach(function () {
            fxpOnlineLoggingStrategy.logTrace("trace3", propBag, transactionId);
        });
        it("Then it should check operation.id Appinsights is getting set is null", () => {
            expect(fxpOnlineLoggingStrategy.appInsights.context.operation.id).toEqual("");
        });
    });
    describe("When we have trackException and transactionId of Track PageView", () => {
        var transactionId = "123445";
        beforeEach(function () {
            fxpOnlineLoggingStrategy.trackPageView("Home", "fxpDev", propBag, metricBag, "10", transactionId);
        });
        it("Then it should invoke trackPageView of Appinsights", () => {
            expect(fxpOnlineLoggingStrategy.appInsights.trackPageView).toHaveBeenCalled();
        });
        it("Then it should check operation.id Appinsights is getting set", () => {
            expect(fxpOnlineLoggingStrategy.appInsights.context.operation.id).toEqual("123445");
        });
    });
    describe("When we have null transactionId Track PageView", () => {
        var transactionId = null;
        beforeEach(function () {
            fxpOnlineLoggingStrategy.trackPageView("Contact", "fxpDev", propBag, metricBag, "10", transactionId);
        });
        it("Then it should check operation.id Appinsights is getting set is null", () => {
            var transactionId = null;
            fxpOnlineLoggingStrategy.trackPageView("Contact", "fxpDev", propBag, metricBag, "10", transactionId);
            expect(fxpOnlineLoggingStrategy.appInsights.context.operation.id).toEqual("");
            expect(fxpOnlineLoggingStrategy.appInsights.trackPageView).toHaveBeenCalledWith("Contact", "fxpDev", undefined, undefined, "10");
            expect(val4).toEqual("Contact");
        });
    });
    describe("When we have trackException and transactionId of Log Metric", () => {
        var transactionId = "123445";
        beforeEach(function () {
            fxpOnlineLoggingStrategy.logMetric("Metric1", "Metric2", propBag, transactionId);
        });
        it("Then it should invoke logMetric of Appinsights", () => {
            expect(fxpOnlineLoggingStrategy.appInsights.trackMetric).toHaveBeenCalledWith("Metric1", "Metric2", 0, 0, 0, undefined);
        });
        it("Then it should check operation.id Appinsights is getting set", () => {
            expect(fxpOnlineLoggingStrategy.appInsights.context.operation.id).toEqual("123445");
        });
    });
    describe("When we have null transactionId Log Metric", () => {
        var transactionId = null;
        beforeEach(function () {
            fxpOnlineLoggingStrategy.logMetric("Metric5", "Metric2", propBag, transactionId);
        });
        it("Then it should check operation.id Appinsights is getting set is null", () => {
            var transactionId = null;
            fxpOnlineLoggingStrategy.logMetric("Metric5", "Metric2", propBag, transactionId);
            expect(fxpOnlineLoggingStrategy.appInsights.context.operation.id).toEqual("");
            expect(fxpOnlineLoggingStrategy.appInsights.trackMetric).toHaveBeenCalledWith("Metric5", "Metric2", 0, 0, 0, undefined);
            expect(val5).toEqual("Metric5");
        });
    });
    describe("When we have Start Track Event", () => {
        var transactionId = "123445";
        beforeEach(function () {
            fxpOnlineLoggingStrategy.startTrackEvent("FXP");
        });
        it("Then it should invoke startTrackEvent of Appinsights", function () {
            expect(fxpOnlineLoggingStrategy.appInsights.startTrackEvent).toHaveBeenCalledWith("FXP");
        });
    });
    describe("When we have trackException and transactionId of Stop Track Event", () => {
        var transactionId = "123445";
        beforeEach(function () {
            fxpOnlineLoggingStrategy.stopTrackEvent("FXPStop", propBag, metricBag, transactionId);
        });
        it("Then it should invoke stopTrackEvent of Appinsights", function () {
            expect(fxpOnlineLoggingStrategy.appInsights.stopTrackEvent).toHaveBeenCalledWith("FXPStop", undefined, undefined);
        });
        it("Then it should check operation.id Appinsights is getting set", function () {
            expect(fxpOnlineLoggingStrategy.appInsights.context.operation.id).toEqual("123445");
        });
    });
    describe("When we have null transactionId Stop Track Event", () => {
        var transactionId = null;
        beforeEach(function () {
            fxpOnlineLoggingStrategy.stopTrackEvent("FXPStop2", propBag, metricBag, transactionId);
        });
        it("Then it should check operation.id Appinsights is getting set is null", function () {
            expect(fxpOnlineLoggingStrategy.appInsights.context.operation.id).toEqual("");
        });
    });
    describe("When we have notify", () => {
        beforeEach(function () {
            spyOn(fxpOnlineLoggingStrategy, "setContextInfo");
            fxpOnlineLoggingStrategy.notify();
        });
        it("Then it should call setContextInfo ", () => {
            expect(fxpOnlineLoggingStrategy.setContextInfo).toHaveBeenCalled();
        });
    });
    describe("When we have notify and userID is not null", () => {
        beforeEach(function () {
            fxpOnlineLoggingStrategy.notify();
        });
        it("Then it calls useriD", () => {
            expect(fxpOnlineLoggingStrategy.context.getUserID).toHaveBeenCalled();
        });
        it("Then it should call setAuthenticatedUserContext ", () => {
            expect(fxpOnlineLoggingStrategy.appInsights.setAuthenticatedUserContext).toHaveBeenCalledWith("1001", "RM");
        });
        it("Then it call getSessionID and set appInsights accountID", () => {
            expect(fxpOnlineLoggingStrategy.context.getSessionID).toHaveBeenCalled();
            expect(fxpOnlineLoggingStrategy.appInsights.context.session.id).toEqual("1545454");
        });
        it("Then it call getAppVersion and appInsights version", () => {
            expect(fxpOnlineLoggingStrategy.context.getAppVersion).toHaveBeenCalled();
            expect(fxpOnlineLoggingStrategy.appInsights.context.application.ver).toEqual("1");
        });
        it("Then it call getGeography and set appInsights ip ", () => {
            expect(fxpOnlineLoggingStrategy.context.getGeography).toHaveBeenCalled();
            expect(fxpOnlineLoggingStrategy.appInsights.context.location.ip).toEqual("India");
        });
    });
    describe("When we have notify and userID is null and setAuthenticatedUserContext is not called ", () => {
        beforeEach(function () {
            fxpTelemetryContext.getUserID = jasmine.createSpy("getUserID").and.returnValue(null);
            fxpOnlineLoggingStrategy.notify();
        });
        it("Then it calls useriD", () => {
            expect(fxpOnlineLoggingStrategy.context.getUserID).toHaveBeenCalled();
        });
    });
});