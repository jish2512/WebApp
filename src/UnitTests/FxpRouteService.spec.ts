/// <reference path="../typings/jasmine.d.ts" />
import { IRootScope } from "../js/interfaces/IRootScope";
import { ILogger } from "../js/interfaces/ILogger";
import { FxpConstants } from "../js/common/ApplicationConstants";
import { Resiliency } from "../js/resiliency/FxpResiliency";
import {FxpRouteService} from "../js/services/FxpRouteService";
declare var angular:any;
describe('Given FxpRouteService Suite', function () {
    var state, rootScope, fxpRouteService, userProfileService, userInfoService, fxpLoggerService, propBag, event, sessionData, propBagValue, fxpBreadcrumbService;
    event = {};
    sessionData = JSON.stringify({ "Upn": "v-sabyra@microsoft.com", "Applications": { "OneProfile": { "ApplicationName": "OneProfile", "Roles": { "ProfileAdmin": { "RoleName": "ProfileAdmin", "Permissions": [{ "ResourceName": "BulkAccreditation", "ResourceOperation": "view" }, { "ResourceName": "OnBehalfOfUser", "ResourceOperation": "manage" }, { "ResourceName": "ResourceAccreditation", "ResourceOperation": "manage" }, { "ResourceName": "ResourceAccreditation", "ResourceOperation": "view" }, { "ResourceName": "ResourceDelegationDetails", "ResourceOperation": "manage" }, { "ResourceName": "ResourceDelegationDetails", "ResourceOperation": "view" }, { "ResourceName": "ResourceJobSkillDetails", "ResourceOperation": "manage" }, { "ResourceName": "ResourceJobSkillDetails", "ResourceOperation": "view" }, { "ResourceName": "ResourceNationality", "ResourceOperation": "manage" }, { "ResourceName": "ResourceNationality", "ResourceOperation": "view" }, { "ResourceName": "ResourcePassportDetail", "ResourceOperation": "manage" }, { "ResourceName": "ResourcePassportDetail", "ResourceOperation": "view" }, { "ResourceName": "ResourceProfessionalCertification", "ResourceOperation": "manage" }, { "ResourceName": "ResourceProfessionalCertification", "ResourceOperation": "view" }, { "ResourceName": "ResourceSecurityClearance", "ResourceOperation": "manage" }, { "ResourceName": "ResourceSecurityClearance", "ResourceOperation": "view" }, { "ResourceName": "ResourceServiceProfile", "ResourceOperation": "manage" }, { "ResourceName": "ResourceServiceProfile", "ResourceOperation": "view" }, { "ResourceName": "ResourceVisaDetails", "ResourceOperation": "manage" }, { "ResourceName": "ResourceVisaDetails", "ResourceOperation": "view" }, { "ResourceName": "ResourceWeeklyShiftPlan", "ResourceOperation": "manage" }, { "ResourceName": "ResourceWeeklyShiftPlan", "ResourceOperation": "view" }] }, "ResourceProfileReader": { "RoleName": "ResourceProfileReader", "Permissions": [{ "ResourceName": "ResourceAccreditation", "ResourceOperation": "view" }, { "ResourceName": "ResourceDelegationDetails", "ResourceOperation": "view" }, { "ResourceName": "ResourceJobSkillDetails", "ResourceOperation": "view" }, { "ResourceName": "ResourceProfessionalCertification", "ResourceOperation": "view" }, { "ResourceName": "ResourceServiceProfile", "ResourceOperation": "view" }, { "ResourceName": "ResourceWeeklyShiftPlan", "ResourceOperation": "view" }] } } }, "GlobalResourceManagement": { "ApplicationName": "GlobalResourceManagement", "Roles": { "Admin": { "RoleName": "Admin", "Permissions": [{ "ResourceName": "GetCalendarItems", "ResourceOperation": "Manage" }, { "ResourceName": "GetCalendarItems", "ResourceOperation": "View" }] }, "GeneralUser": { "RoleName": "GeneralUser", "Permissions": [] }, "Requestor": { "RoleName": "Requestor", "Permissions": [] }, "Resource": { "RoleName": "Resource", "Permissions": [] } } }, "fieldexprience": { "ApplicationName": "fieldexprience", "Roles": { "FxPAdmin": { "RoleName": "FxPAdmin", "Permissions": [{ "ResourceName": "LeftNav", "ResourceOperation": "Read" }, { "ResourceName": "Settings", "ResourceOperation": "Read" }, { "ResourceName": "Settings", "ResourceOperation": "Write" }] } } } } });
    sessionStorage["fxpUserClaims_v-sabyra"] = sessionData;
    event.preventDefault = jasmine.createSpy("preventDefault").and.callFake(function () {
        console.log("");
    });
    beforeEach(function () {
        angular.mock.module('FxPApp');
        propBag = function () {
            return {
                addToBag: function (a, b) {
                    console.log('propbag =>' + a + ':' + b);
                }
            };
        }
        angular.mock.module(function ($provide) {
            $provide.service("$state", function () {
                this.go = jasmine.createSpy("go").and.callFake(function (key, value) {
                    console.log(key);
                });
                this.get = jasmine.createSpy("go").and.callFake(function () {
                    return [];
                });
                this.href = jasmine.createSpy("href").and.callFake(function () {
                    return "#/TempUrl";
                });
                this.current = { name: "personalization" };
            });
            $provide.service("UserInfoService", function () {
                this.isActingOnBehalfOf = jasmine.createSpy("isActingOnBehalfOf").and.callFake(function () {
                    return true;
                });
                this.getLoggedInUser = jasmine.createSpy("getLoggedInUser").and.callFake(function () {
                    return "v-sabyra";
                });
                this.getCurrentUser = jasmine.createSpy("getCurrentUser").and.callFake(function () {
                    return "v-nagowd";
                });
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
            $provide.service("UserProfileService", function () {
                this.getUserClaims = jasmine.createSpy("getUserClaims").and.callFake(function () {
                    return {
                        "Roles": {
                            "FxPAdmin": {
                                "RoleName": "FxPAdmin",
                                "Permissions": [{ "ResourceName": "LeftNav", "ResourceOperation": "Delete" },
                                    { "ResourceName": "LeftNav", "ResourceOperation": "Read" },
                                    { "ResourceName": "LeftNav", "ResourceOperation": "Write" }, { "ResourceName": "Settings", "ResourceOperation": "Delete" }, { "ResourceName": "Settings", "ResourceOperation": "Read" }, { "ResourceName": "Settings", "ResourceOperation": "Write" }]
                            }
                        }
                    }
                });
            });
            $provide.service("FxpBreadcrumbService", function () {
                this.setTempBreadcrumbArray = jasmine.createSpy("setTempBreadcrumbArray").and.callFake(function () {
                    console.log("setTempBreadcrumbArray");
                });
            });

        });
    });

    beforeEach(angular.mock.inject(function ($state, _$rootScope_, FxpLoggerService, UserInfoService, FxpBreadcrumbService, FxpRouteService) {
        state = $state;
        rootScope = _$rootScope_;
        rootScope.fxpUIConstants = {
            UIMessages:
            {
                AuthanticationExceptionMessage: {
                    ErrorMessage: "You do not have sufficient privileges to perform this operation, please contact IT support."
                },
                AuthServiceReturnsBlankAppError: {
                    ErrorMessageTitle: "title"
                }
            },
            UIStrings: {
                AdminUIStrings: {
                    FxpAdminMessage: "Fxp Admin Message"
                }
            }
        };
        fxpLoggerService = FxpLoggerService;
        userInfoService = UserInfoService;
        fxpBreadcrumbService = FxpBreadcrumbService
        fxpRouteService = FxpRouteService;
    }));

    describe("When calling navigatetoSpecificState ", function () {
        beforeEach(function () {
            rootScope.startTime = 0;
            rootScope.pageLoadMetrics = {
                "sourceRoute": "",
                "destinationRoute": "",
                "pageTransitionStatus": "",
                "stateChangeDuration": 0,
                "viewLoadDuration": 0,
                "statePageLoadError": "",
                "viewPageLoadError": "",
                "totalDuration": 0
            };
            fxpRouteService.navigatetoSpecificState("actonBehalf");
        });
        it('Then it should go to the particular state', function () {
            expect(fxpRouteService.stateGo.go).toHaveBeenCalledWith("actonBehalf");
        });        
    });
    describe("When calling navigatetoSpecificState with optional parameters", function () {
        beforeEach(function () {
            rootScope.startTime = 0;
            rootScope.pageLoadMetrics = {
                "sourceRoute": "",
                "destinationRoute": "",
                "pageTransitionStatus": "",
                "stateChangeDuration": 0,
                "viewLoadDuration": 0,
                "statePageLoadError": "",
                "viewPageLoadError": "",
                "totalDuration": 0
            };
            fxpRouteService.navigatetoSpecificState("actonBehalf", {});
        });
        it('Then it should go to the particular state with params', function () {
            expect(fxpRouteService.stateGo.go).toHaveBeenCalledWith("actonBehalf", {});
        });        
    });
    describe("When calling navigateToSpecificUrl without optional parameters", function () {
        beforeEach(function () {
            //spyOn(window, "open").and.callThrough();
            fxpRouteService.navigateToSpecificUrl('#/navigateUrl');
        });
        it('Then window.open should have been called with params', function () {
            expect(window.open).toHaveBeenCalledWith("#/navigateUrl", '_self', "", false);
        });
    });
    describe("When calling navigateToSpecificUrl with optional parameters like target,features,replace", function () {
        beforeEach(function () {
            //spyOn(window, "open").and.callThrough();
            fxpRouteService.navigateToSpecificUrl('#/navigateUrl', '_blank', "width=200", true);
        });
        it('Then window.open should have been called with params', function () {
            expect(window.open).toHaveBeenCalledWith("#/navigateUrl", '_blank', "width=200", true);
        });
    });
    describe("When calling navigateToUrl without optional parameters", function () {
        beforeEach(function () {
            //spyOn(window, "open").and.callThrough();
            fxpRouteService.navigateToUrl('#/navigateUrl');
        });
        it('Then window.open should have been called with params', function () {
            expect(window.open).toHaveBeenCalledWith("#/navigateUrl", '_self', "", false);
        });
    });
    describe("When calling navigateToUrl with optional parameters like target,features,replace", function () {
        beforeEach(function () {
            //spyOn(window, "open").and.callThrough();
            fxpRouteService.navigateToUrl('#/navigateUrl', '_blank', "width=200", true);
        });
        it('Then setTempBreadcrumbArray of fxpBreadcrumbService should have been called', function () {
            expect(fxpBreadcrumbService.setTempBreadcrumbArray).toHaveBeenCalledWith("#/navigateUrl");
        });
        it('Then window.open should have been called with params', function () {
            expect(window.open).toHaveBeenCalledWith("#/navigateUrl", '_blank', "width=200", true);
        });
    });

    describe("When calling navigatetoSpecificState passing state with missing dependency", function () {
        beforeEach(function () {
            rootScope.startTime = 0;
            rootScope.pageLoadMetrics = {
                "sourceRoute": "",
                "destinationRoute": "",
                "pageTransitionStatus": "",
                "stateChangeDuration": 0,
                "viewLoadDuration": 0,
                "statePageLoadError": "",
                "viewPageLoadError": "",
                "totalDuration": 0
            };
            fxpRouteService.navigatetoSpecificState("stateWithMissingModule");
            Resiliency.statesWithMissingModules = ['stateWithMissingModule'];
        });
        it('Then it should not navigate to specific state', function () {
            expect(fxpRouteService.stateGo.go).not.toHaveBeenCalledWith();

        });
    });

});