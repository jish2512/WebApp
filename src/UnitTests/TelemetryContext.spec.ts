import {TelemetryContext} from '../js/telemetry/telemetrycontext';
import { FxpLogHelper } from '../js/telemetry/FxpLogHelper';
declare var angular:any;
describe("Given Telemetry Context Suite", function () {
    var telemetryContext, mockFxpUtils;
    var LogPropertyBag = jasmine.createSpyObj("LogPropertyBag", ["addToBag", "getItems", "addRange", "removeFromBag"]);
    beforeEach(angular.mock.module('FxPApp'));
    beforeEach(angular.mock.module('Telemetry'));
    beforeEach(function () {
        angular.mock.module(function ($provide) {
            $provide.value('FxpUtils', mockFxpUtils);
        });
    });
    beforeEach(angular.mock.inject(function (_FxpTelemetryContext_) {
        telemetryContext = _FxpTelemetryContext_;
        telemetryContext._globalPropertyBag = LogPropertyBag;
    }));
    describe("When notifyContextChangeListeners is called", function () {
        var fxpOnlineLoggingStrategy = jasmine.createSpyObj("fxpOnlineLoggingStrategy", ["notify"]);
        beforeEach(function () {
            fxpOnlineLoggingStrategy.notify = jasmine.createSpy("notify").and.callFake(function () {
                console.log("I am from fxpOnlineLoggingStrategy.notify")
            });
            telemetryContext.contextChangeListeners.push(fxpOnlineLoggingStrategy);
            spyOn(console, "log").and.callThrough();
            telemetryContext.notifyContextChangeListeners();
        })
      
        it("Then it should check notify of fxpOnlineLoggingStrategy is called ", function () {
            expect(console.log).toHaveBeenCalledWith("I am from fxpOnlineLoggingStrategy.notify");
        });
    });
    describe("When we call set and get of UserID ", function () {
        var userid = "1001";
        var res
        beforeEach(function () {
            telemetryContext.setUserID(userid);
            res = telemetryContext.getUserID();

        });
        it("Then it should set userid", function () {
            expect(telemetryContext._userId).toEqual("1001");
        });
        it("Then it should get userid", function () {
            expect(res).toEqual("1001");
        });
    });
    describe("When UserId is set as null ", function () {
        it("Then it should throw exception for userid when null parameter is passed", function () {
            try {
                telemetryContext.setUserID(null);
            }
            catch (e) {
                expect(e.message).toEqual("User Id is required");
            }
        });
    });
    describe("When we have AppContext,AppName and AppVersion", function () {
        var appName = "FXP";
        var appVersion = "1.0";
        var res, res1;
        beforeEach(function () {
            spyOn(telemetryContext, "notifyContextChangeListeners");
            telemetryContext.setAppContext(appName, appVersion);
            res = telemetryContext.getAppName();
            res1 = telemetryContext.getAppVersion();
        })
        it("Then it should check if appName and appVersion is set", function () {
            expect(telemetryContext._appName).toEqual("FXP");
            expect(telemetryContext._appVersion).toEqual("1.0");
        });
        it("Then it should check if notifyContextChangeListeners is getting called", () => {
            expect(telemetryContext.notifyContextChangeListeners).toHaveBeenCalled();
        });
        it("Then it should get AppName", function () {
            expect(res).toEqual("FXP");
        });
        it("Then it should get AppVersion", function () {
            expect(res1).toEqual("1.0");
        });
    });
    describe("When we pass AppName as null", function () {
        it("Then it should throw exception for AppContext when application name is null", function () {
            try {
                telemetryContext.setAppContext(null, "1.0");
            }
            catch (e) {
                expect(e.message).toEqual("Application Name is required");
            }
        });
    });
    describe("When we pass appVersion as null", function () {
        it("Then it should throw exception for AppContext when application version is null", function () {
            try {
                telemetryContext.setAppContext("FXP", null);
            }
            catch (e) {
                expect(e.message).toEqual("Application Version is required");
            }
        });
    });
    describe("When we have set,get userRole scenarios", function () {
        var userRole = "TAM";
        var res
        beforeEach(function () {
            spyOn(telemetryContext, "notifyContextChangeListeners");
            telemetryContext.setUserRole(userRole);
            res = telemetryContext.getUserRole();
        })
        it("Then it should set userrole", function () {
            expect(telemetryContext._userRole).toEqual("TAM");
        });
        it("Then it should check if notifyContextChangeListeners is getting called", () => {
            expect(telemetryContext.notifyContextChangeListeners).toHaveBeenCalled();
        });
        it("Then it should get userrole", function () {
            expect(res).toEqual("TAM");
        });
    });
    describe("When we set userRole as null", function () {
        it("Then it should throw exception for userrole when null parameter is passed", function () {
            try {
                telemetryContext.setUserRole(null);
            }
            catch (e) {
                expect(e.message).toEqual("User Role is required");
            }
        });
    });
    describe("When we have get, set sessionid scenarios", function () {
        var sessionID = "1192929";
        var res;
        beforeEach(function () {
            telemetryContext.setSessionID(sessionID);
            res = telemetryContext.getSessionID();
        });
        it("Then it should set sessionid", function () {
            expect(telemetryContext._sessionId).toEqual("1192929");
        });
        it("Then it should get sessionid", function () {
            expect(res).toEqual("1192929");
        });
    });
    describe("When we have set new User Session scenarios", function () {
        var userId = "1111";
        var sessionID = "12345";
        var res;
        beforeEach(function () {
            res = telemetryContext.setNewUserSession(userId, sessionID);
        })
        it("Then it should set userID ", function () {
            expect(telemetryContext._userId).toEqual("1111");
        });
        it("Then it should get, set sessionId ", function () {
            expect(telemetryContext._sessionId).toEqual("12345");
            expect(res).toEqual("12345");
        });
    });
    describe("When we have set new User Session scenario with no sessionID", function () {
        it("Then it should set new User Session ", function () {
            var res = telemetryContext.setNewUserSession("1113", null);
            var sessionid= telemetryContext.getSessionID();
            expect(res).toEqual(sessionid);
        });
    });
    describe("When we try to set new User Session and no userID is passed", function () {
        it("Then it should throw exception for User Session when userId is null", function () {
            try {
                var userId = null;
                var res = telemetryContext.setNewUserSession(userId, null);
            }
            catch (e) {
                expect(e.message).toEqual("UserInfo is required");
            }
        });
    });
    describe("When we try to set null sessionID", function () {
        it("Then it should set null sessionid", function () {
            try {
                telemetryContext.setSessionID(null);
            }
            catch (e) {
                expect(e.message).toEqual("Session Id is required");
            }
        });
    });
    describe("When we have set ,get geography scenarios", function () {
        var geo = "India";
        var res;
        beforeEach(function () {
            spyOn(telemetryContext, "notifyContextChangeListeners");
            telemetryContext.setGeography(geo);
            res = telemetryContext.getGeography();
        });
        it("Then it should set geography", function () {
            expect(telemetryContext._geography).toEqual("India");
            expect(telemetryContext.notifyContextChangeListeners).toHaveBeenCalled();
        });
        it("Then it should check if notifyContextChangeListeners is getting called", () => {
            expect(telemetryContext.notifyContextChangeListeners).toHaveBeenCalled();
        });
        it("Then it should get geography", function () {
            expect(res).toEqual("India");
        });
    });
    describe("When we set null for geography", function () {
        it("Then it should throw exception for geography when null parameter is passed", function () {
            try {
                telemetryContext.setGeography(null);
            }
            catch (e) {
                expect(e.message).toEqual("Geography is required");
            }
        });
    });
    describe("When we have set, get environment scenarios", function () {
        var env = {
            environmentName: "Fxp",
            serviceOffering: "Offline",
            serviceLine: "abcd",
            program: "Telemetry",
            capability: "1",
            componentName: "FxpCore"
        };
        var res;
        beforeEach(function () {
            telemetryContext.setEnvironmentDetails("Fxp",env);
            res = telemetryContext.getEnvironmentDetails("Fxp");
        });
        it("Then it should set environment details", function () {
            expect(telemetryContext._envData).not.toBeNull();
            expect(telemetryContext._envData).not.toBeUndefined();
        });
        it("Then it should get environmentName", function () {
            expect(res.environmentName).toEqual("Fxp");
        });
        it("Then it should get serviceOffering", function () {
            expect(res.serviceOffering).toEqual("Offline");
        });
        it("Then it should get serviceLine", function () {
            expect(res.serviceLine).toEqual("abcd");
        });
        it("Then it should get program", function () {
            expect(res.program).toEqual("Telemetry");
        });
        it("Then it should get capability", function () {
            expect(res.capability).toEqual("1");
        });
        it("Then it should get componentName", function () {
            expect(res.componentName).toEqual("FxpCore");
        });
    });
    describe("When we null environment scenarios", function () {
        it("Then it should throw exception for set environment details when null parameter is passed", function () {
            try {
                telemetryContext.setEnvironmentDetails("fxp",null);
            }
            catch (e) {
                expect(e.message).toEqual("Environment Data is required");
            }
        });
    });
    describe("When we have ContextChangeListener scenario", function () {
        it("Then it should add ContextChangeListener", function () {
            var listener = jasmine.createSpyObj("Listener", ["notify"]);
            listener.notify = jasmine.createSpy("notify").and.callFake(function () {
                console.log("I am from listner.notify")
            });
            spyOn(telemetryContext.contextChangeListeners, "push").and.callThrough();
            telemetryContext.addContextChangeListener(listener);
            expect(telemetryContext.contextChangeListeners.push).toHaveBeenCalledWith(listener);
        });
    });
    describe("When we have Global Property", function () {
        it("Then it should getGlobalProperty", function () {
            var res = telemetryContext.getGlobalPropertyBag();
            expect(res).toEqual(LogPropertyBag);
        });
        it("Then it should addToGlobalPropertyBag", function () {
            telemetryContext.addToGlobalPropertyBag("FXP", "1001");
            expect(telemetryContext._globalPropertyBag.addToBag).toHaveBeenCalledWith("FXP", "1001");
        });
        it("Then it should removeFromGlobalPropertyBag", function () {
            telemetryContext.removeFromGlobalPropertyBag("FXP");
            expect(telemetryContext._globalPropertyBag.removeFromBag).toHaveBeenCalledWith("FXP");
        });
    });
});
