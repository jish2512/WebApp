import {FxpConfigurationService} from '../js/services/FxpConfiguration';
declare var angular:any;
describe("Given FxpConfiguration", () => {
    beforeEach(angular.mock.module('FxPApp'));
    var fxpConfigurationService,propBag;
    beforeEach(function () {
        propBag = function () {
            return {
                addToBag: function (a, b) {
                    console.log('propbag =>' + a + ':' + b);
                }
            };
        }

    });

    beforeEach(angular.mock.inject(function (FxpConfigurationService) {
        fxpConfigurationService = FxpConfigurationService;
    }));


    describe("When config is present in TenantConfig", () => {
        var result;
        beforeEach(function () {
            window["tenantConfiguration"] = { name: "User", fullName: "Test User" };
            result = fxpConfigurationService.GetConfiguration("fullName");

        });
        it("Then it should return the value from tenantConfig", () => {
            expect(result).toEqual("Test User");
        });


    });

    describe("When config is not present in TenantConfig", function () {
        var result;
        beforeEach(function () {
            window["tenantConfiguration"] = { name: "User" };
            Object.defineProperty(fxpConfigurationService, 'FxpBaseConfiguration', {
                value: { fullName: "Test User", randomNumber: 5 }
            });
            result = fxpConfigurationService.GetConfiguration("fullName");
        });
        it("Then it should return the value from baseConfig", function () {
            expect(result).toEqual("Test User");
        });

    });

    describe("When config is not present in TenantConfig or baseConfig", function () {
        var result;
        beforeEach(function () {
            window["tenantConfiguration"] = { name: "User" };
            Object.defineProperty(fxpConfigurationService, 'FxpBaseConfiguration', {
                value: { fullName: "Test User", randomNumber: 5 }
            });
            Object.defineProperty(fxpConfigurationService, 'FxpAppSettings', {
                value: { SubscriptionId: 1, SubscriptionName: "fxpTest" }
            });

            result = fxpConfigurationService.GetConfiguration("SubscriptionName");
        });
        it("Then it should return the value from AppSettings", function () {
            expect(result).toEqual("fxpTest");
        });

    });

});
