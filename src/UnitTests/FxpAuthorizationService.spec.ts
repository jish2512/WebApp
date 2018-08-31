import {FxpAuthorizationService} from '../js/services/FxpAuthorizationService';
declare var angular:any;
describe("Given FxpAuthorizationService UT Suite", () => {
    var $state, $rootScope, states, stateGo, rootScope, userProfileService, userInfoService, fxpLoggerService, fxpConfigurationService, $filter, fxpAuthorizationService, fxpUIConstants;
    beforeEach(angular.mock.module('FxPApp'));
    beforeEach(angular.mock.module('ui.router'));
    beforeEach(function () {
        fxpUIConstants = {

            "UIStrings":
            {
                UnauthorizedUIString: "Current user doesn't have enough permission to access "
            }
        }
        angular.mock.module(function ($provide) {

            $provide.service("UserProfileService", function () {
                this.getUserClaims = jasmine.createSpy("getUserClaims").and.callFake(function (a) {
                    console.log('getUserClaims : ' + a);
                });
                this.setCurrentUser = jasmine.createSpy("setCurrentUser").and.callFake(function (a) {
                    console.log('setCurrentUser : ' + a);
                });
                this.isObo = jasmine.createSpy("isObo").and.callFake(function () {
                    console.log('isObo : ');
                    return false;
                });
            });
            $provide.service("FxpConfigurationService", function () {
                this.FxpBaseConfiguration =
                    {
                        "AuthorizationRules": [
                            {
                                "StateName": "adminactonbehalf",
                                "AllowedRoles": ["GlobalResourceManagement.Admin", "FieldExperience.FxPAdmin"],
                                "AllRolesMandatory": true
                            },
                            {
                                "StateName": "UserLookupPersonalization",
                                "AllowedRoles": ["FieldExperience.LeftNavAdmin"],
                                "AllRolesMandatory": false
                            },
                            {
                                "StateName": "LeftNavPersonalization",
                                "AllowedRoles": ["FieldExperience.LeftNavAdmin"],
                                "AllRolesMandatory": true
                            }]
                    }
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

                this.logWarning = jasmine.createSpy("logWarning").and.callFake(function (a, b, c) {
                    console.log('logWarning : ' + a + ',' + b + ',' + c);
                });

                this.setOBOUserContext = jasmine.createSpy("setOBOUserContext").and.callFake(function (a, b, c, d, e) {
                    console.log('setOBOUserContext : ' + a + ',' + b + ',' + c + ',' + d + ',' + e);
                });
            });

            $provide.service("UserInfoService", function () {
                this.getGeography = jasmine.createSpy("getGeography").and.callFake(function () {
                    return "12.021.212";
                });
                this.getCurrentUser = jasmine.createSpy("getCurrentUser").and.callFake(function () {
                    console.log('getCurrentUser : ');
                    return "alias";
                });
            });
        });
    });
    beforeEach(angular.mock.inject(function (_$state_, _$rootScope_, FxpLoggerService, UserProfileService, UserInfoService, FxpConfigurationService, _$filter_, _FxpAuthorizationService_) {
        $state = _$state_;
        $rootScope = _$rootScope_;
        states = $state.get();
        stateGo = $state;
        $rootScope = fxpUIConstants;
        userProfileService = UserProfileService;
        userInfoService = UserInfoService;
        fxpLoggerService = FxpLoggerService;
        fxpConfigurationService = FxpConfigurationService;
        $filter = $filter;
        fxpAuthorizationService = _FxpAuthorizationService_;
    }));

    describe("When checkStatePermission method gets called with isAuthorized as true", () => {
        var dashboard = "Dashboard";
        beforeEach(function () {
            var event = { preventDefault: function () { } };
            spyOn(fxpAuthorizationService, 'isAuthorized').and.returnValue(true);
            fxpAuthorizationService.checkStatePermission(event, dashboard);
        });
        it("Then isAuthorized method should have been called", () => {
            expect(fxpAuthorizationService.isAuthorized).toHaveBeenCalledWith(dashboard);
        });
    });

    describe("When checkStatePermission method gets called with isAuthorized as false", () => {
        var dashboard = "Dashboard";
        beforeEach(function () {
            var event = { preventDefault: function () { } };
            spyOn(fxpAuthorizationService, 'isAuthorized').and.returnValue(false);
            spyOn(fxpAuthorizationService, 'redirectToUnauthorizedState');
            fxpAuthorizationService.checkStatePermission(event, dashboard);
        });
        it("Then redirectToUnauthorizedState method should have been called", () => {
            expect(fxpAuthorizationService.redirectToUnauthorizedState).toHaveBeenCalled();
        });
    });

    describe("When isAuthorized method gets called with statename as adminactonbehalf", () => {
        var stateName = "adminactonbehalf", result;
        beforeEach(function () {
            result = fxpAuthorizationService.isAuthorized(stateName);
        });
        it("Then getUserClaims method should have been called", () => {
            expect(userProfileService.getUserClaims).toHaveBeenCalled();
        });
        it("Then isAuthorized should return false", () => {
            expect(result).toEqual(false);
        });
    });

    describe("When isAuthorized method gets called with statename as dashboard", () => {
        var stateName = "Dashboard", result;
        beforeEach(function () {
            result = fxpAuthorizationService.isAuthorized(stateName);
        });
        it("Then getUserClaims method should have been called", () => {
            expect(result).toEqual(true);
        });
    });

    describe("When isAuthorized method gets called with statename as dashboard and AllRolesMandatory as false", () => {
        var stateName = "UserLookupPersonalization", result;
        beforeEach(function () {
            result = fxpAuthorizationService.isAuthorized(stateName);
        });
        it("Then isAuthorized method should have been called and response should be false", () => {
            expect(result).toEqual(false);
        });
    });

    describe("When redirectToUnauthorizedState method gets called ", () => {
        var stateName = "adminactonbehalf";
        beforeEach(function () {
            var event = { preventDefault: function () { } };
            spyOn($state, 'go');
            fxpAuthorizationService.redirectToUnauthorizedState(event, stateName);
        });
        it("Then getCurrentUser method should have been called", () => {
            expect(userInfoService.getCurrentUser).toHaveBeenCalled();
        });
        it("Then logWarning method should have been called", () => {
            expect(fxpLoggerService.logWarning).toHaveBeenCalled();
        });
        it("Then $state.go method should have been called", () => {
            expect($state.go).toHaveBeenCalled();
        });
    });
});