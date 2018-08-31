/// <chutzpah_reference path="../lib/jasmine-2.4.0/mock-ajax.js" />
import{SessionTimeoutModalFactory} from '../js/factory/SessionTimeoutModalFactory';
declare var angular:any;
describe("Given SessionTimeoutModalFactory", () => {
    var sessionTimeoutModalFactory, modalService, fxpConfigurationService, fxplogger,  activityMonitor;
    beforeEach(angular.mock.module('FxPApp'));
    beforeEach(angular.mock.module('ui.router'));
    beforeEach(() => {
        sessionStorage.clear();
        sessionStorage["alias-userInfo"] = "{ \"name\": \"test user\" }";
        angular.mock.module(function ($provide) {
            $provide.service("$uibModal", function () {
                this.open = jasmine.createSpy("open").and.callFake(function () { });
            });
            $provide.service("FxpLoggerService", function () {
                this.createPropertyBag = jasmine.createSpy("createPropertyBag").and.callFake(function () {
                    return {
                        addToBag: jasmine.createSpy("addToBag").and.callFake(function (a, b) {
                            console.log('propbag =>' + a + ':' + b);
                        })
                    };
                });

                this.createMetricBag = jasmine.createSpy("createMetricBag").and.callFake(function () {
                    return {
                        addToBag: jasmine.createSpy("addToBag").and.callFake(function (a, b) {
                            console.log('propbag =>' + a + ':' + b);
                        })
                    };
                });

                this.logEvent = jasmine.createSpy("logEvent").and.callFake(function (a, b, c, d) {
                    console.log('logEvent : ' + a + ',' + b + ',' + c + ',' + d);
                });

                this.logTrace = jasmine.createSpy("logTrace").and.callFake(function (a, b) {
                    console.log('logTrace : ' + a + ',' + b);
                });

                this.logError = jasmine.createSpy("logError").and.callFake(function (a, b, c, d, e) {
                    console.log('logError : ' + a + ',' + b + ',' + c + ',' + d + ',' + e);
                });

                this.setOBOUserContext = jasmine.createSpy("setOBOUserContext").and.callFake(function (a, b, c, d, e) {
                    console.log('setOBOUserContext : ' + a + ',' + b + ',' + c + ',' + d + ',' + e);
                });

                this.logInformation = jasmine.createSpy("logInformation").and.callFake(function (a, b, c) {
                    console.log('logInformation : ' + a + ',' + b + ',' + c);
                });
            });

            $provide.service("ActivityMonitor", function () {
                this.options = { "inactive": 0 };
                this.on = jasmine.createSpy("on").and.callFake(function (name, callback) {
                    callback();
                });
            });
            $provide.service("FxpConfigurationService", function () {
                this.FxpAppSettings = { "SessionTimeoutDurationInSeconds": 10 };
            });
        });

    });
    beforeEach(angular.mock.inject(($uibModal, FxpConfigurationService, FxpLoggerService,  ActivityMonitor, _SessionTimeoutModalFactory_) => {
        modalService = $uibModal;
        fxpConfigurationService = FxpConfigurationService;
       
        fxplogger = FxpLoggerService;
        activityMonitor = ActivityMonitor;

        sessionTimeoutModalFactory = _SessionTimeoutModalFactory_;
    }));

    // describe("When showSessionTimeoutModal method have been called", () => {
    //    beforeEach(() => {
    //        sessionTimeoutModalFactory.showSessionTimeoutModal();
    //    });
    //    it("self.modalService.open to have been called", () => {
    //        expect(modalService.open).toHaveBeenCalled();
    //    });
    // });


    //describe("When SessionTimeoutModal is initialized", () => {
    //    beforeEach(() => {
    //        sessionTimeoutModalFactory.init();
    //    });
    //    it("timeout is set to session timeoutduration from appsettings", () => {
    //        expect(activityMonitor.options.inactive).toBe(fxpConfigurationService.FxpAppSettings.SessionTimeoutDuration);
    //    });
    //    //it("self.modalService.open to have been called", () => {
        //    expect(modalService.open).toHaveBeenCalled();
        //});

        //it("session timeout event is logged", () => {
        //    expect(fxplogger.logEvent).toHaveBeenCalled();
        //});
    });