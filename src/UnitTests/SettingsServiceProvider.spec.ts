import { SettingsType } from "../js/common/SettingsType";
import {SettingsServiceProvider} from '../js/provider/SettingsServiceProvider';
declare var angular:any;
describe("Given SettingsService Provider UT Suite", () => {
    var $httpBackend;
    var $q;
    var fxpConfigurationService;
    var $serviceIntervalSpy;
    var adalLoginHelperService;
    var fxpLogger;
    var $timeoutSpy;
    var propBagValue, propBag;
    var settingsService;
    var setConfig;
    beforeEach(angular.mock.module('FxPApp', function (SettingsServiceProvider) {
        setConfig = SettingsServiceProvider;
        setConfig.configure({ settingsServiceBaseUrl: "https://www.test.com" });
    }));
    beforeEach(function () {
        angular.mock.module(function ($provide) {
            $provide.service("AdalLoginHelperService", function () {
                this.accessTokenRequestInProgress = jasmine.createSpy("accessTokenRequestInProgress").and.returnValue(false);
                this.acquireToken = jasmine.createSpy("acquireToken").and.callFake(function (a, callback) {
                    callback(a);
                });
                this.getCachedToken = jasmine.createSpy("getCachedToken").and.returnValue("saff214454fds54545");
            });
            $provide.service("FxpLoggerService", function () {
                this.logInformation = jasmine.createSpy("logInformation").and.callFake(function (a, b) {
                    console.log("Inforamtion");
                    console.log(a + ':' + b);
                });
                this.logError = jasmine.createSpy("logError").and.callFake(function (a, b, c, d, e) {
                    propBagValue = e;
                    console.log(a + ':' + b);
                });
                this.logMetric = jasmine.createSpy("logMetric").and.callFake(function (a, b, c, d) {
                    console.log(a + ' - ' + b + ' - ' + c + ' - ' + d);
                });
                this.createPropertyBag = jasmine.createSpy("createPropertyBag").and.callFake(function (a, b) {
                    console.log(a + ' - ' + b); return new propBag();
                });
                this.stopTrackPerformance = jasmine.createSpy("stopTrackPerformance").and.callFake(function (a, b) {
                    console.log("stopTrackPerformance");
                    console.log(a + ' - ' + b);
                });
                this.startTrackPerformance = jasmine.createSpy("startTrackPerformance").and.callFake(function (a, b) {
                    console.log(a + ' - ' + b);
                });

            });
        });
    });
    beforeEach(angular.mock.inject(function (_$httpBackend_, AdalLoginHelperService, _$timeout_, _$q_, _SettingsService_) {
        $httpBackend = _$httpBackend_;
        $q = _$q_;
        adalLoginHelperService = AdalLoginHelperService;
        settingsService = _SettingsService_;
        $timeoutSpy = jasmine.createSpy('$timeout', _$timeout_).and.callThrough();
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 550000
    }));

    describe("When calling getSettings method of SettingService", () => {
        var res;
        var settingData = { "Dashboard": "DashBoard Settings", "User": "User Settings" };
        beforeEach(function () {
            $httpBackend.expectGET("https://www.test.com/User/v-jimazu/settings?settingNames=TestSettingName")
                .respond(200, settingData);
            settingsService.getSettings(SettingsType.User, "v-jimazu", "TestSettingName").then(function (response) {
                res = response.data;
            }).catch(function (ex) {
                res = ex
            });
            $httpBackend.flush();
        });
        it("Then it should return the settings Data", () => {
            expect(res.Dashboard).toEqual("DashBoard Settings");
        });
    });
    describe("When calling getSettings and adalrequest count reaches 5", () => {
        var res;
        var settingData = { "Dashboard": "DashBoard Settings", "User": "User Settings" };
        beforeEach(function () {
            adalLoginHelperService.accessTokenRequestInProgress = jasmine.createSpy("accessTokenRequestInProgress").and.callFake(function () { return true });
            settingsService.iReqCount = 4;
            settingsService.getSettings(SettingsType.User, "v-jimazu", "TestSettingName");
            $timeoutSpy.flush(1000);
        });
        it("Then it should call accessTokenRequestInProgress with https://www.test.com/User/v-jimazu/settings?settingNames=TestSettingName as url ", () => {
            expect(adalLoginHelperService.accessTokenRequestInProgress).toHaveBeenCalledWith("https://www.test.com/User/v-jimazu/settings?settingNames=TestSettingName");
        });
    });
    describe("When calling getSettings and adalrequest count not reaches 5", () => {
        var res;
        var settingData = { "Dashboard": "DashBoard Settings", "User": "User Settings" };
        beforeEach(function () {
            adalLoginHelperService.accessTokenRequestInProgress = jasmine.createSpy("accessTokenRequestInProgress").and.callFake(function () { return true });
            settingsService.iReqCount = 3;
            settingsService.getSettings(SettingsType.User, "v-jimazu", "TestSettingName");
            $timeoutSpy.flush(1000);
        });
        it("Then it should call accessTokenRequestInProgress with https://www.test.com/User/v-jimazu/settings?settingNames=TestSettingName as url ", () => {
            expect(adalLoginHelperService.accessTokenRequestInProgress).toHaveBeenCalledWith("https://www.test.com/User/v-jimazu/settings?settingNames=TestSettingName");
        });
    });
    describe("When calling getSettingsSvc method of SettingService and it throws exception", () => {
        var res;
        var settingData = { "Dashboard": "DashBoard Settings", "User": "User Settings" };
        beforeEach(function () {
            $httpBackend.expectGET("https://www.test.com/User/v-jimazu/settings?settingNames=TestSettingName")
                .respond(400, "Failed");
            settingsService.getSettings(SettingsType.User, "v-jimazu", "TestSettingName").then(function (response) {
                res = response.data;
            }).catch(function (ex) {
                res = ex
            });
            $httpBackend.flush();
        });
        it("Then it should throw exception", () => {
            expect(res.data).toEqual("Failed");
        });
    });
    describe("When calling saveSettings method of SettingService", () => {
        var res;
        var url = "/User/v-jimazu/settings";
        var settingData = { "Dashboard": "DashBoard Settings", "User": "User Settings" };
        beforeEach(function () {
            $httpBackend.expectPOST("https://www.test.com/User/v-jimazu/settings", { "settingName": "TestSettingName", "settingValue": "Test" })
                .respond(200, settingData);
            settingsService.saveSettings(SettingsType.User, "v-jimazu", "TestSettingName", "Test").then(function (response) {
                res = response.data;
            }).catch(function (ex) {
                res = ex
            });
            $httpBackend.flush();
        });
        it("Then it should save settings Data ", () => {
            expect(res.Dashboard).toEqual("DashBoard Settings");
        });
    });
    describe("When calling saveSettings and adalrequest count reaches 5", () => {
        var res;
        var settingData = { "Dashboard": "DashBoard Settings", "User": "User Settings" };
        beforeEach(function () {
            adalLoginHelperService.accessTokenRequestInProgress = jasmine.createSpy("accessTokenRequestInProgress").and.callFake(function () { return true });
            settingsService.iReqCount = 4;
            settingsService.saveSettings(SettingsType.User, "v-jimazu", "TestSettingName", "Test");
            $timeoutSpy.flush(1000);
        });
        it("Then it should call accessTokenRequestInProgress with https://www.test.com/User/v-jimazu/settings as url ", () => {
            expect(adalLoginHelperService.accessTokenRequestInProgress).toHaveBeenCalledWith("https://www.test.com/User/v-jimazu/settings");
        });
    });
    describe("When calling saveSettings and adalrequest count not reaches 5", () => {
        var res;
        var settingData = { "Dashboard": "DashBoard Settings", "User": "User Settings" };
        beforeEach(function () {
            adalLoginHelperService.accessTokenRequestInProgress = jasmine.createSpy("accessTokenRequestInProgress").and.callFake(function () { return true });
            settingsService.iReqCount = 3;
            settingsService.saveSettings(SettingsType.User, "v-jimazu", "TestSettingName", "Test");
            $timeoutSpy.flush(1000);
        });
        it("Then it should call accessTokenRequestInProgress with https://www.test.com/User/v-jimazu/settings as url ", () => {
            expect(adalLoginHelperService.accessTokenRequestInProgress).toHaveBeenCalledWith("https://www.test.com/User/v-jimazu/settings");
        });
    });
    describe("When calling saveSettings method of SettingService and throws exception", () => {
        var res;
        var settingData = { "Dashboard": "DashBoard Settings", "User": "User Settings" };
        beforeEach(function () {
            $httpBackend.expectPOST("https://www.test.com/User/v-jimazu/settings", { "settingName": "TestSettingName", "settingValue": "Test" })
                .respond(400, "Failed");
            settingsService.saveSettings(SettingsType.User, "v-jimazu", "TestSettingName", "Test").then(function (response) {
                res = response.data;
            }).catch(function (ex) {
                res = ex
            });
            $httpBackend.flush();
        });
        it("Then it should throw exception", () => {
            expect(res.data).toEqual("Failed");
        });
    });
});